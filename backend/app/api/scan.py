"""
Gmail scanning API endpoints.
Privacy-first design: Only accesses email metadata, never content.
"""

import asyncio
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from app.core.config import settings
from app.core.security import session_manager, scan_results_manager
from app.api.oauth import get_credentials_from_session
from app.utils.email_parser import (
    extract_domain_from_email,
    is_signup_email,
    build_gmail_search_query,
    deduplicate_services
)
from app.utils.domain_classifier import (
    get_service_info,
    calculate_data_value,
    get_logo_url
)
from app.utils.ai_client import ai_client
from app.models.schemas import (
    ScanStartRequest, ScanStartResponse,
    ScanProgressResponse, ScanResultsResponse,
    Service, ServiceCategory
)

router = APIRouter(prefix="/scan", tags=["Scanning"])

# Rate limiting
SCAN_COOLDOWN = 60  # seconds between scans


@router.post("/start", response_model=ScanStartResponse)
async def start_scan(
    request: ScanStartRequest,
    background_tasks: BackgroundTasks
):
    """
    Start Gmail metadata scan.
    
    Only scans email headers (From, Subject, Date).
    Never accesses email body content.
    """
    session = session_manager.get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    
    # Check for existing scan
    existing_progress = scan_results_manager.get_progress(request.session_id)
    if existing_progress and existing_progress.get("status") == "in_progress":
        raise HTTPException(
            status_code=409, 
            detail="Scan already in progress"
        )
    
    # Initialize progress
    scan_results_manager.set_progress(
        request.session_id,
        {
            "status": "in_progress",
            "progress": 0,
            "total_emails": 0,
            "services_found": 0,
            "current_step": "Initializing scan...",
            "started_at": datetime.utcnow().isoformat()
        }
    )
    
    # Start background scan
    background_tasks.add_task(
        perform_scan,
        request.session_id,
        request.years_back
    )
    
    return ScanStartResponse(
        scan_id=request.session_id,
        status="started",
        message="Scan initiated. Check /scan/progress for updates."
    )


@router.get("/progress", response_model=ScanProgressResponse)
async def get_scan_progress(session_id: str):
    """Get current scan progress."""
    progress = scan_results_manager.get_progress(session_id)
    
    if not progress:
        return ScanProgressResponse(
            status="not_started",
            progress=0,
            services_found=0
        )
    
    return ScanProgressResponse(
        status=progress.get("status", "unknown"),
        progress=progress.get("progress", 0),
        total_emails=progress.get("total_emails"),
        services_found=progress.get("services_found", 0),
        current_step=progress.get("current_step"),
        error=progress.get("error")
    )


@router.get("/results", response_model=ScanResultsResponse)
async def get_scan_results(session_id: str):
    """
    Get scan results.
    
    Returns list of discovered services with metadata.
    No email content is included.
    """
    progress = scan_results_manager.get_progress(session_id)
    
    if not progress:
        raise HTTPException(status_code=404, detail="No scan found")
    
    if progress.get("status") != "completed":
        raise HTTPException(
            status_code=400, 
            detail=f"Scan status: {progress.get('status')}"
        )
    
    results = scan_results_manager.get_results(session_id)
    
    if not results:
        raise HTTPException(status_code=404, detail="Results expired or not found")
    
    return ScanResultsResponse(
        services=results.get("services", []),
        scan_duration=results.get("scan_duration"),
        total_emails_scanned=results.get("total_emails_scanned", 0),
        completed_at=results.get("completed_at")
    )


@router.delete("/cancel")
async def cancel_scan(session_id: str):
    """Cancel an in-progress scan."""
    progress = scan_results_manager.get_progress(session_id)
    
    if not progress:
        raise HTTPException(status_code=404, detail="No scan found")
    
    if progress.get("status") != "in_progress":
        return {"status": "not_running", "message": "No scan in progress"}
    
    # Mark as cancelled
    progress["status"] = "cancelled"
    scan_results_manager.set_progress(session_id, progress)
    
    return {"status": "cancelled", "message": "Scan cancellation requested"}


async def perform_scan(session_id: str, years_back: int = 5):
    """
    Perform Gmail metadata scan.
    
    This is a background task that:
    1. Searches for signup-related emails
    2. Extracts sender domains
    3. Categorizes services
    4. Calculates data value estimates
    
    PRIVACY: Only accesses headers, never email content.
    """
    try:
        print(f"[SCAN] Starting scan for session: {session_id[:10]}...")
        credentials = get_credentials_from_session(session_id)
        print(f"[SCAN] Got credentials, token present: {bool(credentials.token)}")
        service = build('gmail', 'v1', credentials=credentials)
        print("[SCAN] Gmail service built successfully")
        
        # Update progress
        def update_progress(updates: dict):
            progress = scan_results_manager.get_progress(session_id) or {}
            progress.update(updates)
            scan_results_manager.set_progress(session_id, progress)
        
        # Check if cancelled
        def is_cancelled() -> bool:
            progress = scan_results_manager.get_progress(session_id)
            return progress and progress.get("status") == "cancelled"
        
        # Build search query
        search_query = build_gmail_search_query(years_back)
        print(f"[SCAN] Search query: {search_query[:100]}...")
        
        update_progress({
            "current_step": "Searching for signup emails...",
            "progress": 10
        })
        print("[SCAN] Updated progress to 10%")
        
        # Get message IDs
        all_message_ids = []
        page_token = None
        
        print("[SCAN] Starting Gmail API query...")
        while True:
            if is_cancelled():
                return
            
            results = service.users().messages().list(
                userId='me',
                q=search_query,
                maxResults=500,
                pageToken=page_token
            ).execute()
            
            messages = results.get('messages', [])
            print(f"[SCAN] Got {len(messages)} messages in this batch")
            all_message_ids.extend([m['id'] for m in messages])
            
            page_token = results.get('nextPageToken')
            if not page_token or len(all_message_ids) >= settings.MAX_SCAN_EMAILS:
                break
        
        total_emails = min(len(all_message_ids), settings.MAX_SCAN_EMAILS)
        print(f"[SCAN] Total emails found: {total_emails}")
        
        update_progress({
            "current_step": f"Found {total_emails} potential signup emails",
            "total_emails": total_emails,
            "progress": 20
        })
        
        # Process emails in batches
        discovered_services = {}
        batch_size = 50
        processed = 0
        
        print(f"[SCAN] Processing {total_emails} emails in batches of {batch_size}")
        for i in range(0, total_emails, batch_size):
            if is_cancelled():
                return
            
            batch_ids = all_message_ids[i:i+batch_size]
            print(f"[SCAN] Processing batch {i//batch_size + 1}, emails {i} to {i+len(batch_ids)}")
            
            # Fetch email headers only
            for msg_id in batch_ids:
                if is_cancelled():
                    return
                
                try:
                    # Only request headers, not body
                    msg = service.users().messages().get(
                        userId='me',
                        id=msg_id,
                        format='metadata',
                        metadataHeaders=['From', 'Subject', 'Date']
                    ).execute()
                    
                    headers = {h['name']: h['value'] for h in msg.get('payload', {}).get('headers', [])}
                    from_header = headers.get('From', '')
                    subject = headers.get('Subject', '')
                    date = headers.get('Date', '')
                    
                    # Extract domain
                    domain = extract_domain_from_email(from_header)
                    if not domain:
                        continue
                    if domain in discovered_services:
                        continue
                    
                    # Check if it's a signup email (only uses subject)
                    is_signup = is_signup_email(subject)
                    if is_signup:
                        print(f"[SCAN] Found signup email from: {domain}")
                    else:
                        continue
                    
                    # Get service info (may be None for unknown domains)
                    service_info = get_service_info(domain) or {}
                    
                    # If unknown, try AI categorization
                    if not service_info.get("name"):
                        if ai_client.is_available():
                            ai_info = await ai_client.categorize_service(domain, subject)
                            if ai_info:
                                service_info = {
                                    "name": ai_info.get("service_name", domain),
                                    "category": ai_info.get("category", "Other"),
                                    "sensitivity": ai_info.get("data_sensitivity", 5),
                                    "privacy_email": ai_info.get("privacy_email")
                                }
                    
                    # Create service entry
                    category = service_info.get("category", "Other")
                    sensitivity = service_info.get("sensitivity", 5)
                    
                    # Calculate a simple data value estimate based on sensitivity
                    data_value = round(sensitivity * 2.5, 2)  # Simple formula: $2.50 per sensitivity point
                    
                    discovered_services[domain] = Service(
                        id=domain,
                        domain=domain,
                        name=service_info.get("name", domain.split('.')[0].title()),
                        category=ServiceCategory(category) if category in [e.value for e in ServiceCategory] else ServiceCategory.OTHER,
                        logo_url=get_logo_url(domain),
                        first_seen=date,
                        data_sensitivity=sensitivity,
                        estimated_data_value=data_value,
                        privacy_email=service_info.get("privacy_email", f"privacy@{domain}"),
                        breach_status="unknown"
                    )
                    print(f"[SCAN] Added service: {domain}")
                    
                except HttpError as e:
                    if e.resp.status == 429:
                        # Rate limited, wait and retry
                        await asyncio.sleep(2)
                    continue
                except Exception as ex:
                    print(f"[SCAN] Error processing email: {ex}")
                    continue
            
            processed += len(batch_ids)
            progress_pct = 20 + int((processed / total_emails) * 70)
            print(f"[SCAN] Progress: {progress_pct}%, services found: {len(discovered_services)}")
            
            update_progress({
                "current_step": f"Analyzing emails... ({processed}/{total_emails})",
                "progress": progress_pct,
                "services_found": len(discovered_services)
            })
        
        # Deduplicate services
        services_list = list(discovered_services.values())
        
        # Calculate scan duration
        progress = scan_results_manager.get_progress(session_id)
        started_at = datetime.fromisoformat(progress.get("started_at", datetime.utcnow().isoformat()))
        duration = (datetime.utcnow() - started_at).total_seconds()
        
        # Store results
        scan_results_manager.set_results(
            session_id,
            {
                "services": [s.dict() for s in services_list],
                "scan_duration": duration,
                "total_emails_scanned": processed,
                "completed_at": datetime.utcnow().isoformat()
            }
        )
        
        # Mark complete
        update_progress({
            "status": "completed",
            "progress": 100,
            "current_step": "Scan complete!",
            "services_found": len(services_list)
        })
        
    except Exception as e:
        import traceback
        print(f"[SCAN ERROR] {str(e)}")
        traceback.print_exc()
        # Update progress with error
        scan_results_manager.set_progress(
            session_id,
            {
                "status": "error",
                "progress": 0,
                "error": str(e),
                "current_step": "Scan failed"
            }
        )

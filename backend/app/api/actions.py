"""
Privacy action API endpoints.
Handles deletion requests, email generation, and kill switch.
"""

from typing import List
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.security import scan_results_manager, session_manager
from app.utils.ai_client import ai_client
from app.utils.domain_classifier import get_service_info
from app.models.schemas import Service

router = APIRouter(prefix="/actions", tags=["Privacy Actions"])


class DeleteRequestItem(BaseModel):
    domain: str
    service_name: str
    regulation: str = "GDPR"


class BulkDeleteRequest(BaseModel):
    session_id: str
    services: List[DeleteRequestItem]


class BulkDeleteResponse(BaseModel):
    generated: int
    emails: List[dict]


@router.post("/generate-deletion-emails", response_model=BulkDeleteResponse)
async def generate_deletion_emails(request: BulkDeleteRequest):
    """
    Generate deletion request emails for multiple services.
    
    Returns ready-to-send emails with GDPR/CCPA compliant content.
    """
    session = session_manager.get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    user_email = session.get("user_email", "[YOUR_EMAIL]")
    emails = []
    
    for item in request.services:
        # Generate email
        email_content = await ai_client.generate_deletion_email(
            service_name=item.service_name,
            domain=item.domain,
            user_email=user_email,
            regulation=item.regulation
        )
        
        # Get privacy contact
        service_info = get_service_info(item.domain)
        privacy_email = service_info.get("privacy_email") or f"privacy@{item.domain}"
        
        emails.append({
            "domain": item.domain,
            "service_name": item.service_name,
            "to_email": privacy_email,
            "subject": email_content["subject"],
            "body": email_content["body"],
            "regulation": item.regulation,
            "mailto_link": create_mailto_link(
                to=privacy_email,
                subject=email_content["subject"],
                body=email_content["body"]
            )
        })
    
    return BulkDeleteResponse(
        generated=len(emails),
        emails=emails
    )


def create_mailto_link(to: str, subject: str, body: str) -> str:
    """Create a mailto: link with pre-filled content."""
    import urllib.parse
    
    params = urllib.parse.urlencode({
        "subject": subject,
        "body": body
    })
    
    return f"mailto:{to}?{params}"


@router.get("/service-details/{domain}")
async def get_service_details(session_id: str, domain: str):
    """
    Get detailed information about a service for action planning.
    """
    results = scan_results_manager.get_results(session_id)
    if not results:
        raise HTTPException(status_code=404, detail="No scan results")
    
    services = results.get("services", [])
    breaches = results.get("breaches", {})
    
    # Find the service
    service = next(
        (s for s in services if s.get("domain") == domain),
        None
    )
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Get breach info
    breach_info = breaches.get(domain, {})
    
    # Get additional info
    service_info = get_service_info(domain)
    
    return {
        **service,
        "breach_info": breach_info if breach_info.get("breached") else None,
        "deletion_info": {
            "privacy_email": service_info.get("privacy_email", f"privacy@{domain}"),
            "estimated_response_days": 30,  # GDPR requirement
            "recommended_regulation": "GDPR" if service.get("data_sensitivity", 0) >= 5 else "CCPA"
        }
    }


@router.post("/kill-switch")
async def execute_kill_switch(session_id: str):
    """
    Execute Kill Switch - generate all deletion requests at once.
    
    Returns a comprehensive package with:
    - All deletion emails
    - Priority order
    - Tracking checklist
    """
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    results = scan_results_manager.get_results(session_id)
    if not results:
        raise HTTPException(status_code=404, detail="No scan results")
    
    services = results.get("services", [])
    breaches = results.get("breaches", {})
    user_email = session.get("user_email", "[YOUR_EMAIL]")
    
    # Prioritize services
    def priority_score(s):
        score = 0
        # Breached services first
        if breaches.get(s.get("domain"), {}).get("breached"):
            score += 1000
        # High sensitivity next
        score += s.get("data_sensitivity", 0) * 10
        # Higher data value
        score += min(100, s.get("estimated_data_value", 0))
        return score
    
    sorted_services = sorted(services, key=priority_score, reverse=True)
    
    # Generate emails for all services
    kill_switch_package = {
        "generated_at": datetime.utcnow().isoformat(),
        "total_services": len(sorted_services),
        "user_email": user_email,
        "services": []
    }
    
    for idx, service in enumerate(sorted_services):
        domain = service.get("domain")
        name = service.get("name", domain)
        breach_info = breaches.get(domain, {})
        
        # Generate email
        email_content = await ai_client.generate_deletion_email(
            service_name=name,
            domain=domain,
            user_email=user_email,
            regulation="GDPR"
        )
        
        service_info = get_service_info(domain)
        privacy_email = service_info.get("privacy_email") or f"privacy@{domain}"
        
        kill_switch_package["services"].append({
            "priority": idx + 1,
            "domain": domain,
            "name": name,
            "category": service.get("category"),
            "data_sensitivity": service.get("data_sensitivity"),
            "is_breached": breach_info.get("breached", False),
            "privacy_email": privacy_email,
            "email": {
                "to": privacy_email,
                "subject": email_content["subject"],
                "body": email_content["body"],
                "mailto_link": create_mailto_link(
                    to=privacy_email,
                    subject=email_content["subject"],
                    body=email_content["body"]
                )
            },
            "status": "pending"
        })
    
    # Store kill switch package in session
    scan_results_manager.set_results(
        session_id,
        {
            **results,
            "kill_switch": kill_switch_package
        }
    )
    
    return kill_switch_package


@router.get("/kill-switch/status")
async def get_kill_switch_status(session_id: str):
    """Get status of kill switch package."""
    results = scan_results_manager.get_results(session_id)
    if not results:
        raise HTTPException(status_code=404, detail="No scan results")
    
    package = results.get("kill_switch")
    if not package:
        return {"status": "not_generated", "message": "Kill switch not yet executed"}
    
    return {
        "status": "ready",
        "generated_at": package.get("generated_at"),
        "total_services": package.get("total_services"),
        "pending": len([s for s in package.get("services", []) if s.get("status") == "pending"]),
        "completed": len([s for s in package.get("services", []) if s.get("status") == "completed"])
    }


@router.post("/mark-completed")
async def mark_service_completed(session_id: str, domain: str):
    """Mark a service as having deletion request sent."""
    results = scan_results_manager.get_results(session_id)
    if not results:
        raise HTTPException(status_code=404, detail="No scan results")
    
    package = results.get("kill_switch")
    if not package:
        raise HTTPException(status_code=404, detail="No kill switch package")
    
    # Find and update service
    for service in package.get("services", []):
        if service.get("domain") == domain:
            service["status"] = "completed"
            service["completed_at"] = datetime.utcnow().isoformat()
            break
    
    # Save updated results
    results["kill_switch"] = package
    scan_results_manager.set_results(session_id, results)
    
    return {"status": "marked_completed", "domain": domain}


@router.get("/export")
async def export_action_plan(session_id: str, format: str = "json"):
    """
    Export kill switch data for offline use.
    
    Supports JSON format for now.
    Data is ephemeral - export before session expires!
    """
    results = scan_results_manager.get_results(session_id)
    if not results:
        raise HTTPException(status_code=404, detail="No scan results")
    
    package = results.get("kill_switch")
    if not package:
        raise HTTPException(status_code=404, detail="Execute kill switch first")
    
    if format == "json":
        return {
            "format": "json",
            "exported_at": datetime.utcnow().isoformat(),
            "data": package
        }
    
    raise HTTPException(status_code=400, detail=f"Unsupported format: {format}")

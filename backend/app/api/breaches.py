"""
Have I Been Pwned (HIBP) breach checking API.
Uses FREE public APIs - no API key required for breach lookups.

Note: Checking if a specific EMAIL is breached requires a paid API key.
However, checking if a DOMAIN/SERVICE has been breached is FREE.
"""

import asyncio
from typing import Dict, List, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException
import httpx

from app.core.config import settings
from app.core.security import scan_results_manager, cache_manager
from app.models.schemas import BreachInfo, BreachCheckResponse

router = APIRouter(prefix="/breaches", tags=["Breach Checking"])

# HIBP API configuration - FREE endpoints don't require API key
HIBP_API_BASE = "https://haveibeenpwned.com/api/v3"
HIBP_RATE_LIMIT_DELAY = 1.5  # seconds between requests (be respectful)

# Cache of all known breaches (loaded once)
_all_breaches_cache: Dict[str, dict] = {}
_breaches_cache_loaded = False


async def load_all_breaches(http_client: httpx.AsyncClient) -> Dict[str, dict]:
    """
    Load all breaches from HIBP - this is a FREE endpoint.
    Returns dict mapping domain -> breach info
    """
    global _all_breaches_cache, _breaches_cache_loaded
    
    if _breaches_cache_loaded:
        return _all_breaches_cache
    
    try:
        response = await http_client.get(
            f"{HIBP_API_BASE}/breaches",
            headers={"user-agent": "Pratyaksh-Privacy-Scanner"},
            timeout=30.0
        )
        
        if response.status_code == 200:
            breaches = response.json()
            # Index by domain for quick lookup
            for breach in breaches:
                domain = breach.get("Domain", "").lower()
                if domain:
                    _all_breaches_cache[domain] = breach
            _breaches_cache_loaded = True
            print(f"Loaded {len(_all_breaches_cache)} breaches from HIBP")
            
    except Exception as e:
        print(f"Failed to load HIBP breaches: {e}")
    
    return _all_breaches_cache


async def check_domain_breach(
    domain: str,
    http_client: httpx.AsyncClient
) -> Optional[BreachInfo]:
    """
    Check if a domain/service has been involved in a breach.
    
    Uses FREE HIBP API - checks against known breached sites.
    """
    # Check local cache first
    cached = cache_manager.get_breach_info(domain)
    if cached is not None:
        return BreachInfo(**cached) if cached else None
    
    # Load all breaches if not loaded
    all_breaches = await load_all_breaches(http_client)
    
    # Check if domain matches any breached site
    domain_lower = domain.lower()
    breach = all_breaches.get(domain_lower)
    
    if breach:
        breach_info = BreachInfo(
            domain=domain,
            breached=True,
            breach_name=breach.get("Name", "Unknown"),
            breach_date=breach.get("BreachDate"),
            pwn_count=breach.get("PwnCount", 0),
            data_classes=breach.get("DataClasses", []),
            is_verified=breach.get("IsVerified", False)
        )
        
        # Cache result
        cache_manager.set_breach_info(domain, breach_info.dict())
        return breach_info
    
    # No breach found
    cache_manager.set_breach_info(domain, {})
    return None


@router.post("/check", response_model=BreachCheckResponse)
async def check_breaches(session_id: str, domains: List[str] = None):
    """
    Check multiple domains for breaches.
    
    Uses FREE HIBP API - no API key required.
    Checks if services/domains have been involved in known data breaches.
    """
    # Get domains from scan results if not provided
    if not domains:
        results = scan_results_manager.get_results(session_id)
        if not results:
            raise HTTPException(status_code=404, detail="No scan results found")
        
        services = results.get("services", [])
        domains = [s.get("domain") for s in services if s.get("domain")]
    
    # Limit domains to check
    domains = domains[:settings.MAX_BREACH_CHECKS]
    
    breach_results = {}
    breached_count = 0
    
    async with httpx.AsyncClient() as client:
        # Load all breaches once (FREE API call)
        await load_all_breaches(client)
        
        for domain in domains:
            result = await check_domain_breach(domain, client)
            
            if result:
                breach_results[domain] = result.dict()
                breached_count += 1
            else:
                breach_results[domain] = {"breached": False}
    
    # Update scan results with breach info
    results = scan_results_manager.get_results(session_id)
    if results:
        results["breaches"] = breach_results
        scan_results_manager.set_results(session_id, results)
    
    return BreachCheckResponse(
        checked=len(domains),
        breached=breached_count,
        results=breach_results
    )


@router.get("/status/{domain}")
async def get_breach_status(domain: str):
    """
    Check single domain breach status.
    
    Uses FREE HIBP API - no API key required.
    """
    cached = cache_manager.get_breach_info(domain)
    
    if cached is not None:
        return {
            "domain": domain,
            "cached": True,
            **cached
        }
    
    async with httpx.AsyncClient() as client:
        result = await check_domain_breach(domain, client)
    
    if result:
        return {
            "domain": domain,
            "cached": False,
            **result.dict()
        }
    
    return {
        "domain": domain,
        "cached": False,
        "breached": False
    }


@router.get("/summary")
async def get_breach_summary(session_id: str):
    """Get breach summary for session."""
    results = scan_results_manager.get_results(session_id)
    
    if not results:
        raise HTTPException(status_code=404, detail="No scan results found")
    
    breaches = results.get("breaches", {})
    services = results.get("services", [])
    
    breached = [
        {
            "domain": domain,
            **info
        }
        for domain, info in breaches.items()
        if info.get("breached")
    ]
    
    # Sort by severity (pwn count)
    breached.sort(key=lambda x: x.get("pwn_count", 0), reverse=True)
    
    # Get total exposed data types
    all_data_classes = set()
    for b in breached:
        all_data_classes.update(b.get("data_classes", []))
    
    return {
        "total_services": len(services),
        "checked": len(breaches),
        "breached_count": len(breached),
        "exposed_data_types": list(all_data_classes),
        "breached_services": breached
    }

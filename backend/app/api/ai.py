"""
AI-powered features API.
Uses Groq for intelligent categorization and email generation.
"""

from fastapi import APIRouter, HTTPException
from typing import Optional

from app.utils.ai_client import ai_client
from app.models.schemas import (
    EmailGenerationRequest, EmailGenerationResponse,
    ServiceCategorizationRequest, ServiceCategorizationResponse
)

router = APIRouter(prefix="/ai", tags=["AI Features"])


@router.get("/status")
async def ai_status():
    """Check if AI features are available."""
    return {
        "available": ai_client.is_available(),
        "model": ai_client.model if ai_client.is_available() else None
    }


@router.post("/categorize", response_model=ServiceCategorizationResponse)
async def categorize_service(request: ServiceCategorizationRequest):
    """
    Categorize a service using AI.
    
    Returns service name, category, sensitivity, and privacy email.
    """
    if not ai_client.is_available():
        raise HTTPException(
            status_code=503,
            detail="AI features not available"
        )
    
    result = await ai_client.categorize_service(
        domain=request.domain,
        subject=request.email_subject
    )
    
    if not result:
        # Return defaults
        return ServiceCategorizationResponse(
            domain=request.domain,
            service_name=request.domain.split('.')[0].title(),
            category="Other",
            data_sensitivity=5,
            privacy_email=f"privacy@{request.domain}",
            confidence=0.0
        )
    
    return ServiceCategorizationResponse(
        domain=request.domain,
        service_name=result.get("service_name", request.domain),
        category=result.get("category", "Other"),
        data_sensitivity=result.get("data_sensitivity", 5),
        privacy_email=result.get("privacy_email", f"privacy@{request.domain}"),
        confidence=result.get("confidence", 0.5)
    )


@router.post("/generate-email", response_model=EmailGenerationResponse)
async def generate_deletion_email(request: EmailGenerationRequest):
    """
    Generate personalized deletion request email.
    
    Creates GDPR or CCPA compliant email for service.
    """
    result = await ai_client.generate_deletion_email(
        service_name=request.service_name,
        domain=request.domain,
        user_email=request.user_email or "[YOUR_EMAIL]",
        regulation=request.regulation
    )
    
    return EmailGenerationResponse(
        service_name=request.service_name,
        domain=request.domain,
        regulation=request.regulation,
        subject=result["subject"],
        body=result["body"],
        to_email=f"privacy@{request.domain}"
    )


@router.get("/privacy-email/{domain}")
async def get_privacy_email(domain: str):
    """
    Find privacy contact email for a domain.
    
    Uses AI to make intelligent guesses based on domain patterns.
    """
    if not ai_client.is_available():
        # Return default
        return {
            "domain": domain,
            "email": f"privacy@{domain}",
            "confidence": 0.3,
            "ai_generated": False
        }
    
    email = await ai_client.extract_privacy_email(domain)
    
    return {
        "domain": domain,
        "email": email or f"privacy@{domain}",
        "confidence": 0.7 if email else 0.3,
        "ai_generated": bool(email)
    }


@router.post("/batch-categorize")
async def batch_categorize(domains: list[str]):
    """
    Categorize multiple domains.
    
    More efficient than individual calls.
    Limited to 20 domains per request.
    """
    if len(domains) > 20:
        domains = domains[:20]
    
    if not ai_client.is_available():
        # Return defaults for all
        return {
            "results": {
                domain: {
                    "service_name": domain.split('.')[0].title(),
                    "category": "Other",
                    "data_sensitivity": 5,
                    "ai_categorized": False
                }
                for domain in domains
            }
        }
    
    results = {}
    
    for domain in domains:
        result = await ai_client.categorize_service(domain)
        
        if result:
            results[domain] = {
                "service_name": result.get("service_name", domain),
                "category": result.get("category", "Other"),
                "data_sensitivity": result.get("data_sensitivity", 5),
                "privacy_email": result.get("privacy_email"),
                "ai_categorized": True
            }
        else:
            results[domain] = {
                "service_name": domain.split('.')[0].title(),
                "category": "Other",
                "data_sensitivity": 5,
                "ai_categorized": False
            }
    
    return {"results": results}

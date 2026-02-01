"""
Risk analysis API endpoints.
Calculates risk scores and data value estimates.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException

from app.core.security import scan_results_manager
from app.utils.domain_classifier import CATEGORY_SENSITIVITY, CATEGORY_CPM_RATES
from app.models.schemas import (
    RiskSummary, ServiceCategory,
    RiskSummaryResponse
)

router = APIRouter(prefix="/risk", tags=["Risk Analysis"])


def calculate_risk_score(
    services: List[Dict], 
    breaches: Dict[str, Any]
) -> int:
    """
    Calculate overall risk score (0-100).
    
    Factors:
    - Number of services (more = higher risk)
    - Category sensitivity distribution
    - Breach status
    - Data age
    """
    if not services:
        return 0
    
    base_score = 0
    
    # Factor 1: Number of services (max 30 points)
    service_count = len(services)
    if service_count <= 10:
        base_score += service_count * 1
    elif service_count <= 50:
        base_score += 10 + (service_count - 10) * 0.5
    else:
        base_score += 30
    
    # Factor 2: Category sensitivity (max 40 points)
    sensitivity_sum = 0
    for svc in services:
        category = svc.get("category", "Other")
        sensitivity_sum += CATEGORY_SENSITIVITY.get(category, 5)
    
    avg_sensitivity = sensitivity_sum / len(services)
    sensitivity_score = (avg_sensitivity / 10) * 40
    base_score += sensitivity_score
    
    # Factor 3: Breaches (max 30 points)
    breached_count = sum(
        1 for svc in services 
        if breaches.get(svc.get("domain"), {}).get("breached", False)
    )
    breach_ratio = breached_count / len(services) if services else 0
    base_score += breach_ratio * 30
    
    return min(100, max(0, int(base_score)))


def calculate_total_data_value(services: List[Dict]) -> float:
    """
    Calculate estimated total data value in USD.
    
    Based on advertising CPM rates by category.
    """
    total = 0.0
    
    for svc in services:
        total += svc.get("estimated_data_value", 0)
    
    return round(total, 2)


def get_category_breakdown(services: List[Dict]) -> Dict[str, int]:
    """Get count of services per category."""
    breakdown = {}
    
    for svc in services:
        category = svc.get("category", "Other")
        breakdown[category] = breakdown.get(category, 0) + 1
    
    return breakdown


def get_top_risks(
    services: List[Dict], 
    breaches: Dict[str, Any], 
    limit: int = 5
) -> List[Dict]:
    """
    Get top risk services.
    
    Prioritized by:
    1. Breach status
    2. Data sensitivity
    3. Data value
    """
    scored_services = []
    
    for svc in services:
        domain = svc.get("domain", "")
        breach_info = breaches.get(domain, {})
        
        score = 0
        
        # Breach status is highest priority
        if breach_info.get("breached"):
            score += 100
        
        # High sensitivity categories
        score += svc.get("data_sensitivity", 5) * 5
        
        # Data value
        score += min(50, svc.get("estimated_data_value", 0))
        
        scored_services.append({
            **svc,
            "_risk_score": score,
            "breach_info": breach_info if breach_info.get("breached") else None
        })
    
    # Sort by risk score descending
    scored_services.sort(key=lambda x: x["_risk_score"], reverse=True)
    
    # Remove internal score and return top N
    for svc in scored_services:
        del svc["_risk_score"]
    
    return scored_services[:limit]


@router.get("/summary", response_model=RiskSummaryResponse)
async def get_risk_summary(session_id: str):
    """
    Get comprehensive risk summary.
    
    Includes:
    - Overall risk score
    - Total data value estimate
    - Category breakdown
    - Top risk services
    """
    results = scan_results_manager.get_results(session_id)
    
    if not results:
        raise HTTPException(
            status_code=404, 
            detail="No scan results found"
        )
    
    services = results.get("services", [])
    breaches = results.get("breaches", {})
    
    # Calculate metrics
    risk_score = calculate_risk_score(services, breaches)
    total_value = calculate_total_data_value(services)
    category_breakdown = get_category_breakdown(services)
    top_risks = get_top_risks(services, breaches)
    
    # Count breached services
    breached_count = sum(
        1 for svc in services 
        if breaches.get(svc.get("domain"), {}).get("breached", False)
    )
    
    summary = RiskSummary(
        total_services=len(services),
        risk_score=risk_score,
        total_data_value=total_value,
        breached_services=breached_count,
        category_breakdown=category_breakdown,
        top_risks=[s.get("domain") for s in top_risks],
        scan_date=results.get("completed_at")
    )
    
    return RiskSummaryResponse(
        summary=summary,
        top_risk_services=top_risks
    )


@router.get("/score")
async def get_risk_score(session_id: str):
    """Get just the risk score (for quick updates)."""
    results = scan_results_manager.get_results(session_id)
    
    if not results:
        raise HTTPException(status_code=404, detail="No scan results found")
    
    services = results.get("services", [])
    breaches = results.get("breaches", {})
    
    score = calculate_risk_score(services, breaches)
    
    return {
        "risk_score": score,
        "risk_level": get_risk_level(score)
    }


def get_risk_level(score: int) -> str:
    """Convert numeric score to risk level."""
    if score < 25:
        return "low"
    elif score < 50:
        return "moderate"
    elif score < 75:
        return "high"
    else:
        return "critical"


@router.get("/by-category")
async def get_risk_by_category(session_id: str):
    """Get risk breakdown by category."""
    results = scan_results_manager.get_results(session_id)
    
    if not results:
        raise HTTPException(status_code=404, detail="No scan results found")
    
    services = results.get("services", [])
    breaches = results.get("breaches", {})
    
    # Group services by category
    by_category = {}
    
    for svc in services:
        category = svc.get("category", "Other")
        if category not in by_category:
            by_category[category] = {
                "services": [],
                "total_value": 0,
                "breached_count": 0,
                "sensitivity": CATEGORY_SENSITIVITY.get(category, 5)
            }
        
        by_category[category]["services"].append(svc)
        by_category[category]["total_value"] += svc.get("estimated_data_value", 0)
        
        if breaches.get(svc.get("domain"), {}).get("breached"):
            by_category[category]["breached_count"] += 1
    
    # Calculate category risk scores
    result = {}
    for category, data in by_category.items():
        count = len(data["services"])
        result[category] = {
            "count": count,
            "total_value": round(data["total_value"], 2),
            "breached_count": data["breached_count"],
            "sensitivity": data["sensitivity"],
            "risk_score": min(100, data["sensitivity"] * 10 + data["breached_count"] * 20)
        }
    
    return result


@router.get("/recommendations")
async def get_recommendations(session_id: str):
    """
    Get personalized privacy recommendations.
    
    Based on discovered services and risk profile.
    """
    results = scan_results_manager.get_results(session_id)
    
    if not results:
        raise HTTPException(status_code=404, detail="No scan results found")
    
    services = results.get("services", [])
    breaches = results.get("breaches", {})
    
    recommendations = []
    
    # Check for breached services
    breached = [
        s for s in services 
        if breaches.get(s.get("domain"), {}).get("breached")
    ]
    if breached:
        recommendations.append({
            "priority": "high",
            "type": "breach",
            "title": "Address Data Breaches",
            "description": f"{len(breached)} services have been involved in data breaches. "
                          "Change passwords and monitor for suspicious activity.",
            "action": "View breached services",
            "services": [s.get("domain") for s in breached[:5]]
        })
    
    # High sensitivity services
    high_sensitivity = [
        s for s in services 
        if s.get("data_sensitivity", 0) >= 8
    ]
    if high_sensitivity:
        recommendations.append({
            "priority": "medium",
            "type": "sensitivity",
            "title": "Review High-Sensitivity Accounts",
            "description": f"You have {len(high_sensitivity)} accounts with sensitive data "
                          "(finance, health, dating). Consider removing unused ones.",
            "action": "Review sensitive services",
            "services": [s.get("domain") for s in high_sensitivity[:5]]
        })
    
    # Old/forgotten services
    if len(services) > 30:
        recommendations.append({
            "priority": "medium",
            "type": "cleanup",
            "title": "Digital Declutter Recommended",
            "description": f"You have {len(services)} services. Many may be forgotten. "
                          "Review and delete accounts you no longer use.",
            "action": "Start cleanup",
            "services": None
        })
    
    # Data value concern
    total_value = calculate_total_data_value(services)
    if total_value > 100:
        recommendations.append({
            "priority": "low",
            "type": "value",
            "title": "Your Data Has Significant Value",
            "description": f"Your data is worth an estimated ${total_value:.2f} to advertisers. "
                          "Consider using privacy tools to limit tracking.",
            "action": "Learn more",
            "services": None
        })
    
    return {"recommendations": recommendations}

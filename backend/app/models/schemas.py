from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum


class RiskLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class ServiceCategory(str, Enum):
    FINANCE = "Finance"
    HEALTHCARE = "Healthcare"
    GOVERNMENT = "Government"
    DATING = "Dating"
    ECOMMERCE = "E-commerce"
    SOCIAL = "Social Media"
    PROFESSIONAL = "Professional"
    TRAVEL = "Travel"
    ENTERTAINMENT = "Entertainment"
    NEWS = "News"
    EDUCATION = "Education"
    GAMING = "Gaming"
    OTHER = "Other"


class Breach(BaseModel):
    """Represents a data breach."""
    name: str
    date: str
    data_classes: List[str] = []
    accounts_affected: int = 0


class BreachInfo(BaseModel):
    """Breach information for a domain."""
    domain: str = ""
    breached: bool = False
    breach_name: Optional[str] = None
    breach_date: Optional[str] = None
    pwn_count: int = 0
    data_classes: List[str] = []
    is_verified: bool = False


class Service(BaseModel):
    """Represents a discovered service/account."""
    id: str
    domain: str
    name: str
    category: ServiceCategory = ServiceCategory.OTHER
    logo_url: Optional[str] = None
    first_seen: Optional[str] = None
    data_sensitivity: int = Field(ge=1, le=10, default=5)
    estimated_data_value: float = 0.0
    privacy_email: Optional[str] = None
    breach_status: str = "unknown"  # unknown, safe, breached


class RiskSummary(BaseModel):
    """Summary of risk analysis."""
    total_services: int = 0
    risk_score: int = 0
    total_data_value: float = 0.0
    breached_services: int = 0
    category_breakdown: dict = {}
    top_risks: List[str] = []
    scan_date: Optional[str] = None


class ScanProgress(BaseModel):
    """Scan progress status."""
    status: str  # pending, scanning, analyzing, complete, error
    progress: int = Field(ge=0, le=100)
    emails_scanned: int = 0
    services_found: int = 0
    message: str = ""


class ScanResults(BaseModel):
    """Complete scan results."""
    services: List[Service] = []
    total_count: int = 0
    high_risk_count: int = 0
    breached_count: int = 0
    estimated_value: float = 0.0


# Request/Response Models

class OAuthCallbackRequest(BaseModel):
    """OAuth callback request."""
    code: str


class OAuthCallbackResponse(BaseModel):
    """OAuth callback response."""
    session_id: str
    email: str


class StartScanResponse(BaseModel):
    """Start scan response."""
    job_id: str


class GenerateEmailRequest(BaseModel):
    """Request to generate deletion email."""
    service_id: str


class GenerateEmailResponse(BaseModel):
    """Generated deletion email."""
    subject: str
    body: str
    to: str
    mailto_link: str


class KillSwitchRequest(BaseModel):
    """Kill switch request."""
    service_ids: List[str]


class DeletionEmail(BaseModel):
    """A single deletion email."""
    service_name: str
    subject: str
    body: str
    to: str
    mailto_link: str


class KillSwitchResponse(BaseModel):
    """Kill switch response."""
    emails: List[DeletionEmail]
    count: int
    combined_text: str


class AIAnalyzeRequest(BaseModel):
    """AI service analysis request."""
    domain: str
    subject: Optional[str] = None


class AIAnalyzeResponse(BaseModel):
    """AI service analysis response."""
    service_name: str
    category: str
    data_sensitivity: int
    privacy_email: Optional[str] = None
    confidence: float = 0.0


class AIGenerateEmailRequest(BaseModel):
    """AI email generation request."""
    service_name: str
    domain: str
    regulation: str = "GDPR"


class BreachCheckRequest(BaseModel):
    """Breach check request."""
    domains: List[str]


class BreachCheckResponse(BaseModel):
    """Breach check response."""
    checked: int = 0
    breached: int = 0
    results: dict = {}
    error: Optional[str] = None


# Auth Models
class AuthStatusResponse(BaseModel):
    """Auth status response."""
    authenticated: bool = False
    session_valid: bool = False
    email: Optional[str] = None
    expires_at: Optional[str] = None


# Scan Models
class ScanStartRequest(BaseModel):
    """Scan start request."""
    session_id: str
    years_back: int = 5


class ScanStartResponse(BaseModel):
    """Scan start response."""
    scan_id: str
    status: str
    message: str


class ScanProgressResponse(BaseModel):
    """Scan progress response."""
    status: str
    progress: int = 0
    total_emails: Optional[int] = None
    services_found: int = 0
    current_step: Optional[str] = None
    error: Optional[str] = None


class ScanResultsResponse(BaseModel):
    """Scan results response."""
    services: List[dict] = []
    scan_duration: Optional[float] = None
    total_emails_scanned: int = 0
    completed_at: Optional[str] = None


# Risk Models
class RiskSummaryResponse(BaseModel):
    """Risk summary response."""
    summary: RiskSummary
    top_risk_services: List[dict] = []


# AI Models
class ServiceCategorizationRequest(BaseModel):
    """Service categorization request."""
    domain: str
    email_subject: Optional[str] = None


class ServiceCategorizationResponse(BaseModel):
    """Service categorization response."""
    domain: str
    service_name: str
    category: str
    data_sensitivity: int
    privacy_email: Optional[str] = None
    confidence: float = 0.0


class EmailGenerationRequest(BaseModel):
    """Email generation request."""
    service_name: str
    domain: str
    user_email: Optional[str] = None
    regulation: str = "GDPR"


class EmailGenerationResponse(BaseModel):
    """Email generation response."""
    service_name: str
    domain: str
    regulation: str
    subject: str
    body: str
    to_email: str

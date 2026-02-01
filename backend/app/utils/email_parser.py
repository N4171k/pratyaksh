import re
from typing import Optional, List, Tuple
from datetime import datetime
from app.models.schemas import ServiceCategory


# Email keywords that indicate signup/registration
SIGNUP_KEYWORDS = [
    "welcome to",
    "welcome!",
    "thanks for signing up",
    "thank you for signing up",
    "confirm your account",
    "verify your email",
    "activate your account",
    "registration confirmation",
    "account created",
    "you're in",
    "get started",
    "your new account",
    "thanks for registering",
    "complete your registration",
    "confirm your registration",
    "verify your registration",
]

# Prefixes to strip from email domains
DOMAIN_PREFIXES_TO_STRIP = [
    "mail.",
    "email.",
    "noreply.",
    "no-reply.",
    "info.",
    "support.",
    "help.",
    "notifications.",
    "alerts.",
    "news.",
    "newsletter.",
    "updates.",
    "marketing.",
]

# Common non-service domains to ignore
IGNORED_DOMAINS = {
    "gmail.com",
    "googlemail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "icloud.com",
    "me.com",
    "aol.com",
    "protonmail.com",
    "zoho.com",
    "yandex.com",
    "mail.com",
}


def extract_domain_from_email(email_address: str) -> Optional[str]:
    """
    Extract the domain from an email address.
    
    Args:
        email_address: Email address string (may include name like "Name <email@domain.com>")
    
    Returns:
        Cleaned domain or None if extraction fails
    """
    # Handle format: "Name <email@domain.com>" or just "email@domain.com"
    match = re.search(r'[\w\.-]+@([\w\.-]+\.\w+)', email_address)
    if not match:
        return None
    
    domain = match.group(1).lower()
    
    # Strip common prefixes
    for prefix in DOMAIN_PREFIXES_TO_STRIP:
        if domain.startswith(prefix):
            domain = domain[len(prefix):]
            break
    
    # Skip ignored domains
    if domain in IGNORED_DOMAINS:
        return None
    
    return domain


def is_signup_email(subject: str) -> bool:
    """
    Check if an email subject indicates a signup/registration.
    
    Args:
        subject: Email subject line
    
    Returns:
        True if the subject matches signup patterns
    """
    if not subject:
        return False
    
    subject_lower = subject.lower()
    return any(keyword in subject_lower for keyword in SIGNUP_KEYWORDS)


def parse_email_metadata(
    from_header: str,
    subject: str,
    date: str
) -> Optional[Tuple[str, str, str]]:
    """
    Parse email metadata and extract service information.
    
    Args:
        from_header: From header value
        subject: Subject line
        date: Date string
    
    Returns:
        Tuple of (domain, subject, date) or None if not a signup email
    """
    # Extract domain
    domain = extract_domain_from_email(from_header)
    if not domain:
        return None
    
    # Check if it's a signup email
    if not is_signup_email(subject):
        return None
    
    return (domain, subject, date)


def extract_service_name_from_domain(domain: str) -> str:
    """
    Extract a readable service name from domain.
    
    Args:
        domain: Domain name (e.g., "spotify.com")
    
    Returns:
        Formatted service name (e.g., "Spotify")
    """
    # Remove TLD and capitalize
    name = domain.split('.')[0]
    
    # Handle special cases
    name_mappings = {
        "linkedin": "LinkedIn",
        "github": "GitHub",
        "stackoverflow": "Stack Overflow",
        "youtube": "YouTube",
        "playstation": "PlayStation",
        "ebay": "eBay",
        "paypal": "PayPal",
        "whatsapp": "WhatsApp",
        "tiktok": "TikTok",
        "airbnb": "Airbnb",
        "uber": "Uber",
        "lyft": "Lyft",
        "doordash": "DoorDash",
        "grubhub": "Grubhub",
        "instacart": "Instacart",
        "shopify": "Shopify",
        "squarespace": "Squarespace",
        "mailchimp": "Mailchimp",
        "hubspot": "HubSpot",
        "salesforce": "Salesforce",
        "zendesk": "Zendesk",
        "dropbox": "Dropbox",
        "onedrive": "OneDrive",
        "icloud": "iCloud",
    }
    
    return name_mappings.get(name.lower(), name.capitalize())


def build_gmail_search_query(years_back: int = 5) -> str:
    """
    Build the Gmail API search query for signup emails.
    
    Args:
        years_back: Number of years to look back
    
    Returns:
        Gmail search query string
    """
    from datetime import datetime, timedelta
    
    # Calculate date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=years_back * 365)
    
    # Format dates for Gmail query
    after_date = start_date.strftime("%Y/%m/%d")
    
    keyword_queries = [f'subject:"{kw}"' for kw in SIGNUP_KEYWORDS[:10]]  # Limit to avoid query length issues
    return f"after:{after_date} ({' OR '.join(keyword_queries)})"


def deduplicate_services(
    services: List[Tuple[str, str, str]]
) -> List[Tuple[str, str, str]]:
    """
    Deduplicate services by domain, keeping the earliest date.
    
    Args:
        services: List of (domain, subject, date) tuples
    
    Returns:
        Deduplicated list with earliest dates
    """
    domain_map = {}
    
    for domain, subject, date in services:
        if domain not in domain_map:
            domain_map[domain] = (domain, subject, date)
        else:
            # Keep the earlier date
            existing_date = domain_map[domain][2]
            try:
                if date < existing_date:
                    domain_map[domain] = (domain, subject, date)
            except:
                pass  # Keep existing if date comparison fails
    
    return list(domain_map.values())

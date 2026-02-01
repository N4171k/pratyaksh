from typing import Optional, Dict
from app.models.schemas import ServiceCategory

# Pre-categorized services database (Top services)
SERVICES_DATABASE: Dict[str, Dict] = {
    # Finance - High Risk (9-10)
    "paypal.com": {
        "name": "PayPal",
        "category": ServiceCategory.FINANCE,
        "sensitivity": 10,
        "data_collected": ["email", "phone", "address", "payment info", "transaction history"],
        "privacy_email": "privacy@paypal.com",
    },
    "stripe.com": {
        "name": "Stripe",
        "category": ServiceCategory.FINANCE,
        "sensitivity": 10,
        "data_collected": ["email", "payment info", "business info"],
        "privacy_email": "privacy@stripe.com",
    },
    "venmo.com": {
        "name": "Venmo",
        "category": ServiceCategory.FINANCE,
        "sensitivity": 10,
        "data_collected": ["email", "phone", "payment info", "social graph"],
        "privacy_email": "privacy@venmo.com",
    },
    "robinhood.com": {
        "name": "Robinhood",
        "category": ServiceCategory.FINANCE,
        "sensitivity": 10,
        "data_collected": ["email", "SSN", "financial data", "trading history"],
        "privacy_email": "privacy@robinhood.com",
    },
    "coinbase.com": {
        "name": "Coinbase",
        "category": ServiceCategory.FINANCE,
        "sensitivity": 10,
        "data_collected": ["email", "ID", "financial data", "crypto holdings"],
        "privacy_email": "privacy@coinbase.com",
    },
    "chase.com": {
        "name": "Chase Bank",
        "category": ServiceCategory.FINANCE,
        "sensitivity": 10,
        "data_collected": ["email", "SSN", "financial data", "account info"],
        "privacy_email": "privacy@chase.com",
    },
    
    # Healthcare - High Risk (9)
    "myfitnesspal.com": {
        "name": "MyFitnessPal",
        "category": ServiceCategory.HEALTHCARE,
        "sensitivity": 8,
        "data_collected": ["email", "health data", "weight", "diet"],
        "privacy_email": "privacy@myfitnesspal.com",
    },
    "fitbit.com": {
        "name": "Fitbit",
        "category": ServiceCategory.HEALTHCARE,
        "sensitivity": 8,
        "data_collected": ["email", "health data", "location", "sleep patterns"],
        "privacy_email": "privacy@fitbit.com",
    },
    
    # Dating - High Risk (8-9)
    "tinder.com": {
        "name": "Tinder",
        "category": ServiceCategory.DATING,
        "sensitivity": 9,
        "data_collected": ["email", "photos", "location", "preferences", "messages"],
        "privacy_email": "privacy@tinder.com",
    },
    "bumble.com": {
        "name": "Bumble",
        "category": ServiceCategory.DATING,
        "sensitivity": 9,
        "data_collected": ["email", "photos", "location", "preferences"],
        "privacy_email": "dpo@bumble.com",
    },
    
    # E-commerce - Medium Risk (6-7)
    "amazon.com": {
        "name": "Amazon",
        "category": ServiceCategory.ECOMMERCE,
        "sensitivity": 7,
        "data_collected": ["email", "address", "payment info", "purchase history", "browsing"],
        "privacy_email": "privacy@amazon.com",
    },
    "ebay.com": {
        "name": "eBay",
        "category": ServiceCategory.ECOMMERCE,
        "sensitivity": 7,
        "data_collected": ["email", "address", "payment info", "purchase history"],
        "privacy_email": "privacy@ebay.com",
    },
    "shopify.com": {
        "name": "Shopify",
        "category": ServiceCategory.ECOMMERCE,
        "sensitivity": 6,
        "data_collected": ["email", "business info"],
        "privacy_email": "privacy@shopify.com",
    },
    "etsy.com": {
        "name": "Etsy",
        "category": ServiceCategory.ECOMMERCE,
        "sensitivity": 6,
        "data_collected": ["email", "address", "payment info", "purchase history"],
        "privacy_email": "privacy@etsy.com",
    },
    "walmart.com": {
        "name": "Walmart",
        "category": ServiceCategory.ECOMMERCE,
        "sensitivity": 6,
        "data_collected": ["email", "address", "payment info", "purchase history"],
        "privacy_email": "privacy@walmart.com",
    },
    "target.com": {
        "name": "Target",
        "category": ServiceCategory.ECOMMERCE,
        "sensitivity": 6,
        "data_collected": ["email", "address", "payment info"],
        "privacy_email": "privacy@target.com",
    },
    
    # Social Media - Medium Risk (5-7)
    "facebook.com": {
        "name": "Facebook",
        "category": ServiceCategory.SOCIAL,
        "sensitivity": 8,
        "data_collected": ["email", "phone", "photos", "location", "social graph", "messages"],
        "privacy_email": "privacy@facebook.com",
    },
    "instagram.com": {
        "name": "Instagram",
        "category": ServiceCategory.SOCIAL,
        "sensitivity": 7,
        "data_collected": ["email", "phone", "photos", "location", "messages"],
        "privacy_email": "privacy@instagram.com",
    },
    "twitter.com": {
        "name": "Twitter/X",
        "category": ServiceCategory.SOCIAL,
        "sensitivity": 6,
        "data_collected": ["email", "phone", "posts", "location"],
        "privacy_email": "privacy@twitter.com",
    },
    "x.com": {
        "name": "X (Twitter)",
        "category": ServiceCategory.SOCIAL,
        "sensitivity": 6,
        "data_collected": ["email", "phone", "posts", "location"],
        "privacy_email": "privacy@x.com",
    },
    "tiktok.com": {
        "name": "TikTok",
        "category": ServiceCategory.SOCIAL,
        "sensitivity": 7,
        "data_collected": ["email", "phone", "videos", "location", "browsing"],
        "privacy_email": "privacy@tiktok.com",
    },
    "snapchat.com": {
        "name": "Snapchat",
        "category": ServiceCategory.SOCIAL,
        "sensitivity": 7,
        "data_collected": ["email", "phone", "photos", "location", "messages"],
        "privacy_email": "privacy@snapchat.com",
    },
    "reddit.com": {
        "name": "Reddit",
        "category": ServiceCategory.SOCIAL,
        "sensitivity": 5,
        "data_collected": ["email", "posts", "comments", "browsing"],
        "privacy_email": "privacy@reddit.com",
    },
    "discord.com": {
        "name": "Discord",
        "category": ServiceCategory.SOCIAL,
        "sensitivity": 6,
        "data_collected": ["email", "messages", "voice data", "server memberships"],
        "privacy_email": "privacy@discord.com",
    },
    
    # Professional - Medium Risk (5-6)
    "linkedin.com": {
        "name": "LinkedIn",
        "category": ServiceCategory.PROFESSIONAL,
        "sensitivity": 7,
        "data_collected": ["email", "employment history", "education", "connections"],
        "privacy_email": "privacy@linkedin.com",
    },
    "github.com": {
        "name": "GitHub",
        "category": ServiceCategory.PROFESSIONAL,
        "sensitivity": 5,
        "data_collected": ["email", "code", "contributions"],
        "privacy_email": "privacy@github.com",
    },
    "slack.com": {
        "name": "Slack",
        "category": ServiceCategory.PROFESSIONAL,
        "sensitivity": 6,
        "data_collected": ["email", "messages", "files", "workspace data"],
        "privacy_email": "privacy@slack.com",
    },
    "notion.so": {
        "name": "Notion",
        "category": ServiceCategory.PROFESSIONAL,
        "sensitivity": 5,
        "data_collected": ["email", "documents", "workspace data"],
        "privacy_email": "privacy@notion.so",
    },
    "trello.com": {
        "name": "Trello",
        "category": ServiceCategory.PROFESSIONAL,
        "sensitivity": 4,
        "data_collected": ["email", "boards", "tasks"],
        "privacy_email": "privacy@trello.com",
    },
    
    # Entertainment - Low Risk (3-5)
    "spotify.com": {
        "name": "Spotify",
        "category": ServiceCategory.ENTERTAINMENT,
        "sensitivity": 4,
        "data_collected": ["email", "listening history", "playlists"],
        "privacy_email": "privacy@spotify.com",
    },
    "netflix.com": {
        "name": "Netflix",
        "category": ServiceCategory.ENTERTAINMENT,
        "sensitivity": 4,
        "data_collected": ["email", "viewing history", "payment info"],
        "privacy_email": "privacy@netflix.com",
    },
    "youtube.com": {
        "name": "YouTube",
        "category": ServiceCategory.ENTERTAINMENT,
        "sensitivity": 5,
        "data_collected": ["email", "watch history", "subscriptions", "comments"],
        "privacy_email": "privacy@youtube.com",
    },
    "twitch.tv": {
        "name": "Twitch",
        "category": ServiceCategory.ENTERTAINMENT,
        "sensitivity": 5,
        "data_collected": ["email", "watch history", "chat logs"],
        "privacy_email": "privacy@twitch.tv",
    },
    "hulu.com": {
        "name": "Hulu",
        "category": ServiceCategory.ENTERTAINMENT,
        "sensitivity": 4,
        "data_collected": ["email", "viewing history", "payment info"],
        "privacy_email": "privacy@hulu.com",
    },
    "disneyplus.com": {
        "name": "Disney+",
        "category": ServiceCategory.ENTERTAINMENT,
        "sensitivity": 4,
        "data_collected": ["email", "viewing history", "payment info"],
        "privacy_email": "privacy@disney.com",
    },
    
    # Gaming - Low-Medium Risk (4-5)
    "steam.com": {
        "name": "Steam",
        "category": ServiceCategory.GAMING,
        "sensitivity": 5,
        "data_collected": ["email", "payment info", "game library", "playtime"],
        "privacy_email": "privacy@steampowered.com",
    },
    "steampowered.com": {
        "name": "Steam",
        "category": ServiceCategory.GAMING,
        "sensitivity": 5,
        "data_collected": ["email", "payment info", "game library", "playtime"],
        "privacy_email": "privacy@steampowered.com",
    },
    "epicgames.com": {
        "name": "Epic Games",
        "category": ServiceCategory.GAMING,
        "sensitivity": 5,
        "data_collected": ["email", "payment info", "game library"],
        "privacy_email": "privacy@epicgames.com",
    },
    "playstation.com": {
        "name": "PlayStation",
        "category": ServiceCategory.GAMING,
        "sensitivity": 5,
        "data_collected": ["email", "payment info", "game library", "trophies"],
        "privacy_email": "privacy@playstation.com",
    },
    "xbox.com": {
        "name": "Xbox",
        "category": ServiceCategory.GAMING,
        "sensitivity": 5,
        "data_collected": ["email", "payment info", "game library", "achievements"],
        "privacy_email": "privacy@microsoft.com",
    },
    
    # Travel - Medium Risk (5-6)
    "airbnb.com": {
        "name": "Airbnb",
        "category": ServiceCategory.TRAVEL,
        "sensitivity": 7,
        "data_collected": ["email", "ID", "address", "payment info", "travel history"],
        "privacy_email": "privacy@airbnb.com",
    },
    "booking.com": {
        "name": "Booking.com",
        "category": ServiceCategory.TRAVEL,
        "sensitivity": 6,
        "data_collected": ["email", "address", "payment info", "travel history"],
        "privacy_email": "privacy@booking.com",
    },
    "uber.com": {
        "name": "Uber",
        "category": ServiceCategory.TRAVEL,
        "sensitivity": 7,
        "data_collected": ["email", "phone", "location", "payment info", "trip history"],
        "privacy_email": "privacy@uber.com",
    },
    "lyft.com": {
        "name": "Lyft",
        "category": ServiceCategory.TRAVEL,
        "sensitivity": 7,
        "data_collected": ["email", "phone", "location", "payment info", "trip history"],
        "privacy_email": "privacy@lyft.com",
    },
    
    # Education - Low Risk (3-4)
    "coursera.org": {
        "name": "Coursera",
        "category": ServiceCategory.EDUCATION,
        "sensitivity": 4,
        "data_collected": ["email", "learning progress", "certificates"],
        "privacy_email": "privacy@coursera.org",
    },
    "udemy.com": {
        "name": "Udemy",
        "category": ServiceCategory.EDUCATION,
        "sensitivity": 4,
        "data_collected": ["email", "learning progress", "payment info"],
        "privacy_email": "privacy@udemy.com",
    },
    "duolingo.com": {
        "name": "Duolingo",
        "category": ServiceCategory.EDUCATION,
        "sensitivity": 3,
        "data_collected": ["email", "learning progress"],
        "privacy_email": "privacy@duolingo.com",
    },
    
    # Food Delivery - Medium Risk (5-6)
    "doordash.com": {
        "name": "DoorDash",
        "category": ServiceCategory.ECOMMERCE,
        "sensitivity": 6,
        "data_collected": ["email", "address", "phone", "payment info", "order history"],
        "privacy_email": "privacy@doordash.com",
    },
    "ubereats.com": {
        "name": "Uber Eats",
        "category": ServiceCategory.ECOMMERCE,
        "sensitivity": 6,
        "data_collected": ["email", "address", "phone", "payment info", "order history"],
        "privacy_email": "privacy@uber.com",
    },
    "grubhub.com": {
        "name": "Grubhub",
        "category": ServiceCategory.ECOMMERCE,
        "sensitivity": 6,
        "data_collected": ["email", "address", "phone", "payment info", "order history"],
        "privacy_email": "privacy@grubhub.com",
    },
    "instacart.com": {
        "name": "Instacart",
        "category": ServiceCategory.ECOMMERCE,
        "sensitivity": 6,
        "data_collected": ["email", "address", "phone", "payment info", "order history"],
        "privacy_email": "privacy@instacart.com",
    },
}

# Category to sensitivity mapping (default values)
CATEGORY_SENSITIVITY: Dict[ServiceCategory, int] = {
    ServiceCategory.FINANCE: 9,
    ServiceCategory.HEALTHCARE: 8,
    ServiceCategory.GOVERNMENT: 9,
    ServiceCategory.DATING: 8,
    ServiceCategory.ECOMMERCE: 6,
    ServiceCategory.SOCIAL: 6,
    ServiceCategory.PROFESSIONAL: 5,
    ServiceCategory.TRAVEL: 6,
    ServiceCategory.ENTERTAINMENT: 4,
    ServiceCategory.NEWS: 3,
    ServiceCategory.EDUCATION: 4,
    ServiceCategory.GAMING: 4,
    ServiceCategory.OTHER: 5,
}

# CPM rates for data value calculation (INR)
CATEGORY_CPM_RATES: Dict[ServiceCategory, float] = {
    ServiceCategory.FINANCE: 25.0,
    ServiceCategory.HEALTHCARE: 20.0,
    ServiceCategory.GOVERNMENT: 15.0,
    ServiceCategory.DATING: 18.0,
    ServiceCategory.ECOMMERCE: 8.0,
    ServiceCategory.SOCIAL: 5.0,
    ServiceCategory.PROFESSIONAL: 10.0,
    ServiceCategory.TRAVEL: 12.0,
    ServiceCategory.ENTERTAINMENT: 3.0,
    ServiceCategory.NEWS: 2.0,
    ServiceCategory.EDUCATION: 4.0,
    ServiceCategory.GAMING: 5.0,
    ServiceCategory.OTHER: 3.0,
}


def get_service_info(domain: str) -> Optional[Dict]:
    """
    Get pre-categorized service information.
    
    Args:
        domain: Service domain
    
    Returns:
        Service info dict or None if not in database
    """
    return SERVICES_DATABASE.get(domain)


def get_default_sensitivity(category: ServiceCategory) -> int:
    """Get default sensitivity for a category."""
    return CATEGORY_SENSITIVITY.get(category, 5)


def get_cpm_rate(category: ServiceCategory) -> float:
    """Get CPM rate for data value calculation."""
    return CATEGORY_CPM_RATES.get(category, 3.0)


def calculate_data_value(services: list) -> float:
    """
    Calculate estimated annual data value.
    
    Args:
        services: List of Service objects
    
    Returns:
        Estimated annual value in INR
    """
    total_value = 0.0
    
    for service in services:
        cpm = get_cpm_rate(service.category)
        # Assume 10 interactions per month per service
        monthly_impressions = 10
        annual_value = (cpm * monthly_impressions * 12) / 1000
        total_value += annual_value * (service.data_sensitivity / 5)  # Scale by sensitivity
    
    return round(total_value, 2)


def get_logo_url(domain: str) -> str:
    """Get logo URL from Clearbit."""
    return f"https://logo.clearbit.com/{domain}"

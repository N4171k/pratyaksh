import os
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str = "Pratyaksh"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    FRONTEND_URL: str = "http://localhost:3000"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]
    
    # Session
    SESSION_SECRET: str = "your-secret-key-change-in-production"
    SESSION_TTL: int = 900  # 15 minutes in seconds
    SESSION_TTL_SECONDS: int = 900  # Alias for compatibility
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/auth/callback"
    GOOGLE_SCOPES: list[str] = [
        "https://www.googleapis.com/auth/gmail.readonly",
        "openid",
        "email",
    ]
    
    # AI - Groq
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GROQ_FALLBACK_MODEL: str = "llama-3.1-8b-instant"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # HIBP API
    HIBP_API_KEY: str = ""
    HIBP_USER_AGENT: str = "Pratyaksh-Hackathon"
    HIBP_RATE_LIMIT: float = 1.5  # seconds between requests
    
    # Scanning limits
    MAX_EMAILS_TO_SCAN: int = 5000
    MAX_SCAN_EMAILS: int = 5000  # Alias for compatibility
    MAX_BREACH_CHECKS: int = 100
    EMAILS_PER_BATCH: int = 100
    
    # Demo mode
    DEMO_MODE: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()

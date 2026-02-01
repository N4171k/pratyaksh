"""
Pratyaksh Backend - Privacy-First Digital Footprint Scanner

A FastAPI backend that:
- Authenticates via Google OAuth (Gmail readonly scope)
- Scans email metadata only (never content)
- Uses AI for service categorization
- Checks breaches via HIBP
- Generates GDPR/CCPA deletion emails
- Stores NOTHING persistently (session-only)
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.security import session_manager
from app.api import oauth, scan, risk, breaches, ai, actions


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    print("🔒 Pratyaksh Backend Starting...")
    print(f"📧 Session TTL: {settings.SESSION_TTL_SECONDS}s")
    print(f"🤖 AI Enabled: {bool(settings.GROQ_API_KEY)}")
    print(f"🔍 HIBP Enabled: {bool(settings.HIBP_API_KEY)}")
    
    yield
    
    # Shutdown - clean up any remaining sessions
    print("🔒 Pratyaksh Backend Shutting Down...")


app = FastAPI(
    title="Pratyaksh API",
    description="Privacy-first digital footprint scanner API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include API routers
app.include_router(oauth.router, prefix="/api")
app.include_router(scan.router, prefix="/api")
app.include_router(risk.router, prefix="/api")
app.include_router(breaches.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(actions.router, prefix="/api")


@app.get("/")
async def root():
    """API root - health check."""
    return {
        "name": "Pratyaksh API",
        "version": "1.0.0",
        "status": "healthy",
        "privacy": {
            "data_retention": "session_only",
            "session_ttl": f"{settings.SESSION_TTL_SECONDS}s",
            "email_access": "metadata_only"
        }
    }


@app.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "services": {
            "google_oauth": bool(settings.GOOGLE_CLIENT_ID),
            "groq_ai": bool(settings.GROQ_API_KEY),
            "hibp": bool(settings.HIBP_API_KEY),
            "redis": session_manager.is_connected()
        }
    }


@app.get("/api/privacy-policy")
async def privacy_policy_summary():
    """Return key privacy commitments."""
    return {
        "commitments": [
            {
                "title": "No Data Storage",
                "description": "We never store your emails or personal data on our servers"
            },
            {
                "title": "Metadata Only",
                "description": "We only access email headers (From, Subject, Date), never content"
            },
            {
                "title": "Session Expiry",
                "description": f"All session data is automatically deleted after {settings.SESSION_TTL_SECONDS // 60} minutes"
            },
            {
                "title": "Immediate Purge",
                "description": "Logging out immediately deletes all your data"
            },
            {
                "title": "Open Source",
                "description": "Our code is open source - verify our privacy claims yourself"
            }
        ],
        "contact": "privacy@pratyaksh.app"
    }


# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler - don't leak internal details."""
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_error",
            "message": "An unexpected error occurred"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

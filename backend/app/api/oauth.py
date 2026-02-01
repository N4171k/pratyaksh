"""
OAuth API endpoints for Google authentication.
Privacy-first design: Only requests Gmail metadata access (readonly).
"""

import secrets
from datetime import datetime
from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import RedirectResponse
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import httpx

from app.core.config import settings
from app.core.security import session_manager
from app.models.schemas import AuthStatusResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

# OAuth2 configuration - include email scope for user identification
SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'openid'
]

def get_google_flow(state: str = None) -> Flow:
    """Create Google OAuth flow."""
    client_config = {
        "web": {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uris": [settings.GOOGLE_REDIRECT_URI],
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    }
    
    flow = Flow.from_client_config(
        client_config,
        scopes=SCOPES,
        redirect_uri=settings.GOOGLE_REDIRECT_URI
    )
    
    if state:
        flow.state = state
    
    return flow


@router.get("/google")
async def google_auth():
    """
    Initiate Google OAuth flow.
    
    Returns redirect URL to Google's consent screen.
    Only requests readonly access to Gmail metadata.
    """
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=503, 
            detail="Google OAuth not configured"
        )
    
    # Generate state token for CSRF protection
    state = secrets.token_urlsafe(32)
    
    flow = get_google_flow(state)
    
    authorization_url, _ = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent',
        state=state
    )
    
    return {
        "authorization_url": authorization_url,
        "state": state
    }


@router.get("/callback")
async def google_callback(code: str, state: str):
    """
    Handle Google OAuth callback.
    
    Creates a session and stores tokens securely.
    No user data is persisted - only session tokens.
    """
    if not code:
        raise HTTPException(status_code=400, detail="Missing authorization code")
    
    try:
        flow = get_google_flow(state)
        flow.fetch_token(code=code)
        
        credentials = flow.credentials
        
        # Get user email using the access token directly
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {credentials.token}"}
            )
            
            if response.status_code == 200:
                user_info = response.json()
                user_email = user_info.get('email', 'unknown@gmail.com')
            else:
                # Fallback - extract from Gmail profile
                gmail_service = build('gmail', 'v1', credentials=credentials)
                profile = gmail_service.users().getProfile(userId='me').execute()
                user_email = profile.get('emailAddress', 'unknown@gmail.com')
        
        # Create session - store access token for Gmail API calls
        session_id = session_manager.create_session(
            access_token=credentials.token,
            user_email=user_email
        )
        
        # Also store full credentials for token refresh (update session)
        session_manager.update_session(session_id, {
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "scopes": list(credentials.scopes) if credentials.scopes else SCOPES
        })
        
        # Redirect to frontend with session
        frontend_url = settings.FRONTEND_URL
        return RedirectResponse(
            url=f"{frontend_url}/auth/callback?session={session_id}&email={user_email}"
        )
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=400, 
            detail=f"OAuth callback failed: {str(e)}"
        )


@router.get("/status", response_model=AuthStatusResponse)
async def auth_status(session_id: str):
    """
    Check authentication status.
    
    Returns whether session is valid and expiry info.
    """
    if not session_id:
        return AuthStatusResponse(
            authenticated=False,
            session_valid=False
        )
    
    session = session_manager.get_session(session_id)
    
    if not session:
        return AuthStatusResponse(
            authenticated=False,
            session_valid=False
        )
    
    return AuthStatusResponse(
        authenticated=True,
        session_valid=True,
        email=session.get("user_email"),
        expires_at=session.get("expires_at")
    )


@router.post("/logout")
async def logout(session_id: str):
    """
    End session and clear all data.
    
    IMPORTANT: This immediately purges ALL session data.
    No user data persists after logout.
    """
    if session_id:
        # Clear all session and scan data
        session_manager.delete_session(session_id)
    
    return {"status": "logged_out", "data_purged": True}


@router.post("/extend")
async def extend_session(session_id: str):
    """
    Extend session expiry.
    
    Adds 5 minutes to current session, max 15 minutes total.
    """
    if not session_id:
        raise HTTPException(status_code=400, detail="No session ID provided")
    
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Session expired or invalid")
    
    # Extend session
    extended = session_manager.extend_session(session_id)
    
    if not extended:
        raise HTTPException(status_code=400, detail="Could not extend session")
    
    return {
        "status": "extended",
        "new_expiry": session_manager.get_session(session_id).get("expires_at")
    }


def get_credentials_from_session(session_id: str) -> Credentials:
    """
    Get Google credentials from session.
    
    Args:
        session_id: Session identifier
        
    Returns:
        Google OAuth credentials
        
    Raises:
        HTTPException if session invalid
    """
    session = session_manager.get_session(session_id)
    
    if not session:
        raise HTTPException(status_code=401, detail="Session expired or invalid")
    
    # Credentials are stored as flat fields in session
    access_token = session.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="No credentials in session")
    
    credentials = Credentials(
        token=access_token,
        refresh_token=session.get("refresh_token"),
        token_uri=session.get("token_uri", "https://oauth2.googleapis.com/token"),
        client_id=session.get("client_id", settings.GOOGLE_CLIENT_ID),
        client_secret=session.get("client_secret", settings.GOOGLE_CLIENT_SECRET),
        scopes=session.get("scopes", SCOPES)
    )
    
    return credentials

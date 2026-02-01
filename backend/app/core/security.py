import secrets
import hashlib
import json
from datetime import datetime, timedelta
from typing import Optional, Dict
from app.core.config import settings

# Try to import redis, fall back to in-memory storage
try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False


class InMemoryStore:
    """Simple in-memory store for development without Redis."""
    
    def __init__(self):
        self._data: Dict[str, tuple] = {}  # key -> (value, expiry_time)
    
    def setex(self, key: str, ttl: int, value: str) -> None:
        expiry = datetime.utcnow() + timedelta(seconds=ttl)
        self._data[key] = (value, expiry)
    
    def get(self, key: str) -> Optional[str]:
        if key not in self._data:
            return None
        value, expiry = self._data[key]
        if datetime.utcnow() > expiry:
            del self._data[key]
            return None
        return value
    
    def delete(self, key: str) -> int:
        if key in self._data:
            del self._data[key]
            return 1
        return 0
    
    def expire(self, key: str, ttl: int) -> int:
        if key in self._data:
            value, _ = self._data[key]
            expiry = datetime.utcnow() + timedelta(seconds=ttl)
            self._data[key] = (value, expiry)
            return 1
        return 0


# Singleton storage instance
_storage_instance = None


def get_storage_client():
    """Get Redis client or fall back to in-memory storage (singleton)."""
    global _storage_instance
    
    if _storage_instance is not None:
        return _storage_instance
    
    if REDIS_AVAILABLE:
        try:
            client = redis.from_url(settings.REDIS_URL, decode_responses=True)
            client.ping()  # Test connection
            print("✓ Connected to Redis")
            _storage_instance = client
            return _storage_instance
        except Exception as e:
            print(f"⚠ Redis unavailable ({e}), using in-memory storage")
    else:
        print("⚠ Redis not installed, using in-memory storage")
    
    _storage_instance = InMemoryStore()
    return _storage_instance


class SessionManager:
    """Manages user sessions with automatic expiry."""
    
    def __init__(self):
        self.storage = get_storage_client()
        self.ttl = settings.SESSION_TTL
    
    def create_session(
        self, 
        access_token: str, 
        user_email: str,
        token_expiry: Optional[datetime] = None
    ) -> str:
        """Create a new session and return the session ID."""
        session_id = secrets.token_urlsafe(32)
        
        session_data = {
            "access_token": access_token,
            "user_email": user_email,
            "token_expiry": token_expiry.isoformat() if token_expiry else None,
            "created_at": datetime.utcnow().isoformat(),
        }
        
        self.storage.setex(
            f"session:{session_id}",
            self.ttl,
            json.dumps(session_data)
        )
        
        return session_id
    
    def get_session(self, session_id: str) -> Optional[dict]:
        """Retrieve session data by session ID."""
        data = self.storage.get(f"session:{session_id}")
        if data:
            return json.loads(data)
        return None
    
    def update_session(self, session_id: str, data: dict) -> bool:
        """Update session data and refresh TTL."""
        existing = self.get_session(session_id)
        if not existing:
            return False
        
        existing.update(data)
        self.storage.setex(
            f"session:{session_id}",
            self.ttl,
            json.dumps(existing)
        )
        return True
    
    def delete_session(self, session_id: str) -> bool:
        """Delete a session."""
        return bool(self.storage.delete(f"session:{session_id}"))
    
    def refresh_session(self, session_id: str) -> bool:
        """Refresh session TTL."""
        return bool(self.storage.expire(f"session:{session_id}", self.ttl))


class CacheManager:
    """Manages caching for AI results and service data."""
    
    def __init__(self):
        self.storage = get_storage_client()
        self.ai_cache_ttl = 7 * 24 * 60 * 60  # 7 days for AI categorization
        self.breach_cache_ttl = 24 * 60 * 60  # 1 day for breach data
    
    def _hash_key(self, key: str) -> str:
        """Create a hash of the key for consistent storage."""
        return hashlib.md5(key.encode()).hexdigest()
    
    def get_ai_categorization(self, domain: str) -> Optional[dict]:
        """Get cached AI categorization for a domain."""
        cache_key = f"ai_cat:{self._hash_key(domain)}"
        data = self.storage.get(cache_key)
        if data:
            return json.loads(data)
        return None
    
    def set_ai_categorization(self, domain: str, data: dict) -> None:
        """Cache AI categorization for a domain."""
        cache_key = f"ai_cat:{self._hash_key(domain)}"
        self.storage.setex(cache_key, self.ai_cache_ttl, json.dumps(data))
    
    def get_breach_data(self, domain: str) -> Optional[dict]:
        """Get cached breach data for a domain."""
        cache_key = f"breach:{self._hash_key(domain)}"
        data = self.storage.get(cache_key)
        if data:
            return json.loads(data)
        return None
    
    def set_breach_data(self, domain: str, data: dict) -> None:
        """Cache breach data for a domain."""
        cache_key = f"breach:{self._hash_key(domain)}"
        self.storage.setex(cache_key, self.breach_cache_ttl, json.dumps(data))
    
    def get_breach_info(self, domain: str) -> Optional[dict]:
        """Alias for get_breach_data."""
        return self.get_breach_data(domain)
    
    def set_breach_info(self, domain: str, data: dict) -> None:
        """Alias for set_breach_data."""
        self.set_breach_data(domain, data)


class ScanResultsManager:
    """Manages scan results storage (session-only)."""
    
    def __init__(self):
        self.storage = get_storage_client()
        self.ttl = settings.SESSION_TTL
    
    def store_scan_progress(self, job_id: str, progress: dict) -> None:
        """Store scan progress data."""
        self.storage.setex(
            f"scan_progress:{job_id}",
            self.ttl,
            json.dumps(progress)
        )
    
    def get_scan_progress(self, job_id: str) -> Optional[dict]:
        """Get scan progress data."""
        data = self.storage.get(f"scan_progress:{job_id}")
        if data:
            return json.loads(data)
        return None
    
    def store_scan_results(self, job_id: str, results: dict) -> None:
        """Store scan results."""
        self.storage.setex(
            f"scan_results:{job_id}",
            self.ttl,
            json.dumps(results)
        )
    
    def get_scan_results(self, job_id: str) -> Optional[dict]:
        """Get scan results."""
        data = self.storage.get(f"scan_results:{job_id}")
        if data:
            return json.loads(data)
        return None
    
    def get_results(self, session_id: str) -> Optional[dict]:
        """Alias for get_scan_results."""
        return self.get_scan_results(session_id)
    
    def set_results(self, session_id: str, results: dict) -> None:
        """Alias for store_scan_results."""
        self.store_scan_results(session_id, results)
    
    def get_progress(self, session_id: str) -> Optional[dict]:
        """Alias for get_scan_progress."""
        return self.get_scan_progress(session_id)
    
    def set_progress(self, session_id: str, progress: dict) -> None:
        """Alias for store_scan_progress."""
        self.store_scan_progress(session_id, progress)
    
    def delete_scan_data(self, job_id: str) -> None:
        """Delete all scan data for a job."""
        self.storage.delete(f"scan_progress:{job_id}")
        self.storage.delete(f"scan_results:{job_id}")


# Global instances
session_manager = SessionManager()
cache_manager = CacheManager()
scan_results_manager = ScanResultsManager()

from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from datetime import datetime, timedelta
from typing import Optional
import os
import secrets

class SessionManager:
    """Manages secure session tokens using itsdangerous"""
    
    def __init__(self):
        self.secret_key = os.getenv("SECRET_KEY", "your_super_secret_key_for_jwt")
        self.serializer = URLSafeTimedSerializer(self.secret_key)
        self.session_duration = 60 * 60 * 24 * 7  # 7 days in seconds
    
    def create_session_token(self, user_id: str, email: str) -> str:
        """Create a secure session token"""
        data = {
            "user_id": str(user_id),
            "email": email,
            "created_at": datetime.utcnow().isoformat()
        }
        return self.serializer.dumps(data, salt="session-token")
    
    def verify_session_token(self, token: str) -> Optional[dict]:
        """Verify and decode a session token"""
        try:
            data = self.serializer.loads(
                token,
                salt="session-token",
                max_age=self.session_duration
            )
            return data
        except SignatureExpired:
            return None  # Token expired
        except BadSignature:
            return None  # Invalid token
        except Exception as e:
            print(f"Session verification error: {e}")
            return None
    
    def generate_session_id(self) -> str:
        """Generate a unique session ID"""
        return secrets.token_urlsafe(32)

# Global session manager instance
session_manager = SessionManager()

from typing import Annotated

from backend.src.app.core.database import get_db
from backend.src.app.model.user_sessions import UserSessions
from backend.src.app.schemas.user_session.UserSessionCreate import UserSessionCreate
from fastapi import Depends
from sqlalchemy.orm import Session


class UserSessionCRUD:
    def register_user_session(
        self, session_data: UserSessionCreate, db: Annotated[Session, Depends(get_db)]
    ) -> UserSessions:
        # Logic to register a new user session
        session = UserSessions(
            user_id=session_data.user_id,
            user_agent=session_data.user_agent,
            refresh_token=session_data.refresh_token,
            ip_address=session_data.ip_address,
            is_revoked=session_data.is_revoked,
            expires_at=session_data.expires_at,
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

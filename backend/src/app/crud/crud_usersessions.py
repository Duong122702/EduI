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
        session = UserSessions(**session_data.model_dump())
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

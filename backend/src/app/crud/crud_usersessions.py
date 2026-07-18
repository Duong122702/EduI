from typing import Annotated
from uuid import UUID

from backend.src.app.core.database import get_db
from backend.src.app.model.user_sessions import UserSessions
from backend.src.app.schemas.user_session.UserSessionCreate import UserSessionCreate
from fastapi import Depends
from sqlalchemy import update
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

    def get_user_session(
        self, refresh_token: str, db: Annotated[Session, Depends(get_db)]
    ) -> UserSessions | None:
        return (
            db.query(UserSessions)
            .filter(UserSessions.refresh_token == refresh_token)
            .first()
        )

    def revoke_all_user_sessions(
        self, user_id: UUID, db: Annotated[Session, Depends(get_db)]
    ) -> None:
        stmt = (
            update(UserSessions)
            .where(UserSessions.user_id == user_id)
            .where(UserSessions.is_revoked == False)
            .values(is_revoked=True)
        )
        db.execute(stmt)

    def get_user_session_by_id(
        self, user_id: UUID, db: Annotated[Session, Depends(get_db)]
    ) -> UserSessions | None:
        return db.query(UserSessions).filter(UserSessions.id == user_id).first()


user_session_crud = UserSessionCRUD()

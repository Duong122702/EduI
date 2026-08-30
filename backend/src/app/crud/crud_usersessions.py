from uuid import UUID

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.model.user_sessions import UserSessions
from src.app.schemas.user_session.UserSessionCreate import UserSessionCreate


class UserSessionCRUD:
    async def register_user_session(
        self,
        session_data: UserSessionCreate,
        db: AsyncSession,
    ) -> UserSessions:
        # Logic to register a new user session
        session = UserSessions(**session_data.model_dump())
        db.add(session)
        await db.commit()
        await db.refresh(session)
        return session

    async def get_user_session(
        self, refresh_token: str, db: AsyncSession
    ) -> UserSessions | None:
        result = await db.execute(
            select(UserSessions).filter(UserSessions.refresh_token == refresh_token)
        )
        return result.scalars().first()

    async def revoke_all_user_sessions(self, user_id: UUID, db: AsyncSession) -> None:
        stmt = (
            update(UserSessions)
            .where(UserSessions.user_id == user_id)
            .where(~UserSessions.is_revoked)
            .values(is_revoked=True)
        )
        await db.execute(stmt)

    # by user id
    async def get_user_session_by_id(
        self, user_id: UUID, db: AsyncSession
    ) -> UserSessions | None:
        result = await db.execute(
            select(UserSessions)
            .filter(UserSessions.user_id == user_id, ~UserSessions.is_revoked)
            .order_by(UserSessions.created_at.desc())
        )
        return result.scalars().first()


user_session_crud = UserSessionCRUD()

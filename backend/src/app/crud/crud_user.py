from typing import Annotated
from uuid import UUID

from fastapi import Depends
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from src.app.core.database import get_db
from src.app.model.user import User
from src.app.schemas.user.CreateUser import CreateUser
from src.app.schemas.user.UpdateUser import UpdateUser


class UserCRUD:
    async def create_user(
        self,
        user: CreateUser,
        hashed_password: str,
        db: Annotated[AsyncSession, Depends(get_db)],
    ) -> User:
        role_value = (
            user.role.lower() if hasattr(user.role, "value") else str(user.role).lower()
        )
        db_user = User(
            email=user.email,
            hashed_password=hashed_password,
            full_name=user.full_name,
            role=role_value,
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)

        return db_user

    async def get_user_by_email(
        self, email: str, db: Annotated[AsyncSession, Depends(get_db)]
    ) -> User | None:
        result = await db.execute(select(User).filter(User.email == email))
        return result.scalars().first()

    async def get_user_by_id(
        self, id: UUID, db: Annotated[AsyncSession, Depends(get_db)]
    ) -> User | None:
        result = await db.execute(select(User).filter(User.id == id))
        return result.scalars().first()

    async def get_user_by_user_id(
        self, user_id: UUID, db: Annotated[AsyncSession, Depends(get_db)]
    ) -> User | None:
        result = await db.execute(select(User).filter(User.id == user_id))
        return result.scalars().first()

    async def update_user(
        self,
        user_id: UUID,
        user_data: UpdateUser,
        db: Annotated[AsyncSession, Depends(get_db)],
    ) -> User | None:
        db_user = await db.execute(select(User).filter(User.id == user_id))
        result = db_user.scalars().first()
        if not result:
            return None
        update_data = user_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_user, key, value)
        await db.commit()
        await db.refresh(result)
        return result

    async def active_user(
        self, user_id: UUID, db: Annotated[AsyncSession, Depends(get_db)]
    ) -> None:
        stmt = update(User).where(User.id == user_id).values(is_verified=True)
        await db.execute(stmt)
        await db.commit()


user_crud = UserCRUD()

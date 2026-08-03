from typing import Annotated
from uuid import UUID

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.core.database import get_db
from src.app.crud.crud_user import user_crud
from src.app.model.user import User
from src.app.schemas.user.CreateUser import CreateUser

security_scheme = HTTPBearer()


async def verify_email_unique(
    user_data: CreateUser, db: Annotated[AsyncSession, Depends(get_db)]
) -> User | None:
    existing_user = await user_crud.get_user_by_email(user_data.email, db)

    return existing_user


async def get_current_token(
    credenticals: Annotated[HTTPAuthorizationCredentials, Depends(security_scheme)],
) -> str:
    token = credenticals.credentials
    return token


async def get_user_role(
    user_id: str, db: Annotated[AsyncSession, Depends(get_db)]
) -> str | None:
    uuid_user_id = UUID(user_id)
    user = await user_crud.get_user_by_id(uuid_user_id, db)
    return user.role if user else None

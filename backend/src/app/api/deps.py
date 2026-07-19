from typing import Annotated

from backend.src.app.core.database import get_db
from backend.src.app.crud.crud_user import user_crud
from backend.src.app.model.user import User
from backend.src.app.schemas.user.CreateUser import CreateUser
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

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

from typing import Annotated
from uuid import UUID

from fastapi import Depends, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.core.database import get_db
from src.app.core.exceptions import CustomAPIException
from src.app.core.security import verify_token
from src.app.crud.crud_questions import QuestionCRUD
from src.app.crud.crud_user import user_crud
from src.app.model.questions import Questions
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


async def get_current_user(
    token: Annotated[str, Depends(get_current_token)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    user_id = verify_token(token)
    if not user_id:
        raise CustomAPIException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="UNAUTHORIZED",
            message="Token không hợp lệ hoặc đã hết hạn",
        )
    try:
        user_id_uuid = UUID(user_id)
    except ValueError:
        raise CustomAPIException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="UNAUTHORIZED",
            message="Token không hợp lệ",
        ) from None
    user = await user_crud.get_user_by_id(user_id_uuid, db)
    if not user:
        raise CustomAPIException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="UNAUTHORIZED",
            message="Người dùng không tồn tại",
        )
    return user


async def get_current_teacher(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    if current_user.role != "teacher":
        raise CustomAPIException(
            status_code=status.HTTP_403_FORBIDDEN,
            code="FORBIDDEN",
            message="Bạn không có quyền truy cập vào tài nguyên này",
        )
    return current_user


async def get_user_role(
    user_id: str, db: Annotated[AsyncSession, Depends(get_db)]
) -> str | None:
    uuid_user_id = UUID(user_id)
    user = await user_crud.get_user_by_id(uuid_user_id, db)
    return user.role if user else None


async def get_questions_by_questions_ids(
    question_ids: list[str], db: Annotated[AsyncSession, Depends(get_db)]
) -> list[Questions]:
    questions = await QuestionCRUD().get_questions_by_questions_ids(db, question_ids)
    return list(questions)

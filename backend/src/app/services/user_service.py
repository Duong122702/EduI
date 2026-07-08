from datetime import timedelta
from typing import Annotated
from uuid import UUID

import jwt
from backend.src.app.api.deps import verify_email_unique
from backend.src.app.constant.codes import UserCodes
from backend.src.app.constant.messages import UserMessages
from backend.src.app.core.database import get_db
from backend.src.app.core.exceptions import CustomAPIException
from backend.src.app.core.security import create_verify_email_token, hashed_password
from backend.src.app.crud.crud_user import user_crud
from backend.src.app.schemas.user.CreateUser import CreateUser
from fastapi import Depends, status
from sqlalchemy.orm import Session

from app.core.config import settings


class UserService:
    def register_user(
        self, user_data: CreateUser, db: Annotated[Session, Depends(get_db)]
    ) -> str:
        existing_user = verify_email_unique(user_data, db)
        if existing_user:
            raise CustomAPIException(
                status_code=status.HTTP_409_CONFLICT,
                code=UserCodes.ALREADY_EXISTS,
                message=UserMessages.ALREADY_EXISTS,
            )
        hashed_password_value = hashed_password(user_data.password)
        user = user_crud.create_user(user_data, hashed_password_value, db)
        verify_token = create_verify_email_token(
            subject=user.id, expires_delta=timedelta(minutes=30)
        )
        return verify_token

    def verify_email(self, token: str, db: Annotated[Session, Depends(get_db)]) -> None:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, settings.ALGORITHM)
            user_id_str: str | None = payload.get("sub")

        except jwt.PyJWTError:
            raise CustomAPIException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code=UserCodes.INVALID_TOKEN,
                message=UserMessages.INVALID_TOKEN,
            ) from None

        if not user_id_str:
            raise CustomAPIException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code=UserCodes.INVALID_TOKEN,
                message=UserMessages.INVALID_TOKEN,
            )
        try:
            user_id = UUID(user_id_str)
        except ValueError:
            raise CustomAPIException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code=UserCodes.INVALID_TOKEN,
                message=UserMessages.INVALID_TOKEN,
            ) from None
        user = user_crud.active_user(user_id, db)
        if not user:
            raise CustomAPIException(
                status_code=status.HTTP_404_NOT_FOUND,
                code=UserCodes.INVALID_TOKEN,
                message=UserMessages.INVALID_TOKEN,
            )


user_service = UserService()

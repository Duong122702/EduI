from datetime import timedelta
from typing import Annotated

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


user_service = UserService()

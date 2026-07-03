from typing import Annotated

from backend.src.app.core.database import get_db
from backend.src.app.core.exceptions import CustomAPIException
from backend.src.app.core.security import hashed_password
from backend.src.app.crud.crud_user import user_crud
from backend.src.app.schemas.user.CreateUser import CreateUser
from fastapi import Depends
from sqlalchemy.orm import Session


class UserService:
    def register_user(
        self, user_data: CreateUser, db: Annotated[Session, Depends(get_db)]
    ) -> None:
        existing_user = user_crud.get_user_by_email(user_data.email, db)
        if existing_user:
            raise CustomAPIException(
                status_code=400,
                code="USER_ALREADY_EXISTS",
                message="A user with this email already exists.",
            )
        hashed_password_value = hashed_password(user_data.password)
        user_crud.create_user(user_data, hashed_password_value, db)
        pass


user_service = UserService()

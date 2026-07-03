from typing import Annotated

from backend.src.app.core.database import get_db
from backend.src.app.model.user import User
from backend.src.app.schemas.user.CreateUser import CreateUser
from fastapi import Depends
from sqlalchemy.orm import Session


class UserCRUD:
    def create_user(
        self, user: CreateUser, db: Annotated[Session, Depends(get_db)]
    ) -> User:
        db_user = User(
            email=user.email, hashed_password=user.password, fullname=user.fullname
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        return db_user

    def get_user_by_email(
        self, email: str, db: Annotated[Session, Depends(get_db)]
    ) -> User | None:
        return db.query(User).filter(User.email == email).first()


user_crud = UserCRUD()

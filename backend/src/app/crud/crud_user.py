from typing import Annotated
from uuid import UUID

from backend.src.app.core.database import get_db
from backend.src.app.model.user import User
from backend.src.app.schemas.user.CreateUser import CreateUser
from backend.src.app.schemas.user.UpdateUser import UpdateUser
from fastapi import Depends
from sqlalchemy.orm import Session


class UserCRUD:
    def create_user(
        self,
        user: CreateUser,
        hashed_password: str,
        db: Annotated[Session, Depends(get_db)],
    ) -> User:
        db_user = User(
            email=user.email, hashed_password=hashed_password, fullname=user.fullname
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        return db_user

    def get_user_by_email(
        self, email: str, db: Annotated[Session, Depends(get_db)]
    ) -> User | None:
        return db.query(User).filter(User.email == email).first()

    def get_user_by_user_id(
        self, user_id: UUID, db: Annotated[Session, Depends(get_db)]
    ) -> User | None:
        return db.query(User).filter(User.id == user_id).first()

    def update_user(
        self,
        user_id: UUID,
        user_data: UpdateUser,
        db: Annotated[Session, Depends(get_db)],
    ) -> User | None:
        db_user = db.query(User).filter(User.id == user_id).first()
        update_data = user_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
        return db_user

    def active_user(
        self, user_id: UUID, db: Annotated[Session, Depends(get_db)]
    ) -> None:
        db.query(User).filter(User.id == user_id).update({User.is_verified: True})
        db.commit()


user_crud = UserCRUD()

from typing import Annotated

from backend.src.app.core.database import get_db
from backend.src.app.schemas.user.CreateUser import CreateUser
from backend.src.app.services.user_service import user_service
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/register", response_model=None, status_code=status.HTTP_201_CREATED)
def register_user_routes(
    user_data: CreateUser, db: Annotated[Session, Depends(get_db)]
) -> None:
    new_user = user_service.register_user(user_data, db)
    return new_user

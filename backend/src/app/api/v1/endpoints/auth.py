from typing import Annotated

from backend.src.app.core.database import get_db
from backend.src.app.schemas.response import APIResponse
from backend.src.app.schemas.user.CreateUser import CreateUser
from backend.src.app.schemas.user.UserCreateResponse import UserCreateResponse
from backend.src.app.services.email import EmailService
from backend.src.app.services.user_service import user_service
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.post(
    "/register",
    response_model=APIResponse(data=UserCreateResponse),
    status_code=status.HTTP_201_CREATED,
)
def register_user_routes(
    user_data: CreateUser, db: Annotated[Session, Depends(get_db)]
) -> APIResponse:
    verify_token = user_service.register_user(user_data, db)
    EmailService.send_activation_email(
        to_email=user_data.email,
        fullname=user_data.fullname,
        activation_token=verify_token,
    )
    response = UserCreateResponse(email=user_data.email, is_active=False)

    return APIResponse(
        data=response,
        message="Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
    )


@router.get("/verify_email/{token}", response_model=APIResponse)
def verify_email(token: str, db: Annotated[Session, Depends(get_db)]) -> APIResponse:
    user_service.verify_email(token, db)
    return APIResponse(message="Xác thực tài khoản thành công")

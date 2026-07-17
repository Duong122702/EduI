import uuid
from typing import Annotated

from backend.src.app.api.deps import get_current_token
from backend.src.app.constant.codes import UserCodes
from backend.src.app.constant.messages import UserMessages
from backend.src.app.core.database import get_db
from backend.src.app.core.exceptions import CustomAPIException
from backend.src.app.core.security import verify_token
from backend.src.app.schemas.response import APIResponse
from backend.src.app.schemas.user.CreateUser import CreateUser
from backend.src.app.schemas.user.response.GetUserResponse import GetUserResponse
from backend.src.app.schemas.user.response.UserCreateResponse import UserCreateResponse
from backend.src.app.schemas.user.response.UserLoginResponse import UserLoginResponse
from backend.src.app.schemas.user.UserLogin import UserLogin
from backend.src.app.services.email import EmailService
from backend.src.app.services.user_service import user_service
from fastapi import APIRouter, Depends, Request, status
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


@router.get("/verify_email/{token}", response_model=APIResponse())
def verify_email(token: str, db: Annotated[Session, Depends(get_db)]) -> APIResponse:
    user_service.verify_email(token, db)
    return APIResponse(message="Xác thực tài khoản thành công")


@router.post(
    "/login",
    response_model=APIResponse(data=UserLoginResponse),
    status_code=status.HTTP_200_OK,
)
def login_user_routes(
    user_data: UserLogin, db: Annotated[Session, Depends(get_db)]
) -> APIResponse:
    login_response = user_service.login_user(user_data, user_data.isKeepLogin, db)
    return APIResponse(data=login_response, message="Đăng nhập thành công")


@router.post(
    "/getProfile",
    response_model=APIResponse(data=GetUserResponse),
    status_code=status.HTTP_200_OK,
)
def get_profile_routes(
    request: Request,
    token: Annotated[str, Depends(get_current_token)],
    db: Annotated[Session, Depends(get_db)],
) -> APIResponse:
    user_id = verify_token(token)
    if user_id is None:
        raise CustomAPIException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="UNAUTHORIZED",
            message="Token không hợp lệ hoặc đã hết hạn",
        )
    try:
        user_id_uuid = uuid.UUID(user_id)
    except ValueError:
        # Phòng trường hợp chuỗi ID trong token không đúng định dạng UUID chuẩn
        raise CustomAPIException(
            status_code=status.HTTP_400_BAD_REQUEST,
            code=UserCodes.INVALID_USER_ID,
            message=UserMessages.INVALID_USER_ID,
        ) from None
    ip_address = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("user_agent") or "unknown"
    user_data = user_service.get_profile(user_id_uuid, ip_address, user_agent, db)

    return APIResponse(data=user_data)

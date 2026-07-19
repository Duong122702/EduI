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
from backend.src.app.schemas.user.UserLogin import UserLogin
from backend.src.app.services.email import EmailService
from backend.src.app.services.user_service import user_service
from fastapi import (
    APIRouter,
    BackgroundTasks,
    Cookie,
    Depends,
    Request,
    Response,
    status,
)
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.post(
    "/register",
    response_model=APIResponse(data=UserCreateResponse),
    status_code=status.HTTP_201_CREATED,
)
async def register_user_routes(
    user_data: CreateUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    background_tasks: BackgroundTasks,
) -> APIResponse:
    verify_token = await user_service.register_user(user_data, db)
    background_tasks.add_task(
        EmailService.send_activation_email,
        to_email=user_data.email,
        fullname=user_data.full_name,
        activation_token=verify_token,
    )
    response = UserCreateResponse(email=user_data.email, is_active=False)

    return APIResponse(
        data=response,
        message="Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
    )


@router.get("/verify_email/{token}", response_model=APIResponse())
async def verify_email(
    token: str, db: Annotated[AsyncSession, Depends(get_db)]
) -> APIResponse:
    await user_service.verify_email(token, db)
    return APIResponse(message="Xác thực tài khoản thành công")


@router.post(
    "/login",
    response_model=APIResponse(data=str),
    status_code=status.HTTP_200_OK,
)
async def login_user_routes(
    user_data: UserLogin,
    db: Annotated[AsyncSession, Depends(get_db)],
    response: Response,
) -> APIResponse:
    login_response = await user_service.login_user(user_data, user_data.isKeepLogin, db)
    if login_response.refresh_token is not None:
        response.set_cookie(
            key="refresh_token",
            value=login_response.refresh_token,
            httponly=True,
            secure=True,
            samesite="strict",
            max_age=30 * 24 * 3600,
        )
    return APIResponse(data=login_response.access_token, message="Đăng nhập thành công")


@router.post(
    "/getProfile",
    response_model=APIResponse(data=GetUserResponse),
    status_code=status.HTTP_200_OK,
)
async def get_profile_routes(
    request: Request,
    token: Annotated[str, Depends(get_current_token)],
    db: Annotated[AsyncSession, Depends(get_db)],
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
    user_data = await user_service.get_profile(user_id_uuid, ip_address, user_agent, db)

    return APIResponse(data=user_data)


@router.post("/refresh", response_model=APIResponse(data=str))
async def get_new_token_route(
    request: Request,
    response: Response,
    db: Annotated[AsyncSession, Depends(get_db)],
    refresh_token: Annotated[str | None, Cookie()] = None,
) -> APIResponse:
    if not refresh_token:
        raise CustomAPIException(
            status_code=401, code="MISSING_TOKEN", message="Không tìm thấy mã xác thực."
        )

    ip_address = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("user-agent") or "unknown"

    # GỌI TẦNG SERVICE XỬ LÝ LOGIC TRUNG TÂM
    tokens = await user_service.refresh_session(
        refresh_token, ip_address, user_agent, db
    )

    # ROUTE CHỈ LÀM ĐÚNG NHIỆM VỤ HTTP: SET COOKIE VÀ TRẢ JSON BODY
    response.set_cookie(
        key="refresh_token",
        value=tokens.refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        expires=tokens.expires_at,
    )

    return APIResponse(data=tokens.access_token, message="Gia hạn phiên thành công.")

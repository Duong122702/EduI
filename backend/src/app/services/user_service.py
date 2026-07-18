import uuid
from datetime import datetime, timedelta
from typing import Annotated
from uuid import UUID

import jwt
from backend.src.app.api.deps import verify_email_unique
from backend.src.app.constant.codes import UserCodes, UserSessionCodes
from backend.src.app.constant.messages import UserMessages, UserSessionMessages
from backend.src.app.core.database import get_db
from backend.src.app.core.exceptions import CustomAPIException
from backend.src.app.core.security import (
    create_access_token,
    create_refresh_token,
    create_verify_email_token,
    hashed_password,
    verify_refresh_token,
)
from backend.src.app.crud.crud_user import user_crud
from backend.src.app.crud.crud_usersessions import UserSessionCRUD, user_session_crud
from backend.src.app.model.user import User
from backend.src.app.schemas.user.CreateUser import CreateUser
from backend.src.app.schemas.user.RefreshSchema import RefreshSchema
from backend.src.app.schemas.user.response.UserLoginResponse import UserLoginResponse
from backend.src.app.schemas.user.UserLogin import UserLogin
from backend.src.app.schemas.user_session.UserSessionCreate import UserSessionCreate
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

    def login_user(
        self,
        user_data: UserLogin,
        isKeepLogin: bool | None,
        db: Annotated[Session, Depends(get_db)],
    ) -> UserLoginResponse:
        user = user_crud.get_user_by_email(user_data.email, db)
        if not user:
            raise CustomAPIException(
                status_code=status.HTTP_404_NOT_FOUND,
                code=UserCodes.USER_NOT_FOUND,
                message=UserMessages.USER_NOT_FOUND,
            )
        if user.is_verified is False:
            raise CustomAPIException(
                status_code=status.HTTP_403_FORBIDDEN,
                code=UserCodes.USER_NOT_VERIFIED,
                message=UserMessages.USER_NOT_VERIFIED,
            )
        if not hashed_password(user_data.password) == user.hashed_password:
            raise CustomAPIException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                code=UserCodes.INVALID_CREDENTIALS,
                message=UserMessages.INVALID_CREDENTIALS,
            )
        # Generate access token and refresh token
        access_token = create_access_token(subject=user.id)
        if isKeepLogin:
            new_refresh_token = create_refresh_token(subject=user.id)
        session_data = UserSessionCreate(
            user_id=user.id,
            refresh_token=new_refresh_token,
            expires_at=datetime.now() + timedelta(days=30),
        )
        crud = UserSessionCRUD()
        crud.register_user_session(session_data=session_data, db=db)
        return UserLoginResponse(
            access_token=access_token,
            refresh_token=new_refresh_token if isKeepLogin else None,
        )

    def get_profile(
        self,
        user_id: UUID,
        ip_address: str,
        user_agent: str,
        db: Annotated[Session, Depends(get_db)],
    ) -> User:
        user = user_crud.get_user_by_id(user_id, db)
        if user is None:
            raise CustomAPIException(
                status_code=status.HTTP_404_NOT_FOUND,
                code=UserCodes.USER_NOT_FOUND,
                message=UserMessages.USER_NOT_FOUND,
            )
        user_session = user_session_crud.get_user_session_by_id(user_id, db)
        if user_session is None:
            raise CustomAPIException(
                status_code=status.HTTP_404_NOT_FOUND,
                code=UserSessionCodes.USER_SESSION_NOT_FOUND,
                message=UserSessionMessages.USER_SESSION_NOT_FOUND,
            )
        user_session.user_agent = user_agent
        user_session.ip_address = ip_address
        return user

    def refresh_session(
        self,
        refresh_token: str,
        ip_address: str,
        user_agent: str,
        db: Annotated[Session, Depends(get_db)],
    ) -> RefreshSchema:
        # 1. Giải mã JWT và xác thực cơ bản
        user_id = verify_refresh_token(refresh_token)
        if user_id is None:
            raise CustomAPIException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code=UserCodes.INVALID_TOKEN,
                message=UserMessages.INVALID_TOKEN,
            )
        user_id_uuid = uuid.UUID(user_id)

        # 2. Kiểm tra DB
        session_record = user_session_crud.get_user_session(refresh_token, db)
        if not session_record:
            raise CustomAPIException(
                status_code=401,
                code="SESSION_NOT_FOUND",
                message="Phiên không tồn tại.",
            )

        # 3. Phát hiện Replay Attack
        if session_record.is_revoked:
            user_session_crud.revoke_all_user_sessions(user_id=user_id_uuid, db=db)
            db.commit()
            raise CustomAPIException(
                status_code=401,
                code="REPLAY_ATTACK",
                message="Phát hiện truy cập đáng ngờ. Hủy toàn bộ phiên.",
            )

        # 4. Kiểm tra hết hạn trong DB
        now = (
            datetime.now(datetime.astimezone.utc)
            if session_record.expires_at.tzinfo
            else datetime.now()
        )
        if session_record.expires_at < now:
            raise CustomAPIException(
                status_code=401, code="TOKEN_EXPIRED", message="Phiên đã hết hạn."
            )

        # 5. Xoay vòng token: Vô hiệu hóa cái cũ
        session_record.is_revoked = True
        db.add(session_record)

        # 6. Tạo cặp token mới
        new_access_token = create_access_token(subject=str(user_id_uuid))
        new_refresh_token = create_refresh_token(subject=str(user_id_uuid))

        new_expires_at = datetime.now(datetime.astimezone.utc) + timedelta(
            minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES
        )
        # 7. Lưu session mới vào DB
        user_session_crud.register_user_session(
            UserSessionCreate(
                user_id=user_id_uuid,
                refresh_token=new_refresh_token,
                ip_address=ip_address,
                user_agent=user_agent,
                expires_at=new_expires_at,
            ),
            db,
        )
        db.commit()

        # Trả về cả 2 token cho tầng Route xử lý tiếp
        return RefreshSchema(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            expires_at=new_expires_at,
        )


user_service = UserService()

from typing import Annotated

from backend.src.app.api.deps import get_current_token, get_user_role
from backend.src.app.core.database import get_db
from backend.src.app.core.exceptions import CustomAPIException
from backend.src.app.core.security import verify_token
from backend.src.app.schemas.exam.exam_schema import ExamSchemaFilter
from backend.src.app.schemas.exam.response.exam_response import ExamResponse
from backend.src.app.schemas.response import APIResponse
from backend.src.app.services.exam_service import exam_service
from fastapi import Depends, status
from sqlalchemy.ext.asyncio import AsyncSession


async def get_all_exam_route(
    token: Annotated[str, Depends(get_current_token)],
    db: Annotated[AsyncSession, Depends(get_db)],
    params: Annotated[ExamSchemaFilter, Depends()],
    page: int = 1,
    page_size: int = 10,
) -> APIResponse[ExamResponse]:
    user_id = verify_token(token)
    if not user_id:
        raise CustomAPIException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="UNAUTHORIZED",
            message="Token không hợp lệ hoặc đã hết hạn",
        )
    user_role = await get_user_role(user_id, db)
    if user_role != "teacher":
        raise CustomAPIException(
            status_code=status.HTTP_403_FORBIDDEN,
            code="FORBIDDEN",
            message="Bạn không có quyền truy cập vào tài nguyên này",
        )
    exams = await exam_service.get_all_exam(
        db, params=params, page=page, page_size=page_size
    )
    return APIResponse(data=exams, message="Lấy danh sách đề thi thành công")

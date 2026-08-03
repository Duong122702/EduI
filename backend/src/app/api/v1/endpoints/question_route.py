from typing import Annotated

from backend.src.app.api.deps import get_current_token, get_user_role
from backend.src.app.core.database import get_db
from backend.src.app.core.exceptions import CustomAPIException
from backend.src.app.core.security import verify_token
from backend.src.app.schemas.question.response.QuestionResponse import QuestionResponse
from backend.src.app.schemas.response import APIResponse
from backend.src.app.services.question_service import question_service
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.get(
    "/get_all",
    response_model=APIResponse[tuple[list[QuestionResponse], int]],
    status_code=status.HTTP_200_OK,
)
async def get_all_questions_routes(
    token: Annotated[str, Depends(get_current_token)],
    db: Annotated[AsyncSession, Depends(get_db)],
    page: int = Query(default=1, ge=1, description="Số trang (mặc định là 1)"),
    page_size: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Số lượng câu hỏi trên mỗi trang (mặc định là 10)",
    ),
) -> APIResponse[tuple[list[QuestionResponse], int]]:
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
    questions, total = await question_service.get_all_questions(db, page, page_size)
    return APIResponse(
        data=(questions, total), message="Lấy danh sách câu hỏi thành công"
    )

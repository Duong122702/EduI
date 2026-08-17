from typing import Annotated

from fastapi import APIRouter, Depends, Query, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.api.deps import get_current_token, get_user_role
from src.app.core.database import get_db
from src.app.core.exceptions import CustomAPIException
from src.app.core.security import verify_token
from src.app.schemas.question.QuestionSchema import QuestionFilterParams
from src.app.schemas.question.response.MostSubjectResponse import (
    MostSubjectResponse,
)
from src.app.schemas.question.response.QuestionForm import QuestionCreateSchema
from src.app.schemas.question.response.QuestionListResponse import (
    QuestionListResponse,
)
from src.app.schemas.response import APIResponse
from src.app.services.question_service import question_service

router = APIRouter()


@router.get(
    "/get_all",
    response_model=APIResponse[QuestionListResponse],
    status_code=status.HTTP_200_OK,
)
async def get_all_questions_routes(
    token: Annotated[str, Depends(get_current_token)],
    db: Annotated[AsyncSession, Depends(get_db)],
    filter_params: Annotated[QuestionFilterParams, Depends()],
    page: int = Query(default=1, ge=1, description="Số trang (mặc định là 1)"),
    page_size: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Số lượng câu hỏi trên mỗi trang (mặc định là 10)",
    ),
) -> APIResponse[QuestionListResponse]:
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
    questions, total = await question_service.get_all_questions(
        db, page, page_size, filters=filter_params
    )
    return APIResponse(
        data=QuestionListResponse(questions=questions, total=total),
        message="Lấy danh sách câu hỏi thành công",
    )


@router.post("/add", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def add_question_route(
    token: Annotated[str, Depends(get_current_token)],
    db: Annotated[AsyncSession, Depends(get_db)],
    data: Annotated[QuestionCreateSchema, Depends()],
    # 1. Nhận file ảnh câu hỏi
    question_image: UploadFile | None = None,
    # 2. Nhận file ảnh của từng option
    option_A_image: UploadFile | None = None,
    option_B_image: UploadFile | None = None,
    option_C_image: UploadFile | None = None,
    option_D_image: UploadFile | None = None,
):
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
    # Gom các file ảnh option thành dictionary để truyền gọn gàng
    option_images = {
        "A": option_A_image,
        "B": option_B_image,
        "C": option_C_image,
        "D": option_D_image,
    }
    await question_service.create_question(
        db,
        data,
        question_image=question_image,
        option_images=option_images,
    )
    return APIResponse(message="Tạo câu hỏi thành công")


@router.get(
    "/getMostSubject",
    response_model=APIResponse[MostSubjectResponse],
    status_code=status.HTTP_200_OK,
)
async def get_most_subject_route(
    token: Annotated[str, Depends(get_current_token)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> APIResponse[MostSubjectResponse]:
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
    subject = await question_service.get_most_subject(db)
    if subject is None:
        raise CustomAPIException(
            status_code=status.HTTP_404_NOT_FOUND,
            code="NOTFOUND",
            message="Không tìm thấy câu hỏi",
        )
    result = MostSubjectResponse(subject=subject.subject, count=subject.count)
    return APIResponse(data=result, message="Lấy môn học nhiều nhất thành công")

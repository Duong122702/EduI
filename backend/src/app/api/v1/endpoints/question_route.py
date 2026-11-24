from typing import Annotated

from fastapi import APIRouter, Depends, File, Query, UploadFile, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.api.deps import get_current_teacher
from src.app.core.database import get_db
from src.app.core.exceptions import CustomAPIException
from src.app.model.user import User
from src.app.schemas.exam.response.extraction_response import ExtractionResponse
from src.app.schemas.question.QuestionSchema import QuestionFilterParams
from src.app.schemas.question.QuestionUpdateSchema import QuestionUpdateSchema
from src.app.schemas.question.response.MostSubjectResponse import (
    MostSubjectResponse,
)
from src.app.schemas.question.response.QuestionForm import QuestionCreateSchema
from src.app.schemas.question.response.QuestionListResponse import (
    QuestionListResponse,
)
from src.app.schemas.response import APIResponse
from src.app.services.extraction_service import extraction_service
from src.app.services.question_service import question_service

router = APIRouter()


@router.get(
    "/get_all",
    response_model=APIResponse[QuestionListResponse],
    status_code=status.HTTP_200_OK,
)
async def get_all_questions_routes(
    teacher: Annotated[User, Depends(get_current_teacher)],
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
    questions, total = await question_service.get_all_questions(
        db, page, page_size, filters=filter_params
    )
    return APIResponse(
        data=QuestionListResponse(questions=questions, total=total),
        message="Lấy danh sách câu hỏi thành công",
    )


@router.post("/add", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def add_question_route(
    teacher: Annotated[User, Depends(get_current_teacher)],
    db: Annotated[AsyncSession, Depends(get_db)],
    data: Annotated[QuestionCreateSchema, Depends()],
    question_image: UploadFile | None = None,
    option_A_image: UploadFile | None = None,
    option_B_image: UploadFile | None = None,
    option_C_image: UploadFile | None = None,
    option_D_image: UploadFile | None = None,
):
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
    teacher: Annotated[User, Depends(get_current_teacher)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> APIResponse[MostSubjectResponse]:
    subject = await question_service.get_most_subject(db)
    if subject is None:
        raise CustomAPIException(
            status_code=status.HTTP_404_NOT_FOUND,
            code="NOTFOUND",
            message="Không tìm thấy câu hỏi",
        )
    result = MostSubjectResponse(subject=subject.subject, count=subject.count)
    return APIResponse(data=result, message="Lấy môn học nhiều nhất thành công")


@router.post(
    "/extract-pdf",
    response_model=APIResponse[ExtractionResponse],
    status_code=status.HTTP_200_OK,
)
async def extract_questions_from_pdf_route(
    teacher: Annotated[User, Depends(get_current_teacher)],
    file: Annotated[UploadFile, File(description="File PDF đề thi")],
) -> APIResponse[ExtractionResponse]:
    file_bytes = await file.read()
    result = await extraction_service.extract_pdf(file_bytes)
    return APIResponse(data=result, message="Trích xuất câu hỏi thành công")


class ConfirmImportBody(BaseModel):
    extraction_id: str = Field(..., description="ID trích xuất từ Redis cache")


@router.post(
    "/confirm-import", response_model=APIResponse, status_code=status.HTTP_201_CREATED
)
async def confirm_import_questions_route(
    teacher: Annotated[User, Depends(get_current_teacher)],
    db: Annotated[AsyncSession, Depends(get_db)],
    body: ConfirmImportBody,
):
    cached = await extraction_service.get_extraction(body.extraction_id)
    questions_dicts = [q.model_dump() for q in cached.questions]
    from src.app.crud.crud_questions import QuestionCRUD

    inserted_ids = await QuestionCRUD().add_multiple_questions_crud(db, questions_dicts)
    await extraction_service.delete_extraction(body.extraction_id)
    return APIResponse(
        message=f"Import thành công {len(inserted_ids)}/{len(questions_dicts)} câu hỏi."
    )


@router.delete("/{id}", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def delete_question_route(
    teacher: Annotated[User, Depends(get_current_teacher)],
    db: Annotated[AsyncSession, Depends(get_db)],
    id: str,
):
    await question_service.delete_question(db, id)
    return APIResponse(message="Xóa thành công câu hỏi")


@router.put("/{question_id}")
async def update_question_route(
    question_id: str,
    teacher: Annotated[User, Depends(get_current_teacher)],
    db: Annotated[AsyncSession, Depends(get_db)],
    data: Annotated[QuestionUpdateSchema, Depends()],
    question_image: UploadFile | None = None,
    option_A_image: UploadFile | None = None,
    option_B_image: UploadFile | None = None,
    option_C_image: UploadFile | None = None,
    option_D_image: UploadFile | None = None,
):
    option_images = {
        "A": option_A_image,
        "B": option_B_image,
        "C": option_C_image,
        "D": option_D_image,
    }

    await question_service.update_question(
        db=db,
        id=question_id,
        data=data,
        question_image=question_image,
        option_images=option_images,
    )

    return APIResponse(message="Cập nhật câu hỏi thành công")

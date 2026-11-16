from collections import Counter
from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.api.deps import (
    get_current_teacher,
    get_questions_by_questions_ids,
)
from src.app.constant.subject_rules import SUBJECT_RULES, Subject
from src.app.core.database import get_db
from src.app.core.exceptions import CustomAPIException
from src.app.crud.crud_questions import QuestionCRUD
from src.app.model.user import User
from src.app.schemas.exam.create_exam_schema import CreateExamSchema
from src.app.schemas.exam.exam_schema import ExamSchemaFilter
from src.app.schemas.exam.response.exam_response import ExamResponse
from src.app.schemas.exam.response.extraction_response import ExtractionResponse
from src.app.schemas.response import APIResponse
from src.app.services.exam_service import exam_service
from src.app.services.extraction_service import extraction_service

router = APIRouter()


@router.get(
    "/get_all", response_model=APIResponse[ExamResponse], status_code=status.HTTP_200_OK
)
async def get_all_exam_route(
    teacher: Annotated[User, Depends(get_current_teacher)],
    db: Annotated[AsyncSession, Depends(get_db)],
    params: Annotated[ExamSchemaFilter, Depends()],
    page: int = 1,
    page_size: int = 10,
) -> APIResponse[ExamResponse]:
    exams = await exam_service.get_all_exam(
        db, params=params, page=page, page_size=page_size
    )
    return APIResponse(data=exams, message="Lấy danh sách đề thi thành công")


@router.post(
    "/extract-pdf",
    response_model=APIResponse[ExtractionResponse],
    status_code=status.HTTP_200_OK,
)
async def extract_exam_pdf_route(
    teacher: Annotated[User, Depends(get_current_teacher)],
    file: Annotated[UploadFile, File(description="File PDF đề thi")],
) -> APIResponse[ExtractionResponse]:
    file_bytes = await file.read()
    result = await extraction_service.extract_pdf(file_bytes)
    return APIResponse(data=result, message="Trích xuất đề thi thành công")


@router.post("/create", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_exam_route(
    teacher: Annotated[User, Depends(get_current_teacher)],
    db: Annotated[AsyncSession, Depends(get_db)],
    data: CreateExamSchema,
) -> APIResponse:
    question_ids: list[str] = []

    if data.extraction_id:
        cached = await extraction_service.get_extraction(data.extraction_id)
        questions_data = cached["questions"]
        inserted_ids = await QuestionCRUD().add_multiple_questions_crud(db, questions_data)
        question_ids = inserted_ids
        await extraction_service.delete_extraction(data.extraction_id)
    elif data.question_ids:
        question_ids = [qid for qid in data.question_ids if qid is not None]

    if isinstance(data.subject, str):
        try:
            subject_key = Subject[data.subject]
        except KeyError:
            subject_key = None
    else:
        subject_key = data.subject
    rules = SUBJECT_RULES.get(subject_key, {}) if subject_key else {}

    if question_ids:
        question_data = await get_questions_by_questions_ids(
            question_ids=question_ids, db=db
        )

        if len(question_data) != len(question_ids):
            raise CustomAPIException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="BAD_REQUEST",
                message="Một số câu hỏi không tồn tại hoặc không thuộc môn học được chỉ định",
            )
        question_types = []
        for q in question_data:
            if q.subject != data.subject:
                raise CustomAPIException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    code="BAD_REQUEST",
                    message=f"Câu hỏi với ID {q.id} không thuộc môn học được chỉ định",
                )
            question_types.append(q.question_type)
        actual_counts = Counter(question_types)

        for q_type, count in actual_counts.items():
            if q_type == "passage":
                continue
            if q_type not in rules:
                raise CustomAPIException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    code="BAD_REQUEST",
                    message=f"Câu hỏi loại {q_type} không được phép cho môn học này",
                )
            if count > rules[q_type]:
                raise CustomAPIException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    code="BAD_REQUEST",
                    message=f"Số lượng câu hỏi loại {q_type} vượt quá giới hạn cho phép ({rules[q_type]})",
                )

    exam = await exam_service.create_exams(db, data, created_by=teacher.id)

    if question_ids:
        exam_question_data = []
        for index, q_id in enumerate(question_ids, start=1):
            exam_question_data.append(
                {"exam_id": exam.id, "question_id": q_id, "order_index": index}
            )
        await exam_service.add_question_to_exam(db, exam_question_data)

    return APIResponse(message="Tạo đề thi thành công")


@router.post(
    "/add_questions", response_model=APIResponse, status_code=status.HTTP_200_OK
)
async def add_questions_to_exam_route(
    teacher: Annotated[User, Depends(get_current_teacher)],
    db: Annotated[AsyncSession, Depends(get_db)],
    exam_id: str,
    question_ids: list[str],
) -> APIResponse:
    exam = await exam_service.get_exam_by_id(db, exam_id)
    if not exam:
        raise CustomAPIException(
            status_code=status.HTTP_404_NOT_FOUND,
            code="NOT_FOUND",
            message="Đề thi không tồn tại",
        )
    if question_ids:
        valid_ids = [qid for qid in question_ids if qid is not None]
        question_data = await get_questions_by_questions_ids(
            question_ids=valid_ids, db=db
        )

        if len(question_data) != len(valid_ids):
            raise CustomAPIException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="BAD_REQUEST",
                message="Một số câu hỏi không tồn tại hoặc không thuộc môn học được chỉ định",
            )
        question_types = []
        for q in question_data:
            if q.subject != exam.subject:
                raise CustomAPIException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    code="BAD_REQUEST",
                    message=f"Câu hỏi với ID {q.id} không thuộc môn học của đề thi",
                )
            question_types.append(q.question_type)
        actual_counts = Counter(question_types)

        if isinstance(exam.subject, str):
            try:
                subject_key = Subject[exam.subject]
            except KeyError:
                subject_key = None
        else:
            subject_key = exam.subject
        rules = SUBJECT_RULES.get(subject_key, {}) if subject_key else {}
        for q_type, count in actual_counts.items():
            if q_type == "passage":
                continue

            if q_type not in rules:
                raise CustomAPIException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    code="BAD_REQUEST",
                    message=f"Câu hỏi loại {q_type} không được phép cho môn học này",
                )

            if count > rules[q_type]:
                raise CustomAPIException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    code="BAD_REQUEST",
                    message=f"Số lượng câu hỏi loại {q_type} thêm vào vượt quá giới hạn cho phép ({rules[q_type]})",
                )

        exam_question_data = []

        current_max_index = await exam_service.get_max_order_index_of_exam(db, exam.id)
        start_index = (current_max_index or 0) + 1

        for index, q_id in enumerate(question_ids, start=start_index):
            if q_id:
                exam_question_data.append(
                    {"exam_id": exam.id, "question_id": q_id, "order_index": index}
                )

        await exam_service.add_question_to_exam(db, exam_question_data)
    return APIResponse(message="Thêm câu hỏi vào đề thi thành công")

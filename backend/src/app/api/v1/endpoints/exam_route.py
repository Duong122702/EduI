from collections import Counter
from typing import Annotated
from uuid import UUID

from backend.src.app.api.deps import (
    get_current_token,
    get_questions_by_questions_ids,
    get_user_role,
)
from backend.src.app.constant.subject_rules import SUBJECT_RULES, QuestionType, Subject
from backend.src.app.core.database import get_db
from backend.src.app.core.exceptions import CustomAPIException
from backend.src.app.core.security import verify_token
from backend.src.app.schemas.exam.create_exam_schema import CreateExamSchema
from backend.src.app.schemas.exam.exam_schema import ExamSchemaFilter
from backend.src.app.schemas.exam.response.exam_response import ExamResponse
from backend.src.app.schemas.response import APIResponse
from backend.src.app.services.exam_service import exam_service
from backend.src.app.utils.index_pool import get_index_pool_for_subject
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.get(
    "/get_all", response_model=APIResponse[ExamResponse], status_code=status.HTTP_200_OK
)
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


@router.post("/create", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_exam_route(
    token: Annotated[str, Depends(get_current_token)],
    db: Annotated[AsyncSession, Depends(get_db)],
    data: CreateExamSchema,
) -> APIResponse:
    if isinstance(data.subject, str):
        try:
            subject_key = Subject[
                data.subject
            ]  # Hoặc Subject(data.subject) tùy cách bạn định nghĩa Enum
        except KeyError:
            subject_key = None
    else:
        subject_key = data.subject
    rules = SUBJECT_RULES.get(subject_key, {}) if subject_key else {}
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
    if data.question_ids:
        valid_ids = [qid for qid in data.question_ids if qid is not None]
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
            if q.subject != data.subject:
                raise CustomAPIException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    code="BAD_REQUEST",
                    message=f"Câu hỏi với ID {q.id} không thuộc môn học được chỉ định",
                )
            question_types.append(q.question_type)
        actual_counts = Counter(question_types)

        for q_type, count in actual_counts.items():
            if q_type in rules:
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

    exam = await exam_service.create_exams(db, data)

    if data.question_ids:
        index_pools = get_index_pool_for_subject(data.subject)
        question_type_map = {q.id: q.question_type for q in question_data}
        exam_question_data = []
        for q_id in data.question_ids:
            if q_id:
                q_type = question_type_map[UUID(q_id)]
            assigned_index = index_pools[QuestionType(q_type)].pop()
            exam_question_data.append(
                {"exam_id": exam.id, "question_id": q_id, "order_index": assigned_index}
            )
        await exam_service.add_question_to_exam(db, exam_question_data)
    return APIResponse(message="Tạo đề thi thành công")


@router.post(
    "/add_questions", response_model=APIResponse, status_code=status.HTTP_200_OK
)
async def add_questions_to_exam_route(
    token: Annotated[str, Depends(get_current_token)],
    db: Annotated[AsyncSession, Depends(get_db)],
    exam_id: str,
    question_ids: list[str],
) -> APIResponse:
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
                subject_key = Subject[
                    exam.subject
                ]  # Hoặc Subject(exam.subject) tùy cách bạn định nghĩa Enum
            except KeyError:
                subject_key = None
        else:
            subject_key = exam.subject
        rules = SUBJECT_RULES.get(subject_key, {}) if subject_key else {}
        for q_type, count in actual_counts.items():
            if q_type in rules:
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

        index_pools = get_index_pool_for_subject(exam.subject)
        question_type_map = {q.id: q.question_type for q in question_data}
        exam_question_data = []
        for q_id in question_ids:
            if q_id:
                q_type = question_type_map[UUID(q_id)]
            assigned_index = index_pools[QuestionType(q_type)].pop()
            exam_question_data.append(
                {"exam_id": exam.id, "question_id": q_id, "order_index": assigned_index}
            )
        await exam_service.add_question_to_exam(db, exam_question_data)
    return APIResponse(message="Thêm câu hỏi vào đề thi thành công")

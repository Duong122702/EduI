from sqlalchemy.ext.asyncio import AsyncSession

from src.app.crud.crud_exams import ExamCRUD
from src.app.model.exams import Exam
from src.app.schemas.exam.create_exam_schema import CreateExamSchema
from src.app.schemas.exam.exam_schema import ExamSchemaFilter
from src.app.schemas.exam.response.exam_response import ExamResponse


class ExamService:
    async def get_all_exam(
        self,
        db: AsyncSession,
        params: ExamSchemaFilter,
        page: int = 1,
        page_size: int = 10,
    ) -> ExamResponse:
        exams_list, total = await ExamCRUD().get_all_exam(
            db, params=params, page=page, page_size=page_size
        )
        return ExamResponse(data=exams_list, total=total)

    async def get_exam_by_id(self, db: AsyncSession, exam_id: str) -> Exam | None:
        exam = await ExamCRUD().get_exam_by_id(db, exam_id)
        return exam

    async def create_exams(self, db: AsyncSession, data: CreateExamSchema) -> Exam:
        new_exam = await ExamCRUD().create_exams(db, data)
        return new_exam

    async def add_question_to_exam(
        self, db: AsyncSession, exam_question_data: list[dict]
    ) -> None:
        await ExamCRUD().add_questions_to_exam(db, exam_question_data)


exam_service = ExamService()

from backend.src.app.crud.crud_exams import ExamCRUD
from backend.src.app.model.exams import Exam
from backend.src.app.schemas.exam.create_exam_schema import CreateExamSchema
from backend.src.app.schemas.exam.exam_schema import ExamSchemaFilter
from backend.src.app.schemas.exam.response.exam_response import ExamResponse
from sqlalchemy.ext.asyncio import AsyncSession


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

    async def create_exams(self, db: AsyncSession, data: CreateExamSchema) -> Exam:
        new_exam = await ExamCRUD().create_exams(db, data)
        return new_exam


exam_service = ExamService()

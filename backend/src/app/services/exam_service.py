from backend.src.app.crud.crud_exams import ExamCRUD
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


exam_service = ExamService()

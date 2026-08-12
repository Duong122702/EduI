from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.core.database import get_db
from src.app.crud.crud_questions import QuestionCRUD
from src.app.schemas.question.QuestionCreateSchema import QuestionCreateSchema
from src.app.schemas.question.QuestionSchema import QuestionFilterParams
from src.app.schemas.question.response.QuestionResponse import QuestionResponse


class QuestionService:
    async def get_all_questions(
        self,
        db: Annotated[AsyncSession, Depends(get_db)],
        page: int = 1,
        page_size: int = 10,
        filters: QuestionFilterParams | None = None,
    ) -> tuple[list[QuestionResponse], int]:
        question_crud = QuestionCRUD()
        questions, total = await question_crud.get_all_questions(
            db, page, page_size, filters
        )
        question_responses = [
            QuestionResponse.model_validate(question) for question in questions
        ]
        return question_responses, total

    async def create_question(
        self, db: Annotated[AsyncSession, Depends(get_db)], data: QuestionCreateSchema
    ):
        await QuestionCRUD().add_question_crud(db=db, data=data)


question_service = QuestionService()

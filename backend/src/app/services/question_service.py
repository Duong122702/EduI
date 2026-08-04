from typing import Annotated

from backend.src.app.core.database import get_db
from backend.src.app.crud.crud_questions import QuestionCRUD
from backend.src.app.schemas.question.QuestionSchema import QuestionFilterParams
from backend.src.app.schemas.question.response.QuestionResponse import QuestionResponse
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession


class QuestionSerivce:
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


question_service = QuestionSerivce()

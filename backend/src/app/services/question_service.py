from typing import Annotated

from backend.src.app.schemas.question.response.MostSubjectResponse import (
    MostSubjectResponse,
)
from fastapi import Depends, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.core.database import get_db
from src.app.crud.crud_questions import QuestionCRUD
from src.app.schemas.question.QuestionSchema import QuestionFilterParams
from src.app.schemas.question.response.QuestionForm import QuestionCreateSchema
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
        self,
        db: Annotated[AsyncSession, Depends(get_db)],
        data: QuestionCreateSchema,
        question_image: UploadFile | None = None,
        option_images: dict[str, UploadFile | None] | None = None,
    ):
        return await QuestionCRUD().add_question_crud(
            db=db,
            data=data,
            question_image=question_image,
            option_images=option_images,
        )

    async def get_most_subject(
        self,
        db: Annotated[AsyncSession, Depends(get_db)],
    ) -> MostSubjectResponse | None:
        return await QuestionCRUD().get_most_subject_crud(db=db)


question_service = QuestionService()

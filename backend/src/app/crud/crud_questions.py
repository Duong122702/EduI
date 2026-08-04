from typing import Annotated

from backend.src.app.core.database import get_db
from backend.src.app.model.questions import Questions
from backend.src.app.schemas.question.QuestionSchema import QuestionFilterParams
from fastapi import Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession


class QuestionCRUD:
    async def get_all_questions(
        self,
        db: Annotated[AsyncSession, Depends(get_db)],
        page: int = 1,
        page_size: int = 10,
        filters: QuestionFilterParams | None = None,
    ) -> tuple[list[Questions], int]:
        query = select(Questions)
        skip = (page - 1) * page_size

        if filters:
            if filters.exam_id is not None:
                query = query.where(Questions.exam_id == filters.exam_id)
            if filters.subject is not None:
                query = query.where(Questions.subject.ilike(f"%{filters.subject}%"))
            if filters.topic is not None:
                query = query.where(Questions.topic.ilike(f"%{filters.topic}%"))
            if filters.level is not None:
                query = query.where(Questions.level == filters.level)
            if filters.question_type is not None:
                query = query.where(Questions.question_type == filters.question_type)
            if filters.content is not None:
                query = query.where(Questions.content.ilike(f"%{filters.content}%"))
            if filters.question_number is not None:
                query = query.where(
                    Questions.question_number == filters.question_number
                )
            if filters.score_weight is not None:
                query = query.where(Questions.score_weight == filters.score_weight)

        count_stmt = select(func.count()).select_from(query.subquery())
        total_count_result = await db.execute(count_stmt)
        total: int = total_count_result.scalar_one()

        data_stmt = (
            query.order_by(Questions.created_at.desc()).offset(skip).limit(page_size)
        )
        data_result = await db.execute(data_stmt)
        questions = data_result.scalars().all()

        return list(questions), total

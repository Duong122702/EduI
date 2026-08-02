from typing import Annotated

from backend.src.app.core.database import get_db
from backend.src.app.model.questions import Questions
from fastapi import Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession


class QuestionCRUD:
    async def get_all_questions(
        self,
        db: Annotated[AsyncSession, Depends(get_db)],
        page: int = 1,
        page_size: int = 10,
    ) -> tuple[list[Questions], int]:
        skip = (page - 1) * page_size

        count_stmt = select(func.count()).select_from(Questions)
        total_count_result = await db.execute(count_stmt)
        total = total_count_result.scalar_one()

        data_stmt = (
            select(Questions)
            .offset(skip)
            .limit(page_size)
            .order_by(Questions.id.desc())
        )
        data_result = await db.execute(data_stmt)
        questions = data_result.scalars().all()

        return list(questions), total

import asyncio
from typing import Annotated

from fastapi import Depends, UploadFile
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.core.database import get_db
from src.app.model.questions import Questions
from src.app.schemas.question.QuestionSchema import QuestionFilterParams
from src.app.schemas.question.response.MostSubjectResponse import (
    MostSubjectResponse,
)
from src.app.schemas.question.response.QuestionForm import QuestionCreateSchema
from src.app.utils.storage import upload_file_to_supabase


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
            if filters.source_label is not None:
                query = query.where(Questions.source_label == filters.source_label)
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

    async def add_question_crud(
        self,
        db: Annotated[AsyncSession, Depends(get_db)],
        data: QuestionCreateSchema,
        question_image: UploadFile | None = None,
        option_images: dict[str, UploadFile | None] | None = None,
    ):
        # 1. Upload ảnh câu hỏi chính (nếu có)
        question_image_url: str | None = None
        if question_image and question_image.filename:
            question_image_url = await upload_file_to_supabase(question_image)
            # 2. Xử lý đóng gói & upload ảnh cho các Option (A, B, C, D)

        # Map nội dung text từ schema
        option_contents = {
            "A": data.option_A_content,
            "B": data.option_B_content,
            "C": data.option_C_content,
            "D": data.option_D_content,
        }

        async def process_option(key: str):
            content = option_contents.get(key)
            img_file = option_images.get(key) if option_images else None

            img_url = None
            if img_file and img_file.filename:
                img_url = await upload_file_to_supabase(img_file)

            # Chỉ lưu option nếu có text hoặc có ảnh đính kèm
            if content or img_url:
                return key, {
                    "content": content or "",
                    "image_url": img_url,
                }
            return key, None

        # Chạy upload song song các ảnh của option
        keys = ["A", "B", "C", "D"]
        results = await asyncio.gather(*(process_option(k) for k in keys))
        options_data = {key: val for key, val in results if val is not None}
        db_question = Questions(
            subject=data.subject,
            content=data.content,
            source_label=data.source_label,
            score_weight=data.score_weight,
            level=data.level,
            question_type=data.question_type,
            correct_answer=data.correct_answer,
            topic=data.topic,
            explanation=data.explanation,
            image_url=question_image_url,
            options=options_data,
        )
        db.add(db_question)
        await db.commit()
        await db.refresh(db_question)

        return db_question

    async def get_most_subject_crud(
        self,
        db: Annotated[AsyncSession, Depends(get_db)],
    ) -> MostSubjectResponse | None:
        stmt = (
            select(Questions.subject, func.count().label("total_subjects"))
            .group_by(Questions.subject)
            .order_by(desc("total_subjects"), Questions.subject.asc())
            .limit(1)
        )
        result = await db.execute(stmt)
        row = result.first()
        if not row:
            return None  # Hợp lệ vì return type cho phép None

        # Khởi tạo đối tượng MostSubjectResponse thay vì trả về dict
        return MostSubjectResponse(
            subject=row.subject,
            count=row.total_subjects,  # Tên field khớp với schema của bạn
        )

import asyncio
from uuid import UUID

from fastapi import UploadFile, status
from sqlalchemy import delete, desc, exists, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.core.exceptions import CustomAPIException
from src.app.model.questions import Questions
from src.app.schemas.question.QuestionSchema import QuestionFilterParams
from src.app.schemas.question.QuestionUpdateSchema import QuestionUpdateSchema
from src.app.schemas.question.response.MostSubjectResponse import (
    MostSubjectResponse,
)
from src.app.schemas.question.response.QuestionForm import QuestionCreateSchema
from src.app.utils.storage import delete_file_from_supabase, upload_file_to_supabase


class QuestionCRUD:
    async def get_all_questions(
        self,
        db: AsyncSession,
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
        db: AsyncSession,
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
        db: AsyncSession,
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

    async def add_multiple_questions_crud(
        self, db: AsyncSession, question_data: list[dict]
    ):
        db_questions = []
        for q_data in question_data:
            db_question = Questions(
                subject=q_data["subject"],
                content=q_data["content"],
                level=q_data["level"],
                question_type=q_data.get("question_type", "Trắc nghiệm"),
                correct_answer=q_data["correct_answer"],
                options=q_data["options"],
                image_url=q_data.get("image_url"),
                score_weight=q_data.get("score_weight", 0.25),
                explanation=q_data.get("explanation", ""),
                source_label=q_data.get("source_label"),
                topic=q_data.get("topic"),
            )
            db_questions.append(db_question)
        if db_questions:
            db.add_all(db_questions)
            await db.commit()
        return len(db_questions)

    async def check_exist_question_by_id_crud(self, db: AsyncSession, id: UUID):
        stmt = select(exists().where(Questions.id == id))
        result = await db.scalar(stmt)
        return result

    async def delete_question_by_id(self, db: AsyncSession, id: UUID):
        await db.execute(delete(Questions).where(Questions.id == id))
        await db.commit()

    async def update_question_crud(
        self,
        db: AsyncSession,
        question_id: UUID,
        data: QuestionUpdateSchema,
        question_image: UploadFile | None = None,
        option_images: dict[str, UploadFile | None] | None = None,
    ):
        result = await db.execute(select(Questions).where(Questions.id == question_id))
        db_question = result.scalar_one()

        if not db_question:
            raise CustomAPIException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="NOT_FOUND",
                message="Không tìm thấy câu hỏi",
            )
        if question_image and question_image.filename:
            old_image_url = db_question.image_url
            new_image_url = await upload_file_to_supabase(question_image)
            db_question.image_url = new_image_url
            if old_image_url:
                await delete_file_from_supabase(
                    old_image_url, bucket_name="question_images"
                )

        existing_options = db_question.options or {}

        option_contents = {
            "A": data.option_A_content,
            "B": data.option_B_content,
            "C": data.option_C_content,
            "D": data.option_D_content,
        }

        async def process_update_option(key: str):
            new_content = option_contents.get(key)
            new_img_file = option_images.get(key) if option_images else None

            # Lấy state hiện tại của option này trong DB
            current_opt = existing_options.get(key, {"content": "", "image_url": None})

            updated_content = current_opt.get("content", "")
            updated_image_url = current_opt.get("image_url")

            # Cập nhật content nếu có gửi lên text mới
            if new_content is not None:
                updated_content = new_content

            # Cập nhật ảnh nếu có gửi lên file mới
            if new_img_file and new_img_file.filename:
                updated_image_url = await upload_file_to_supabase(new_img_file)

            # Trả về data đã được cập nhật
            if updated_content or updated_image_url:
                return key, {
                    "content": updated_content,
                    "image_url": updated_image_url,
                }
            return key, None

        # Chạy song song quá trình upload ảnh options
        keys = ["A", "B", "C", "D"]
        results = await asyncio.gather(*(process_update_option(k) for k in keys))

        # Cập nhật lại trường options
        updated_options_data = {key: val for key, val in results if val is not None}
        db_question.options = updated_options_data

        # 4. Cập nhật các trường text khác (chỉ cập nhật những trường được gửi lên khác None)
        # Lấy dữ liệu update dạng dict, loại bỏ những trường chưa được set
        update_data = data.model_dump(exclude_unset=True)

        # Bỏ qua các trường option text vì đã xử lý ở trên
        for opt_key in [
            "option_A_content",
            "option_B_content",
            "option_C_content",
            "option_D_content",
        ]:
            update_data.pop(opt_key, None)

        for field, value in update_data.items():
            setattr(db_question, field, value)

        # 5. Lưu vào DB
        await db.commit()
        await db.refresh(db_question)

        return db_question

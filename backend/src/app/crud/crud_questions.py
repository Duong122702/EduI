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

        if data.is_passage:
            passage_data = {
                field: value
                for field, value in data.to_dict().items()
                if field
                not in {
                    "is_passage",
                    "option_A_content",
                    "option_B_content",
                    "option_C_content",
                    "option_D_content",
                }
                and value is not None
            }
            if question_image_url is not None:
                passage_data["image_url"] = question_image_url

            db_question = Questions(**passage_data)
            db.add(db_question)
            await db.commit()
            await db.refresh(db_question)
            return db_question

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
        passage_questions = []
        temp_id_to_db_id = {}

        # Passage phải được insert trước để câu hỏi con có thể tham chiếu UUID thật.
        for q_data in question_data:
            if not q_data.get("is_passage"):
                continue
            db_question = Questions(
                subject=q_data["subject"],
                content=q_data["content"],
                level=q_data.get("level"),
                question_type=q_data.get("question_type", "Trắc nghiệm"),
                correct_answer=q_data.get("correct_answer", ""),
                options=None,
                image_url=q_data.get("image_url"),
                score_weight=q_data.get("score_weight", 0),
                explanation=q_data.get("explanation", ""),
                source_label=q_data.get("source_label"),
                topic=q_data.get("topic"),
            )
            passage_questions.append(db_question)

        if passage_questions:
            db.add_all(passage_questions)
            await db.flush()

        passage_index = 0
        for q_data in question_data:
            if not q_data.get("is_passage"):
                continue
            temp_id = q_data.get("temp_id")
            if temp_id:
                temp_id_to_db_id[temp_id] = passage_questions[passage_index].id
            passage_index += 1

        question_rows = []
        for q_data in question_data:
            if q_data.get("is_passage"):
                continue
            temp_parent_id = q_data.get("temp_parent_id")
            parent_id = q_data.get("parent_id")
            if temp_parent_id:
                parent_id = temp_id_to_db_id.get(temp_parent_id)
            if temp_parent_id and parent_id is None:
                raise ValueError(f"Không tìm thấy passage cha: {temp_parent_id}")

            db_question = Questions(
                subject=q_data["subject"],
                content=q_data["content"],
                level=q_data.get("level"),
                question_type=q_data.get("question_type", "Trắc nghiệm"),
                correct_answer=q_data.get("correct_answer", ""),
                options=q_data.get("options"),
                image_url=q_data.get("image_url"),
                score_weight=q_data.get("score_weight", 0.25),
                explanation=q_data.get("explanation", ""),
                source_label=q_data.get("source_label"),
                topic=q_data.get("topic"),
                parent_id=parent_id,
            )
            question_rows.append(db_question)

        if question_rows:
            db.add_all(question_rows)
        if passage_questions or question_rows:
            await db.commit()
        return len(passage_questions) + len(question_rows)

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
        db_question = result.scalar_one_or_none()

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

        # Lấy dữ liệu update dạng dict, loại bỏ những trường chưa được set
        update_data = data.model_dump(exclude_unset=True)
        is_passage_update = update_data.pop("is_passage", None)

        if is_passage_update is True:
            db_question.options = None
            db_question.parent_id = None
            update_data.pop("parent_id", None)
        elif is_passage_update is False:
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
                current_opt = existing_options.get(
                    key, {"content": "", "image_url": None}
                )

                updated_content = current_opt.get("content", "")
                updated_image_url = current_opt.get("image_url")

                if new_content is not None:
                    updated_content = new_content
                if new_img_file and new_img_file.filename:
                    updated_image_url = await upload_file_to_supabase(new_img_file)

                if updated_content or updated_image_url:
                    return key, {
                        "content": updated_content,
                        "image_url": updated_image_url,
                    }
                return key, None

            keys = ["A", "B", "C", "D"]
            results = await asyncio.gather(*(process_update_option(k) for k in keys))
            db_question.options = {
                key: value for key, value in results if value is not None
            }

        # Bỏ qua các trường option text vì đã xử lý ở trên
        for opt_key in [
            "option_A_content",
            "option_B_content",
            "option_C_content",
            "option_D_content",
        ]:
            update_data.pop(opt_key, None)

        if "parent_id" in update_data:
            parent_id = update_data["parent_id"]
            update_data["parent_id"] = UUID(parent_id) if parent_id else None

        for field, value in update_data.items():
            setattr(db_question, field, value)

        # 5. Lưu vào DB
        await db.commit()
        await db.refresh(db_question)

        return db_question

    async def get_questions_by_questions_ids(
        self, db: AsyncSession, question_ids: list[str]
    ):
        stmt = select(Questions).where(Questions.id.in_(question_ids))
        result = await db.execute(stmt)
        return result.scalars().all()

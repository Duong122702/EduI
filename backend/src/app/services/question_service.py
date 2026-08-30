import json
from typing import Annotated
from uuid import UUID

from fastapi import Depends, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.core.exceptions import CustomAPIException
from src.app.crud.crud_questions import QuestionCRUD
from src.app.schemas.question.QuestionSchema import QuestionFilterParams
from src.app.schemas.question.QuestionUpdateSchema import QuestionUpdateSchema
from src.app.schemas.question.response.MostSubjectResponse import (
    MostSubjectResponse,
)
from src.app.schemas.question.response.QuestionForm import QuestionCreateSchema
from src.app.schemas.question.response.QuestionResponse import QuestionResponse
from src.app.services.ai_agents.pipeline import execute_exam_agent_pipeline
from src.app.utils.pdf_parser import extract_text_with_image_placeholders
from src.app.utils.storage import upload_bytes_to_supabase


class QuestionService:
    async def get_all_questions(
        self,
        db: AsyncSession,
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
        db: AsyncSession,
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
        db: AsyncSession,
    ) -> MostSubjectResponse | None:
        return await QuestionCRUD().get_most_subject_crud(db=db)

    async def import_questions_from_pdf(
        self,
        db: Annotated[AsyncSession, Depends()],
        file_bytes: bytes,
        subject: str,
        level: str,
    ) -> tuple[int, int]:
        raw_text, images_dict = extract_text_with_image_placeholders(file_bytes)
        if not raw_text.strip():
            raise CustomAPIException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="BAD_REQUEST",
                message="Không tìm thấy câu hỏi nào hoặc sai format.",
            )
        # 2. Xử lý upload ảnh và chuẩn bị dữ liệu
        exam_meta, parsed_questions = await execute_exam_agent_pipeline(raw_text)
        if not parsed_questions:
            raise CustomAPIException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="BAD_REQUEST",
                message="Không thể bóc tách câu hỏi từ tài liệu",
            )
        questions_to_insert = []
        detected_subject = exam_meta.get("subject") or subject
        for q_data in parsed_questions:
            try:
                # Upload ảnh câu hỏi
                q_img_url = None
                q_placeholder = q_data.get("question_image_placeholder")
                if q_placeholder and q_placeholder in images_dict:
                    img_info = images_dict[q_placeholder]
                    q_img_url = await upload_bytes_to_supabase(
                        img_info["bytes"], img_info["ext"]
                    )

                # Upload ảnh đáp án
                options_data = {}
                raw_options = q_data.get("options") or {}
                for key in ["A", "B", "C", "D"]:
                    opt = raw_options.get(key, {})
                    opt_content = (
                        opt.get("content", "") if isinstance(opt, dict) else str(opt)
                    )
                    opt_placeholder = (
                        opt.get("image_placeholder")
                        if isinstance(opt, dict)
                        else str(opt)
                    )

                    opt_img_url = None
                    if opt_placeholder and opt_placeholder in images_dict:
                        opt_img_info = images_dict[opt_placeholder]
                        opt_img_url = await upload_bytes_to_supabase(
                            opt_img_info["bytes"], opt_img_info["ext"]
                        )
                    options_data[key] = {
                        "content": opt_content,
                        "image_url": opt_img_url,
                    }
                correct_ans = q_data.get("correct_answer")
                if isinstance(correct_ans, dict):
                    correct_ans = json.dumps(correct_ans, ensure_ascii=False)
                # Chuẩn bị Dictionary dữ liệu
                questions_to_insert.append(
                    {
                        "subject": detected_subject,
                        "content": q_data.get("content", ""),
                        "level": q_data.get("level") or level,
                        "question_type": q_data.get("question_type", "Trắc nghiệm"),
                        "correct_answer": str(correct_ans or "A"),
                        "options": options_data,
                        "image_url": q_img_url,
                        "source_label": q_data.get("source_label", ""),
                        "score_weight": q_data.get("score_weight", 0.25),
                        "explanation": q_data.get("explanation", ""),
                        "topic": q_data.get("topic", None),
                    }
                )
            except Exception as e:
                print(f"Lỗi khi xử lý câu hỏi/ảnh: {e}")
                continue  # Nếu lỗi câu này thì bỏ qua, đi tới câu tiếp theo

        if not questions_to_insert:
            raise CustomAPIException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="BAD_REQUEST",
                message="Đã xảy ra lỗi trong quá trình trích xuất và upload ảnh.",
            )

        # 3. Gọi tầng CRUD để lưu DB
        success_count = await QuestionCRUD().add_multiple_questions_crud(
            db, questions_to_insert
        )

        return success_count, len(parsed_questions)

    async def delete_question(self, db: AsyncSession, id: str):
        question_id = UUID(id)
        isExist = await QuestionCRUD().check_exist_question_by_id_crud(
            id=question_id, db=db
        )
        if not isExist:
            raise CustomAPIException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="ID_NOT_FOUND",
                message="Id không tồn tại",
            )
        await QuestionCRUD().delete_question_by_id(id=question_id, db=db)

    async def update_question(
        self,
        db: AsyncSession,
        id: str,
        data: QuestionUpdateSchema,
        question_image: UploadFile | None = None,
        option_images: dict[str, UploadFile | None] | None = None,
    ):
        question_id = UUID(id)
        return await QuestionCRUD().update_question_crud(
            db, question_id, data, question_image, option_images
        )


question_service = QuestionService()

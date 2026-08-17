from typing import Annotated

from backend.src.app.core.exceptions import CustomAPIException
from backend.src.app.utils.pdf_parser import parse_pdf_to_questions
from backend.src.app.utils.storage import upload_bytes_to_supabase
from fastapi import Depends, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.core.database import get_db
from src.app.crud.crud_questions import QuestionCRUD
from src.app.schemas.question.QuestionSchema import QuestionFilterParams
from src.app.schemas.question.response.MostSubjectResponse import (
    MostSubjectResponse,
)
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

    async def import_questions_from_pdf(
        self,
        db: Annotated[AsyncSession, Depends()],
        file_bytes: bytes,
        subject: str,
        level: str,
    ) -> tuple[int, int]:
        parsed_questions = parse_pdf_to_questions(file_bytes)
        if not parsed_questions:
            raise CustomAPIException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="BAD_REQUEST",
                message="Không tìm thấy câu hỏi nào hoặc sai format.",
            )
        # 2. Xử lý upload ảnh và chuẩn bị dữ liệu
        questions_to_insert = []
        for q_data in parsed_questions:
            try:
                # Upload ảnh câu hỏi
                q_img_url = None
                if q_data.get("question_image"):
                    q_img_url = await upload_bytes_to_supabase(
                        q_data["question_image"]["bytes"],
                        q_data["question_image"]["ext"],
                    )

                # Upload ảnh đáp án
                options_data = {}
                for key in ["A", "B", "C", "D"]:
                    opt = q_data["options"][key]
                    opt_img_url = None
                    if opt.get("image"):
                        opt_img_url = await upload_bytes_to_supabase(
                            opt["image"]["bytes"], opt["image"]["ext"]
                        )
                    options_data[key] = {
                        "content": opt["content"],
                        "image_url": opt_img_url,
                    }

                # Chuẩn bị Dictionary dữ liệu
                questions_to_insert.append(
                    {
                        "subject": subject,
                        "content": q_data["content"],
                        "level": level,
                        "question_type": "Trắc nghiệm",
                        "correct_answer": q_data["correct_answer"],
                        "options": options_data,
                        "image_url": q_img_url,
                        "score_weight": 0.25,
                        "explanation": q_data.get("explanation", ""),
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


question_service = QuestionService()

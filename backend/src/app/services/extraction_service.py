import json
import uuid

from fastapi import status

from src.app.core.exceptions import CustomAPIException
from src.app.core.redis import redis_client
from src.app.schemas.exam.response.extraction_response import (
    ExamMetadataResponse,
    ExtractedQuestionResponse,
    ExtractionResponse,
    OptionDetail,
)
from src.app.services.ai_agents.pipeline import extract_exam_from_text
from src.app.utils.pdf_parser import extract_text_with_image_placeholders
from src.app.utils.storage import upload_bytes_to_supabase

EXTRACTION_TTL = 60 * 30
REDIS_PREFIX = "extraction:"


class ExtractionService:
    async def extract_pdf(self, file_bytes: bytes) -> ExtractionResponse:
        raw_text, images_dict = extract_text_with_image_placeholders(file_bytes)
        if not raw_text.strip():
            raise CustomAPIException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="BAD_REQUEST",
                message="Không tìm thấy nội dung trong file PDF.",
            )

        exam_meta, raw_questions = await extract_exam_from_text(raw_text)
        if not raw_questions:
            raise CustomAPIException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="BAD_REQUEST",
                message="Không thể bóc tách câu hỏi từ tài liệu.",
            )

        subject = exam_meta.get("subject")
        if not subject:
            raise CustomAPIException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="BAD_REQUEST",
                message="Không xác định được môn học từ tài liệu.",
            )

        questions = await self._process_questions(raw_questions, images_dict, subject)

        extraction_id = str(uuid.uuid4())
        metadata = ExamMetadataResponse(
            exam_name=exam_meta.get("exam_name", ""),
            subject=subject,
            routing_group=exam_meta.get("routing_group", ""),
        )

        result = ExtractionResponse(
            extraction_id=extraction_id,
            exam_metadata=metadata,
            questions=questions,
        )

        cache_data = result.model_dump(mode="json")
        await redis_client.set(
            f"{REDIS_PREFIX}{extraction_id}",
            json.dumps(cache_data, ensure_ascii=False),
            ex=EXTRACTION_TTL,
        )

        return result

    async def get_extraction(self, extraction_id: str) -> ExtractionResponse:
        data = await redis_client.get(f"{REDIS_PREFIX}{extraction_id}")
        if not data:
            raise CustomAPIException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="EXTRACTION_EXPIRED",
                message="Dữ liệu trích xuất đã hết hạn hoặc không tồn tại.",
            )
        return ExtractionResponse.model_validate_json(data)

    async def delete_extraction(self, extraction_id: str) -> None:
        await redis_client.delete(f"{REDIS_PREFIX}{extraction_id}")

    async def _process_questions(
        self,
        raw_questions: list[dict[str, object]],
        images_dict: dict[str, dict[str, object]],
        subject: str,
    ) -> list[ExtractedQuestionResponse]:
        processed: list[ExtractedQuestionResponse] = []
        for q in raw_questions:
            try:
                is_passage = q.get("is_passage") is True

                q_img_url: str | None = None
                q_placeholder = q.get("question_image_placeholder")
                if isinstance(q_placeholder, str) and q_placeholder in images_dict:
                    img_info = images_dict[q_placeholder]
                    img_bytes = img_info["bytes"]
                    img_ext = img_info["ext"]
                    if isinstance(img_bytes, bytes) and isinstance(img_ext, str):
                        q_img_url = await upload_bytes_to_supabase(img_bytes, img_ext)

                options_data: dict[str, OptionDetail] | None = None
                if not is_passage:
                    raw_options = q.get("options")
                    if isinstance(raw_options, dict):
                        opts: dict[str, OptionDetail] = {}
                        for key in ["A", "B", "C", "D"]:
                            opt = raw_options.get(key) or raw_options.get(key.lower(), {})
                            opt_content = (
                                opt.get("content", "") if isinstance(opt, dict) else str(opt)
                            )
                            opt_placeholder = (
                                opt.get("image_placeholder") if isinstance(opt, dict) else None
                            )
                            opt_img_url: str | None = None
                            if isinstance(opt_placeholder, str) and opt_placeholder in images_dict:
                                opt_info = images_dict[opt_placeholder]
                                ob = opt_info["bytes"]
                                oe = opt_info["ext"]
                                if isinstance(ob, bytes) and isinstance(oe, str):
                                    opt_img_url = await upload_bytes_to_supabase(ob, oe)
                            opts[key] = OptionDetail(content=opt_content, image_url=opt_img_url)
                        options_data = opts

                raw_score = q.get("score_weight") or q.get("score") or 0
                score = float(str(raw_score))

                processed.append(ExtractedQuestionResponse(
                    subject=subject,
                    content=str(q.get("content", "")),
                    question_type=str(q.get("question_type", "Trắc nghiệm")),
                    options=options_data,
                    image_url=q_img_url,
                    source_label=str(q.get("source_label", "")),
                    score_weight=score,
                    is_passage=is_passage,
                    temp_id=str(q["temp_id"]) if q.get("temp_id") else None,
                    temp_parent_id=str(q["temp_parent_id"]) if q.get("temp_parent_id") else None,
                ))
            except Exception:
                continue

        return processed


extraction_service = ExtractionService()

import json
import uuid
from typing import Any

from fastapi import status

from src.app.core.exceptions import CustomAPIException
from src.app.core.redis import redis_client
from src.app.services.ai_agents.pipeline import extract_exam_from_text
from src.app.utils.pdf_parser import extract_text_with_image_placeholders
from src.app.utils.storage import upload_bytes_to_supabase

EXTRACTION_TTL = 60 * 30  # 30 phút
REDIS_PREFIX = "extraction:"


class ExtractionService:
    async def extract_pdf(self, file_bytes: bytes) -> dict[str, Any]:
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
        cache_data = {
            "exam_metadata": exam_meta,
            "questions": questions,
        }
        await redis_client.set(
            f"{REDIS_PREFIX}{extraction_id}",
            json.dumps(cache_data, ensure_ascii=False),
            ex=EXTRACTION_TTL,
        )

        return {
            "extraction_id": extraction_id,
            "exam_metadata": exam_meta,
            "questions": questions,
        }

    async def get_extraction(self, extraction_id: str) -> dict[str, Any]:
        data = await redis_client.get(f"{REDIS_PREFIX}{extraction_id}")
        if not data:
            raise CustomAPIException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="EXTRACTION_EXPIRED",
                message="Dữ liệu trích xuất đã hết hạn hoặc không tồn tại.",
            )
        return json.loads(data)

    async def delete_extraction(self, extraction_id: str) -> None:
        await redis_client.delete(f"{REDIS_PREFIX}{extraction_id}")

    async def _process_questions(
        self,
        raw_questions: list[dict[str, Any]],
        images_dict: dict[str, dict],
        subject: str,
    ) -> list[dict[str, Any]]:
        processed = []
        for q in raw_questions:
            try:
                is_passage = q.get("is_passage") is True

                q_img_url = None
                q_placeholder = q.get("question_image_placeholder")
                if q_placeholder and q_placeholder in images_dict:
                    img_info = images_dict[q_placeholder]
                    q_img_url = await upload_bytes_to_supabase(
                        img_info["bytes"], img_info["ext"]
                    )

                options_data = None
                if not is_passage:
                    raw_options = q.get("options") or {}
                    opts = {}
                    for key in ["A", "B", "C", "D"]:
                        opt = raw_options.get(key) or raw_options.get(key.lower(), {})
                        opt_content = (
                            opt.get("content", "") if isinstance(opt, dict) else str(opt)
                        )
                        opt_placeholder = (
                            opt.get("image_placeholder") if isinstance(opt, dict) else None
                        )
                        opt_img_url = None
                        if opt_placeholder and opt_placeholder in images_dict:
                            opt_img_info = images_dict[opt_placeholder]
                            opt_img_url = await upload_bytes_to_supabase(
                                opt_img_info["bytes"], opt_img_info["ext"]
                            )
                        opts[key] = {"content": opt_content, "image_url": opt_img_url}
                    options_data = opts

                processed.append({
                    "subject": subject,
                    "content": q.get("content", ""),
                    "question_type": q.get("question_type", "Trắc nghiệm"),
                    "options": options_data,
                    "image_url": q_img_url,
                    "source_label": q.get("source_label", ""),
                    "score_weight": q.get("score_weight") or q.get("score") or 0,
                    "is_passage": is_passage,
                    "temp_id": q.get("temp_id"),
                    "temp_parent_id": q.get("temp_parent_id"),
                })
            except Exception:
                continue

        return processed


extraction_service = ExtractionService()

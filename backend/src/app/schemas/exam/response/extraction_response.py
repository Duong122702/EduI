from typing import Any

from src.app.schemas.base import AppBaseModel


class ExamMetadataResponse(AppBaseModel):
    exam_name: str
    subject: str
    routing_group: str


class ExtractedQuestionResponse(AppBaseModel):
    content: str
    question_type: str
    options: dict[str, Any] | None = None
    image_url: str | None = None
    source_label: str = ""
    score_weight: float = 0
    is_passage: bool = False
    temp_id: str | None = None
    temp_parent_id: str | None = None


class ExtractionResponse(AppBaseModel):
    extraction_id: str
    exam_metadata: ExamMetadataResponse
    questions: list[ExtractedQuestionResponse]

from uuid import UUID

from backend.src.app.schemas.base import AppBaseModel


class QuestionResponse(AppBaseModel):
    id: UUID
    exam_id: UUID | None
    question_number: int
    content: str
    question_type: str
    options: dict | None
    correct_answer: str
    explanation: str | None
    score_weight: int
    topic: str | None
    level: str | None
    subject: str

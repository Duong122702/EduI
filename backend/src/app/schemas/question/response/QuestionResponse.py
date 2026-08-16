from uuid import UUID

from src.app.schemas.base import AppBaseModel


class QuestionResponse(AppBaseModel):
    id: UUID
    question_number: int
    content: str
    question_type: str
    options: dict | None
    correct_answer: str
    explanation: str | None
    score_weight: float
    topic: str | None
    level: str | None
    subject: str
    image_url: str | None

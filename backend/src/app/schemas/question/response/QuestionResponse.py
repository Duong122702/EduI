from uuid import UUID

from pydantic import BaseModel


class QuestionResponse(BaseModel):
    id: UUID
    exam_id: UUID | None
    question_number: int
    content: str
    question_type: str
    options: dict | None
    correct_answer: str
    explaination: str | None
    score_weight: int
    topic: str | None
    level: str | None

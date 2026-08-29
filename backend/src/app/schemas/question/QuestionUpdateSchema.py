from src.app.schemas.base import AppBaseModel


class QuestionUpdateSchema(AppBaseModel):
    subject: str | None = None
    content: str | None = None
    source_label: str | None = None
    score_weight: float | None = None
    level: str | None = None
    question_type: str | None = None
    correct_answer: str | None = None
    topic: str | None = None
    exlpanation: str | None = None

    option_A_content: str | None = None
    option_B_content: str | None = None
    option_C_content: str | None = None
    option_D_content: str | None = None

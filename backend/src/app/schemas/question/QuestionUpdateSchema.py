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
    explanation: str | None = None
    parent_id: str | None = None
    is_passage: bool | None = None
    option_A_content: str | None = None
    option_B_content: str | None = None
    option_C_content: str | None = None
    option_D_content: str | None = None

    def validate_conditional_fields(self) -> "QuestionUpdateSchema":
        if self.is_passage:
            self.option_A_content = None
            self.option_B_content = None
            self.option_C_content = None
            self.option_D_content = None
            self.score_weight = None
            self.level = None
            self.correct_answer = None
            self.explanation = None
        else:
            if (
                not self.option_A_content
                or not self.option_B_content
                or not self.option_C_content
                or not self.option_D_content
                or not self.correct_answer
                or self.score_weight is None
                or not self.level
                or not self.explanation
            ):
                raise ValueError(
                    "Câu hỏi trắc nghiệm bắt buộc phải có đáp án và điểm số"
                )
        return self

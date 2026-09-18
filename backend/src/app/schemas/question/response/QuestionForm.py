from dataclasses import asdict, dataclass

from fastapi import Form


@dataclass
class QuestionCreateSchema:
    subject: str = Form(..., description="Môn học")
    content: str = Form(..., description="Nội dung câu hỏi")
    source_label: str | None = Form(None, description="Số thứ tự câu hỏi")
    score_weight: float | None = Form(None, description="Hệ số điểm")
    level: str | None = Form(None, description="Độ khó")
    question_type: str = Form(..., description="Loại câu hỏi")
    correct_answer: str | None = Form(None, description="Đáp án đúng")
    topic: str | None = Form(None, description="Chủ đề/Chương")
    explanation: str | None = Form(None, description="Giải thích")
    parent_id: str | None = Form(None, description="ID của câu hỏi cha")
    is_passage: bool = Form(
        False, description="Câu hỏi có phải là câu hỏi dạng passage hay không"
    )

    option_A_content: str | None = Form(None, description="Nội dung đáp án A")
    option_B_content: str | None = Form(None, description="Nội dung đáp án B")
    option_C_content: str | None = Form(None, description="Nội dung đáp án C")
    option_D_content: str | None = Form(None, description="Nội dung đáp án D")

    def validate_conditional_fields(self) -> "QuestionCreateSchema":
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

    def to_dict(self) -> dict:
        return asdict(self)

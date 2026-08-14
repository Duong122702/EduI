from dataclasses import asdict, dataclass

from fastapi import Form


@dataclass
class QuestionCreateSchema:
    subject: str = Form(..., description="Môn học")
    content: str = Form(..., description="Nội dung câu hỏi")
    question_number: int = Form(..., description="Số thứ tự câu hỏi")
    score_weight: float = Form(..., description="Hệ số điểm")
    level: str = Form(..., description="Độ khó")
    question_type: str = Form(..., description="Loại câu hỏi")
    correct_answer: str = Form(..., description="Đáp án đúng")
    topic: str | None = Form(None, description="Chủ đề/Chương")
    explanation: str | None = Form(None, description="Giải thích")

    option_A_content: str | None = Form(None, description="Nội dung đáp án A")
    option_B_content: str | None = Form(None, description="Nội dung đáp án B")
    option_C_content: str | None = Form(None, description="Nội dung đáp án C")
    option_D_content: str | None = Form(None, description="Nội dung đáp án D")

    def to_dict(self) -> dict:
        return asdict(self)

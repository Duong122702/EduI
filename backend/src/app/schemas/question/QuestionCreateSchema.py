from pydantic import Field

from src.app.schemas.base import AppBaseModel


class QuestionCreateSchema(AppBaseModel):
    subject: str = Field(description="Thông tin môn học")
    topic: str | None = Field(None, description="Thông tin chủ đề")
    content: str = Field(description="Nội dung câu hỏi")
    question_number: int = Field(description="Số thứ tự gốc câu hỏi")
    score_weight: float = Field(description="Số điểm cho câu hỏi")
    level: str = Field(description="Độ khó câu hỏi")
    question_type: str = Field(description="Kiểu câu hỏi")
    correct_answer: str = Field(description="Đáp án đúng")

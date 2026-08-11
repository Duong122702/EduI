from backend.src.app.schemas.base import AppBaseModel
from pydantic import Field


class QuestionCreateSchema(AppBaseModel):
    subject: str = Field(description="Thông tin môn học")
    topic: str | None = Field(None, description="Thông tin chủ đề")
    content: str = Field(description="Nội dung câu hỏi")
    question_number: int = Field(description="Số thứ tự gốc câu hỏi")
    score_weight: float = Field(description="Số điểm cho câu hỏi")
    level: str = Field(description="Độ khó câu hỏi")
    question_type: str = Field(description="Kiểu câu hỏi")

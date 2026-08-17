from pydantic import Field

from src.app.schemas.base import AppBaseModel


class QuestionFilterParams(AppBaseModel):
    subject: str | None = Field(None, description="Lọc theo môn học")
    topic: str | None = Field(None, description="Lọc theo chủ đề")
    content: str | None = Field(None, description="Lọc theo nội dung câu hỏi")
    source_label: str | None = Field(None, description="Lọc theo số thứ tự câu hỏi")
    score_weight: float | None = Field(None, description="Lọc theo số điểm của câu hỏi")
    level: str | None = Field(None, description="Lọc theo mức độ khó của câu hỏi")
    question_type: str | None = Field(None, description="Lọc theo loại câu hỏi")

from pydantic import Field

from src.app.schemas.base import AppBaseModel


class CreateExamSchema(AppBaseModel):
    title: str = Field(..., description="Tiêu đề đề thi")
    description: str | None = Field(None, description="Mô tả đề thi")
    duration: int = Field(..., description="Thời lượng làm bài (tính bằng phút)")
    created_by: str = Field(..., description="ID người tạo đề thi")
    created_at: str | None = Field(None, description="Ngày tạo đề thi")
    status: str = Field(..., description="Trạng thái đề thi (active, inactive)")
    subject: str = Field(..., description="ID môn học liên quan đến đề thi")
    question_ids: list[str | None] = Field(
        ..., description="Danh sách ID câu hỏi liên quan đến đề thi"
    )

from backend.src.app.schemas.base import AppBaseModel
from pydantic import Field


class CreateExamSchema(AppBaseModel):
    title: str = Field(..., description="Tiêu đề đề thi")
    description: str | None = Field(None, description="Mô tả đề thi")
    duration: int = Field(..., description="Thời lượng làm bài (tính bằng phút)")
    created_by: int = Field(..., description="ID người tạo đề thi")
    created_at: str | None = Field(None, description="Ngày tạo đề thi")
    status: str = Field(..., description="Trạng thái đề thi (active, inactive)")
    subject_id: int = Field(..., description="ID môn học liên quan đến đề thi")

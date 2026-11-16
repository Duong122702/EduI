from pydantic import Field

from src.app.schemas.base import AppBaseModel


class CreateExamSchema(AppBaseModel):
    title: str = Field(..., description="Tiêu đề đề thi")
    description: str | None = Field(None, description="Mô tả đề thi")
    duration: int = Field(..., description="Thời lượng làm bài (tính bằng phút)")
    status: str = Field(..., description="Trạng thái đề thi (active, inactive)")
    subject: str = Field(..., description="ID môn học liên quan đến đề thi")
    question_ids: list[str | None] = Field(
        default_factory=list, description="Danh sách ID câu hỏi liên quan đến đề thi"
    )
    extraction_id: str | None = Field(
        None, description="ID trích xuất từ PDF (nếu có, sẽ lấy câu hỏi từ cache)"
    )

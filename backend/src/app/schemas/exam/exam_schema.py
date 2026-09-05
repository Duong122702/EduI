from backend.src.app.schemas.base import AppBaseModel
from pydantic import Field


class ExamSchemaFilter(AppBaseModel):
    title: str | None = Field(None, description="Lọc theo tiêu đề đề thi")
    status: str | None = Field(None, description="Lọc theo trạng thái đề thi")

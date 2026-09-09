from pydantic import Field

from src.app.schemas.base import AppBaseModel


class ExamSchemaFilter(AppBaseModel):
    title: str | None = Field(None, description="Lọc theo tiêu đề đề thi")
    status: str | None = Field(None, description="Lọc theo trạng thái đề thi")

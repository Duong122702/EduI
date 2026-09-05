import uuid

from backend.src.app.schemas.base import AppBaseModel


class DataResponse(AppBaseModel):
    id: uuid.UUID
    title: str
    description: str | None
    duration: int
    created_by: uuid.UUID
    created_at: str
    status: str
    subject: str
    room_codes: list[str | None] = []


class ExamResponse(AppBaseModel):
    data: list[DataResponse]
    total: int

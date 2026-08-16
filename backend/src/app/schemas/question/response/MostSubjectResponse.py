from backend.src.app.schemas.base import AppBaseModel


class MostSubjectResponse(AppBaseModel):
    subject: str
    count: int

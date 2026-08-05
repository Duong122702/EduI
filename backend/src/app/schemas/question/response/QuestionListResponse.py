from src.app.schemas.base import AppBaseModel
from src.app.schemas.question.response.QuestionResponse import QuestionResponse


class QuestionListResponse(AppBaseModel):
    questions: list[QuestionResponse]
    total: int

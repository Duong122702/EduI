# Import Base đầu tiên
from src.app.core.database import Base
from src.app.model.question_exams import QuestionExam
from src.app.model.questions import Questions

# Sau đó import TẤT CẢ các model của bạn vào đây
from src.app.model.user import User

__all__ = ["Base", "User", "Questions", "QuestionExam"]

from fastapi import APIRouter

from src.app.api.v1.endpoints import auth, exam_route, question_route

api_router = APIRouter()

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Xác thực (Authentication)"],
)
api_router.include_router(
    question_route.router, prefix="/questions", tags=["Câu hỏi (Questions)"]
)
api_router.include_router(
    exam_route.router, prefix="/exams", tags=["Đề kiểm tra [Exams]"]
)

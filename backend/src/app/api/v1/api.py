from backend.src.app.api.v1.endpoints import question_route
from fastapi import APIRouter

from src.app.api.v1.endpoints import auth

api_router = APIRouter()

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Xác thực (Authentication)"],
)
api_router.include_router(
    question_route.router, prefix="/questions", tags=["Câu hỏi (Questions)"]
)

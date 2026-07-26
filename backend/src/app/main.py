from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.app.api.v1.api import api_router
from src.app.core.exceptions import CustomAPIException

app = FastAPI()

# Cấu hình CORS để React có thể gọi API mà không bị chặn
origins = [
    "http://localhost:5173",  # URL mặc định của Vite
]

app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(CustomAPIException)
async def custom_exception_handle(request: Request, exc: CustomAPIException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {"code": exc.code, "message": exc.message, "details": exc.details},
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handle(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Input data is invalid",
                "details": exc.errors(),
            },
        },
    )

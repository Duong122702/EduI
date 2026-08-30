import json
import logging
from collections.abc import Callable

from fastapi import FastAPI, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute

from src.app.api.v1.api import api_router
from src.app.core.exceptions import CustomAPIException
from src.app.model import Base

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("fastapi_logger")
# In ra số lượng bảng đã được đăng ký thành công để Linter không xóa import
print(f"Loaded {len(Base.metadata.tables)} database tables.")


# 2. Định nghĩa Custom Route Handler để bắt Response
class LoggingRoute(APIRoute):
    def get_route_handler(self) -> Callable:
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request) -> Response:
            response: Response = await original_route_handler(request)

            # Ép kiểu response body sang JSON pretty print
            try:
                # Ép kiểu response.body về bytes thuần trước khi decode
                raw_body = bytes(response.body).decode("utf-8")
                body = json.loads(raw_body)
                formatted_body = json.dumps(body, indent=2, ensure_ascii=False)
            except Exception:
                try:
                    formatted_body = bytes(response.body).decode("utf-8")
                except Exception:
                    formatted_body = "[Non-text or empty body]"

            # Log ra terminal
            logger.info(
                f"\n=== [RESPONSE LOG] ==="
                f"\nURL: {request.method} {request.url.path}"
                f"\nStatus: {response.status_code}"
                f"\nBody:\n{formatted_body}\n"
                f"======================"
            )

            return response

        return custom_route_handler


app = FastAPI()

app.router.route_class = LoggingRoute
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

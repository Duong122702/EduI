from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Cấu hình CORS để React có thể gọi API mà không bị chặn
origins = [
    "http://localhost:5173",  # URL mặc định của Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Chào mừng bạn đến với FastAPI Backend!"}


@app.get("/api/data")
def get_data() -> dict[str, str | list[str]]:
    return {
        "status": "success",
        "items": ["React", "TypeScript", "Tailwind", "FastAPI"],
    }

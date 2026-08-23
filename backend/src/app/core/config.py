import os

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class Settings(BaseSettings):
    PROJECT_NAME: str = "Education Improvement API"
    API_V1_STR: str = "/api/v1"
    DOMAIN: str = os.getenv("DOMAIN", "localhost")

    # Chuỗi kết nối Database (Asyncpg cho PostgreSQL)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    DB_ECHO: bool = True

    RESEND_API_KEY: str = os.getenv("RESEND_API_KEY", "")
    FROM_EMAIL: str = os.getenv("FROM_EMAIL", "onboarding@resend.dev")

    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    REFRESH_TOKEN_SECRET_KEY: str = os.getenv("REFRESH_TOKEN_SECRET_KEY", "")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",  # Bỏ qua nếu trong file .env có các biến thừa không khai báo ở đây
    )


settings = Settings()

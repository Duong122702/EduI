import os

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",  # Bỏ qua nếu trong file .env có các biến thừa không khai báo ở đây
    )

    PROJECT_NAME: str = "Education Improvement API"
    API_V1_STR: str = "/api/v1"
    DOMAIN: str = os.getenv("DOMAIN", "localhost")

    # Chuỗi kết nối Database (Asyncpg cho PostgreSQL)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    # Đọc từ file .env nếu có, ưu tiên biến môi trường hệ thống
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

    DB_ECHO: bool = True

    RESEND_API_KEY: str = os.getenv("RESEND_API_KEY", "")
    FROM_EMAIL: str = os.getenv("FROM_EMAIL", "onboarding@resend.dev")

    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30


settings = Settings()

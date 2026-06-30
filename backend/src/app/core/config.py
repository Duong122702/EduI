import os

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",  # Bỏ qua nếu trong file .env có các biến thừa không khai báo ở đây
    )

    PROJECT_NAME: str = "Education Improvement API"
    API_V1_STR: str = "/api/v1"

    # Chuỗi kết nối Database (Asyncpg cho PostgreSQL)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    # Đọc từ file .env nếu có, ưu tiên biến môi trường hệ thống
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

    DB_ECHO: bool = True


settings = Settings()

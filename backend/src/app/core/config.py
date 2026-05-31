import os

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()  # Tải biến môi trường từ file .env

class Settings(BaseSettings):
    PROJECT_NAME: str = "Education Improvement API"
    API_V1_STR: str = "/api/v1"

    # Chuỗi kết nối Database (Asyncpg cho PostgreSQL)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    # Đọc từ file .env nếu có, ưu tiên biến môi trường hệ thống
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

    DB_ECHO: bool = True


settings = Settings()

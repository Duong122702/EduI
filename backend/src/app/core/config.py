from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Education Improvement API"
    API_V1_STR: str = "/api/v1"

    # Chuỗi kết nối Database (Asyncpg cho PostgreSQL)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/app_db"

    # Đọc từ file .env nếu có, ưu tiên biến môi trường hệ thống
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


settings = Settings()

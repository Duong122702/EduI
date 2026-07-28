from src.app.schemas.base import AppBaseModel


class UpdateUser(AppBaseModel):
    email: str | None
    full_name: str | None
    hashed_password: str | None
    role: str | None

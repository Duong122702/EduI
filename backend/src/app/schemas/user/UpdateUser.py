from pydantic import EmailStr

from src.app.schemas.base import AppBaseModel


class UpdateUser(AppBaseModel):
    email: EmailStr | None
    full_name: str | None
    hashed_password: str | None
    role: str | None

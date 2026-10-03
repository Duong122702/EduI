from pydantic import EmailStr

from src.app.schemas.base import AppBaseModel


class CreateUser(AppBaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str

from pydantic import EmailStr

from src.app.schemas.base import AppBaseModel


class UserLogin(AppBaseModel):
    email: EmailStr
    password: str
    isKeepLogin: bool | None = False

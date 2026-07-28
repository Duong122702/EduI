from src.app.schemas.base import AppBaseModel


class UserLogin(AppBaseModel):
    email: str
    password: str
    isKeepLogin: bool | None = False

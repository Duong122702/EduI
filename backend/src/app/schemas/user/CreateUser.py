from src.app.schemas.base import AppBaseModel


class CreateUser(AppBaseModel):
    full_name: str
    email: str
    password: str
    role: str

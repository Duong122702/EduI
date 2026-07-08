from pydantic import BaseModel


class UserCreateResponse(BaseModel):
    email: str
    is_active: bool

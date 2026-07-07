from pydantic import BaseModel


class UserResponse(BaseModel):
    email: str
    is_active: bool

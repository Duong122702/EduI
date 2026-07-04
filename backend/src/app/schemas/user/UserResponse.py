from pydantic import BaseModel


class UserResponse(BaseModel):
    active_token: str

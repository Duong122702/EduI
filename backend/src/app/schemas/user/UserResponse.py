from pydantic import BaseModel
from sqlalchemy import UUID


class UserResponse(BaseModel):
    user_id: UUID
    email: str
    is_active: bool

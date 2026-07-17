from uuid import UUID

from pydantic import BaseModel


class GetUserResponse(BaseModel):
    id: UUID
    full_name: str
    email: str
    role: str
    is_verified: bool

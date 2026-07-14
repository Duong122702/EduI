from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class UserSessionCreate(BaseModel):
    user_id: UUID
    refresh_token: str
    ip_address: str | None = None
    user_agent: str | None = None
    is_revoked: bool = False
    expires_at: datetime

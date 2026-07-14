from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class UserSessionCreate(BaseModel):
    user_id: UUID
    refresh_token: str
    ip_address: str
    user_agent: str
    is_revoked: bool
    expires_at: datetime

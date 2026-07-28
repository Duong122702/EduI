from datetime import datetime
from uuid import UUID

from src.app.schemas.base import AppBaseModel


class UserSessionCreate(AppBaseModel):
    user_id: UUID
    refresh_token: str | None = None
    ip_address: str | None = None
    user_agent: str | None = None
    is_revoked: bool = False
    expires_at: datetime

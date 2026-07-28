from datetime import datetime

from src.app.schemas.base import AppBaseModel


class RefreshSchema(AppBaseModel):
    access_token: str
    refresh_token: str
    expires_at: datetime

from pydantic import BaseModel


class UpdateUser(BaseModel):
    email: str | None
    full_name: str | None
    hashed_password: str | None
    role: str | None

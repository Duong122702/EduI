from pydantic import BaseModel


class CreateUser(BaseModel):
    fullname: str
    email: str
    password: str

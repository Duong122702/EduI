from typing import Any, Generic, TypeVar

from pydantic import BaseModel

DataType = TypeVar("DataType")


class APIResponse(BaseModel, Generic[DataType]):
    success: bool = True
    message: str | None = "Success"
    data: DataType | None = None


class APIErrorDetail(BaseModel):
    code: str
    message: str
    details: Any | None = None


class APIErrorReponse(BaseModel):
    success: bool = False
    error: APIErrorDetail

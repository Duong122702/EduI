from enum import StrEnum


class UserMessages(StrEnum):
    NOT_FOUND = "Do not find this user"
    ALREADY_EXISTS = "A user with this email already exists"
    LOGIN_SUCCESS = "Login successfully"

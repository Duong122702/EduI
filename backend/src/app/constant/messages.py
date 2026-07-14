from enum import StrEnum


class UserMessages(StrEnum):
    NOT_FOUND = "Do not find this user"
    ALREADY_EXISTS = "A user with this email already exists"
    LOGIN_SUCCESS = "Login successfully"
    INVALID_TOKEN = "Invalid token or token has expired"
    USER_NOT_FOUND = "User not found"
    USER_NOT_VERIFIED = "User not verified"
    INVALID_CREDENTIALS = "Invalid credentials"


class UserSessionMessages(StrEnum):
    USER_SESSION_NOT_FOUND = "User session not found"

from enum import StrEnum


class QuestionMessages(StrEnum):
    NOT_FOUND = "Do not find this question"
    ALREADY_EXISTS = "A question with this content already exists"
    CREATE_SUCCESS = "Create question successfully"
    UPDATE_SUCCESS = "Update question successfully"
    DELETE_SUCCESS = "Delete question successfully"
    INVALID_TOKEN = "Invalid token or token has expired"
    QUESTION_NOT_FOUND = "Question not found"
    INVALID_QUESTION_ID = "Question_id is invalid"


class UserMessages(StrEnum):
    NOT_FOUND = "Do not find this user"
    ALREADY_EXISTS = "A user with this email already exists"
    LOGIN_SUCCESS = "Login successfully"
    INVALID_TOKEN = "Invalid token or token has expired"
    USER_NOT_FOUND = "User not found"
    USER_NOT_VERIFIED = "User not verified"
    INVALID_CREDENTIALS = "Invalid credentials"
    INVALID_USER_ID = "User_id is invalid"


class UserSessionMessages(StrEnum):
    USER_SESSION_NOT_FOUND = "User session not found"

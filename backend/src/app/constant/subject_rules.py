import enum


class QuestionType(enum.StrEnum):
    MULTIPLE_CHOICE = "Trắc nghiệm"
    TRUE_FALSE = "Đúng/Sai"
    SHORT_ANSWER = "Câu hỏi ngắn"


class Subject(enum.StrEnum):
    MATH = "Toán học"
    PHYSICAL = "Vật lý"
    HISTORY = "Lịch sử"
    GEOGRAPHY = "Địa lý"
    CHEMISTRY = "Hóa học"
    BIOLOGY = "Sinh học"
    ENGLISH = "Tiếng anh"


SUBJECT_RULES = {
    Subject.MATH: {
        QuestionType.MULTIPLE_CHOICE: 12,
        QuestionType.TRUE_FALSE: 4,
        QuestionType.SHORT_ANSWER: 6,
    },
    Subject.PHYSICAL: {
        QuestionType.MULTIPLE_CHOICE: 18,
        QuestionType.TRUE_FALSE: 4,
        QuestionType.SHORT_ANSWER: 6,
    },
    Subject.HISTORY: {
        QuestionType.MULTIPLE_CHOICE: 24,
        QuestionType.TRUE_FALSE: 4,
    },
    Subject.GEOGRAPHY: {
        QuestionType.MULTIPLE_CHOICE: 18,
        QuestionType.TRUE_FALSE: 4,
        QuestionType.SHORT_ANSWER: 6,
    },
    Subject.CHEMISTRY: {
        QuestionType.MULTIPLE_CHOICE: 18,
        QuestionType.TRUE_FALSE: 4,
        QuestionType.SHORT_ANSWER: 6,
    },
    Subject.BIOLOGY: {
        QuestionType.MULTIPLE_CHOICE: 18,
        QuestionType.TRUE_FALSE: 4,
        QuestionType.SHORT_ANSWER: 6,
    },
    Subject.ENGLISH: {
        QuestionType.MULTIPLE_CHOICE: 40,
    },
}

import random

from backend.src.app.constant.subject_rules import SUBJECT_RULES, QuestionType, Subject


def get_index_pool_for_subject(subject: str) -> dict[QuestionType, list[int]]:
    if isinstance(subject, str):
        try:
            subject_key = Subject[
                subject
            ]  # Hoặc Subject(data.subject) tùy cách bạn định nghĩa Enum
        except KeyError:
            subject_key = None
    else:
        subject_key = subject
    rules = SUBJECT_RULES.get(subject_key, {}) if subject_key else {}
    pools = {}
    current_index = 1

    for q_type, max_count in rules.items():
        # Tạo danh sách các index thuộc vùng của loại câu hỏi này
        indices = list(range(current_index, current_index + max_count))
        # Trộn ngẫu nhiên sẵn các index này
        random.shuffle(indices)

        pools[q_type] = indices
        current_index += max_count

    return pools

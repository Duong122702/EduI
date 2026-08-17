import re
from typing import Any, cast

import fitz  # PyMuPDF


def parse_pdf_to_questions(file_bytes: bytes) -> list[dict[str, Any]]:
    """
    Phân tích file PDF, bóc tách text và ảnh.
    Giả định format:
    Câu 1: Nội dung câu hỏi...
    [Ảnh nếu có]
    A. Đáp án A
    [Ảnh đáp án A nếu có]
    """
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    questions: list[dict[str, Any]] = []

    current_q: dict[str, Any] | None = None
    # current_context theo dõi ảnh/text đang thuộc về 'question' hay đáp án 'A', 'B', 'C', 'D'
    current_context = "none"

    for page_num in range(len(doc)):
        page = doc[page_num]

        # 1. Ép kiểu rõ ràng thành Dict để Pylance không báo lỗi
        page_data = cast(dict[str, Any], page.get_text("dict"))
        blocks = cast(list[dict[str, Any]], page_data.get("blocks", []))

        for b in blocks:
            b_type = b.get("type")

            if b_type == 0:  # TEXT BLOCK
                text = ""
                # 2. Ép kiểu các mảng con
                lines = cast(list[dict[str, Any]], b.get("lines", []))
                for line in lines:
                    spans = cast(list[dict[str, Any]], line.get("spans", []))
                    for span in spans:
                        text += str(span.get("text", "")) + " "

                text = text.strip()
                if not text:
                    continue

                # Nhận diện bắt đầu câu hỏi mới (VD: Câu 1:)
                if re.match(r"^Câu\s+\d+[:\.]", text, re.IGNORECASE):
                    if current_q:
                        questions.append(current_q)
                    current_q = {
                        "content": text,
                        "question_image": None,
                        "options": {
                            "A": {"content": "", "image": None},
                            "B": {"content": "", "image": None},
                            "C": {"content": "", "image": None},
                            "D": {"content": "", "image": None},
                        },
                        "correct_answer": "A",
                        "explanation": "",
                    }
                    current_context = "question"

                # Nhận diện các đáp án (A., B., C., D.)
                elif re.match(r"^[A-D][\.\:]", text) and current_q:
                    option_key = text[0].upper()  # Lấy A, B, C, D
                    current_q["options"][option_key]["content"] += text[2:].strip()
                    current_context = option_key

                # Chữ bình thường (cộng dồn vào phần đang xét)
                elif current_q and current_context == "question":
                    current_q["content"] += "\n" + text
                elif current_q and current_context in ["A", "B", "C", "D"]:
                    current_q["options"][current_context]["content"] += "\n" + text

            elif b_type == 1:  # IMAGE BLOCK
                if current_q:
                    image_bytes = b.get("image")
                    ext = b.get("ext")  # png, jpeg...

                    if image_bytes:
                        img_data = {"bytes": image_bytes, "ext": ext}

                        if (
                            current_context == "question"
                            and not current_q["question_image"]
                        ):
                            current_q["question_image"] = img_data
                        elif (
                            current_context in ["A", "B", "C", "D"]
                            and not current_q["options"][current_context]["image"]
                        ):
                            current_q["options"][current_context]["image"] = img_data

    # Đẩy câu cuối cùng vào danh sách
    if current_q:
        questions.append(current_q)

    doc.close()
    return questions

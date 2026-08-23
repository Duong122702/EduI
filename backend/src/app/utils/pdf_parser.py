import json
import logging
import re
from typing import Any, cast

import fitz  # PyMuPDF
from backend.src.app.core.config import settings
from google.generativeai.client import configure

# Sửa lỗi import bằng cách trỏ trực tiếp vào các sub-module
from google.generativeai.generative_models import GenerativeModel

# Cấu hình Gemini AI
configure(api_key=settings.GEMINI_API_KEY)
logger = logging.getLogger("fastapi_logger")


def extract_text_with_image_placeholders(
    file_bytes: bytes,
) -> tuple[str, dict[str, dict]]:
    """
    Quét PDF, lấy text và thay thế ảnh bằng các placeholder [IMAGE_x].
    """
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    full_text = ""
    images_dict = {}
    img_counter = 0

    for page_num in range(len(doc)):
        page = doc[page_num]

        # 1. Ép kiểu rõ ràng thành dictionary để fix lỗi Pylance phàn nàn 'get'
        page_data = cast(dict[str, Any], page.get_text("dict"))
        blocks = cast(list[dict[str, Any]], page_data.get("blocks", []))

        for b in blocks:
            b_type = b.get("type")
            if b_type == 0:  # TEXT BLOCK
                # 2. Tiếp tục ép kiểu cho lines
                lines = cast(list[dict[str, Any]], b.get("lines", []))
                for line in lines:
                    spans = cast(list[dict[str, Any]], line.get("spans", []))
                    for span in spans:
                        full_text += str(span.get("text", "")) + " "
                full_text += "\n"
            elif b_type == 1:  # IMAGE BLOCK
                image_bytes = b.get("image")
                ext = b.get("ext", "png")
                if image_bytes:
                    img_id = f"[IMAGE_{img_counter}]"
                    full_text += f"\n{img_id}\n"
                    images_dict[img_id] = {"bytes": image_bytes, "ext": ext}
                    img_counter += 1

    doc.close()
    return full_text, images_dict


def parse_pdf_to_questions(file_bytes: bytes) -> list[dict[str, Any]]:
    """
    Dùng AI Agent để bóc tách text thành mảng JSON chuẩn.
    """
    raw_text, images_dict = extract_text_with_image_placeholders(file_bytes)

    if not raw_text.strip():
        return []

    prompt = f"""
    Bạn là một hệ thống AI chuyên gia bóc tách dữ liệu đề thi. 
    Dưới đây là văn bản được trích xuất từ một file PDF đề thi. Hình ảnh đã được thay bằng thẻ [IMAGE_x].

    NHIỆM VỤ VÀ QUY TẮC BÓC TÁCH BẮT BUỘC (ĐỌC KỸ):

    1. TÊN ĐỀ & NGUỒN (source_label):
       - Tìm tên của đề thi ở ngay phần đầu văn bản (Ví dụ: "Đề thi thử Sở Nghệ An lần 2"). Hãy tóm tắt tên này ngắn gọn.
       - Với mỗi câu hỏi, xác định số thứ tự (VD: "Câu 1").
       - Ghép tên đề và số thứ tự để tạo `source_label`. Ví dụ: "Sở Nghệ An lần 2 - Câu 1".

    2. DẠNG CÂU HỎI (question_type):
       - Theo dõi các tiêu đề phần thi:
         + Nằm trong "Phần I" (hoặc trắc nghiệm 4 đáp án): `question_type` = "Trắc nghiệm".
         + Nằm trong "Phần II" (hoặc Đúng/Sai): `question_type` = "Đúng/Sai".
         + Nằm trong "Phần III" (hoặc Tự luận/Trả lời ngắn): `question_type` = "Tự luận".

    3. ĐOẠN THÔNG TIN CHUNG (Shared Context) - RẤT QUAN TRỌNG:
       - Nhận diện các câu lệnh: "Cho đoạn thông tin sau và trả lời các câu hỏi từ 1 đến 3: [Nội dung chung]".
       - Bạn BẮT BUỘC phải lấy [Nội dung chung] này ghép vào phần ĐẦU `content` của TẤT CẢ các câu hỏi liên quan.
       - VD content Câu 1 sẽ là: "[Nội dung chung] \n\n Câu 1: [Nội dung riêng của câu 1]".

    4. MỨC ĐỘ KHÓ (level):
       - Phân tích nội dung từng câu và phân loại vào 1 trong 4 mức: "Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao".

    5. TÍNH ĐIỂM (score_weight):
       - Nếu `question_type` = "Trắc nghiệm" -> `score_weight` = 0.25
       - Nếu `question_type` = "Đúng/Sai" -> `score_weight` = 1.0
       - Nếu `question_type` = "Tự luận" -> Tự suy luận môn học: Nếu là môn Toán (nhiều công thức/số học) thì gán `score_weight` = 0.5. Môn khác thì `score_weight` = 0.25.

    6. XỬ LÝ ẢNH & ĐÁP ÁN:
       - Trích xuất các đáp án A, B, C, D (nếu có).
       - Đặt đúng thẻ [IMAGE_x] vào câu hỏi/đáp án.

    BẮT BUỘC trả về ĐÚNG định dạng JSON mảng (Array of Objects) sau, KHÔNG output markdown râu ria:
    [
      {{
        "source_label": "Sở Nghệ An lần 2 - Câu 1",
        "question_type": "Trắc nghiệm",
        "level": "Nhận biết",
        "score_weight": 0.25,
        "content": "Nội dung câu hỏi 1 (đã ghép thông tin chung nếu có)",
        "question_image_placeholder": "[IMAGE_0]", 
        "options": {{
          "A": {{"content": "Nội dung A", "image_placeholder": null}},
          "B": {{"content": "Nội dung B", "image_placeholder": "[IMAGE_1]"}}
        }},
        "correct_answer": "A",
        "explanation": ""
      }}
    ]

    VĂN BẢN ĐỀ THI BẮT ĐẦU:
    {raw_text}
    """

    try:
        model = GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        # Tiền xử lý chuỗi trả về
        clean_json_str = str(response.text).strip()

        # Dùng Regex để tách đúng mảng JSON (loại bỏ text lọt ra ngoài nếu AI nói nhảm)
        json_match = re.search(r"\[.*\]", clean_json_str, re.DOTALL)
        if json_match:
            clean_json_str = json_match.group(0)

        ai_parsed_data = json.loads(clean_json_str)
    except Exception as e:
        logger.error(f"Lỗi khi AI parse đề thi: {e}")
        return []

    final_questions = []
    for q in ai_parsed_data:
        # Xử lý ảnh câu hỏi
        q_img_id = q.get("question_image_placeholder")
        question_image = images_dict.get(q_img_id) if q_img_id else None

        # Xử lý ảnh đáp án
        options_data = q.get("options", {})
        formatted_options = {}
        for key in ["A", "B", "C", "D"]:
            if key in options_data:
                opt_img_id = options_data[key].get("image_placeholder")
                formatted_options[key] = {
                    "content": options_data[key].get("content", ""),
                    "image": images_dict.get(opt_img_id) if opt_img_id else None,
                }

        final_questions.append(
            {
                "content": q.get("content", ""),
                "question_image": question_image,
                "options": formatted_options,
                "correct_answer": q.get("correct_answer", "A"),
                "explanation": q.get("explanation", ""),
                "source_label": q.get("source_label", ""),
                "level": q.get("level", "Nhận biết"),
                "question_type": q.get("question_type", "Trắc nghiệm"),
                "score_weight": q.get("score_weight", 0.25),
            }
        )

    return final_questions

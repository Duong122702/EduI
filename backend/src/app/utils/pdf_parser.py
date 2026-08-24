from typing import Any, cast

import fitz  # PyMuPDF


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

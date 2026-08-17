import asyncio
import uuid
from urllib.parse import urlparse

from fastapi import HTTPException, UploadFile, status

# Giả sử bạn đã khởi tạo supabase client ở src/app/core/supabase.py
from src.app.core.supabase import supabase


async def upload_file_to_supabase(
    file: UploadFile | None,
    bucket_name: str = "question_images",
    folder: str | None = None,
    max_size_mb: int = 5,
) -> str | None:
    """
    Helper upload file nhị phân lên Supabase Storage và trả về Public URL.
    - Tự động bỏ qua nếu file là None.
    - Kiểm tra định dạng (chỉ cho phép file ảnh).
    - Kiểm tra kích thước file tối đa.
    """
    if not file:
        return None

    # 1. Validate loại file (Content-Type)
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Định dạng file không hợp lệ. Chỉ hỗ trợ JPEG, PNG, WEBP, GIF.",
        )

    # 2. Đọc dữ liệu file
    file_bytes = await file.read()

    # 3. Validate dung lượng file
    if len(file_bytes) > max_size_mb * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Dung lượng file vượt quá giới hạn cho phép ({max_size_mb}MB).",
        )

    try:
        # Tạo tên file ngẫu nhiên để tránh đè dữ liệu cũ
        raw_filename = file.filename or "image.jpg"
        file_ext = raw_filename.split(".")[-1] if "." in raw_filename else "jpg"
        filename = f"{uuid.uuid4()}.{file_ext}"

        # 5. Phân thư mục & làm sạch dấu '/' thừa
        clean_folder = folder.strip("/") if folder else ""
        storage_path = f"{clean_folder}/{filename}" if clean_folder else filename

        # Push file lên Supabase Storage
        await asyncio.to_thread(
            supabase.storage.from_(bucket_name).upload,
            path=storage_path,
            file=file_bytes,
            file_options={"content-type": file.content_type},
        )

        # Lấy Public URL của file
        return supabase.storage.from_(bucket_name).get_public_url(storage_path)

    except HTTPException:
        # Giữ nguyên các exception Validation (400 Bad Request)
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi upload file lên Supabase Storage: {str(e)}",
        ) from None


# Thêm vào src/app/utils/storage.py[cite: 2]
async def upload_bytes_to_supabase(
    file_bytes: bytes,
    file_ext: str,
    bucket_name: str = "question_images",
    folder: str | None = None,
) -> str | None:
    if not file_bytes:
        return None
    try:
        filename = f"{uuid.uuid4()}.{file_ext}"
        clean_folder = folder.strip("/") if folder else ""
        storage_path = f"{clean_folder}/{filename}" if clean_folder else filename

        content_type = f"image/{file_ext}" if file_ext != "jpg" else "image/jpeg"

        await asyncio.to_thread(
            supabase.storage.from_(bucket_name).upload,
            path=storage_path,
            file=file_bytes,
            file_options={"content-type": content_type},
        )
        return supabase.storage.from_(bucket_name).get_public_url(storage_path)
    except Exception as e:
        print(f"Lỗi upload byte lên Supabase: {e}")
        return None


async def delete_file_from_supabase(
    file_url: str, bucket_name: str = "question_images"
) -> bool:
    """
    Helper xóa file khỏi Supabase Storage dựa trên Public URL
    """
    if not file_url:
        return False

    try:
        # 1. Loại bỏ Query Parameters (?token=..., ?v=...)
        parsed_url = urlparse(file_url)
        clean_path = parsed_url.path

        # 2. Kiểm tra xem URL có chứa đúng bucket_name không
        delimiter = f"/{bucket_name}/"
        if delimiter not in clean_path:
            return False

        # 3. Trích xuất path tương đối chính xác (ví dụ: "questions/uuid.jpg")
        path_in_bucket = clean_path.split(delimiter)[-1]

        # 4. Xóa file bất đồng bộ qua threadpool
        await asyncio.to_thread(
            supabase.storage.from_(bucket_name).remove, [path_in_bucket]
        )
        return True
    except Exception:
        # Log lỗi nếu cần, không nên văng crash nếu chỉ xóa file cũ thất bại
        return False

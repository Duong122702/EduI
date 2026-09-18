# EXAMEDU - AI CODING RULES

## CONTEXT & PERSONA

- Bạn là một Senior Fullstack Engineer (FastAPI & React/TypeScript).
- Đây là dự án "ExamEdu" - Hệ thống quản lý kỳ thi, ngân hàng câu hỏi và chấm thi tự động ứng dụng AI.
- Ưu tiên hàng đầu: Hiệu năng cao (sử dụng Async toàn diện), strict-type (kiểu dữ liệu chặt chẽ cả Frontend lẫn Backend), và tuân thủ tuyệt đối kiến trúc phân tầng đã có sẵn.
- Tuyệt đối không hardcode API keys, secrets, hoặc URL môi trường vào code. Bắt buộc phải gọi qua os.getenv() hoặc pydantic-settings (Backend) và import.meta.env (Frontend Vite).

---

## TECH STACK & ANTI-PATTERNS

### Backend (Python)

- **Cho phép:** FastAPI, SQLAlchemy (AsyncSession), Pydantic v2, asyncpg, google-genai.
- **TUYỆT ĐỐI KHÔNG:** Không dùng thư viện synchronous cho database (cấm `Session`, chỉ dùng `AsyncSession`). Không dùng raw SQL, bắt buộc dùng ORM của SQLAlchemy (Select, Insert, Update, Delete).
- **TUYỆT ĐỐI KHÔNG:** Không được in log bằng `print()`.

### Frontend (React)

- **Cho phép:** React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI, React Query, Zustand, React Hook Form, Yup.
- **TUYỆT ĐỐI KHÔNG:** Không dùng Class Component. Không dùng Redux (đã có Zustand). Không dùng Axios trực tiếp trong component (phải dùng qua React Query và `axiosClient`). Bắt buộc dùng `lucide-react` hoặc `@hugeicons` cho icon, không dùng thư viện icon khác.

---

## CODING STANDARDS & ARCHITECTURE

### Quy chuẩn Backend (Thư mục `src/app/`)

Mọi luồng dữ liệu phải tuân thủ nghiêm ngặt quy trình 4 lớp:

1. **Endpoint/Router (`api/v1/endpoints`):** Chỉ nhận Request, parse data, gọi Service, trả về `APIResponse`. Tuyệt đối không viết logic query DB ở đây. Bắt buộc dùng `Depends(get_db)` và `Depends(get_current_token)`.
2. **Service (`services/`):** Xử lý business logic (nghiệp vụ, map dữ liệu, gọi API bên thứ 3 như AI, Supabase).
3. **CRUD (`crud/`):** Nơi duy nhất tương tác với Database. Trả về Model object hoặc dữ liệu thô.
4. **Schemas (`schemas/`):** Mọi Request/Response phải được định nghĩa bằng Pydantic model kế thừa từ `AppBaseModel`.

### Quy chuẩn Frontend (Thư mục `src/`)

- Bắt buộc gom nhóm code theo tính năng (Feature-based) trong thư mục `features/`.
- Mọi API call phải được khai báo trong `api/` và được bọc bởi custom hook của React Query trong thư mục `hooks/`.
- Quản lý form bắt buộc dùng `useForm` kết hợp `yupResolver` (Yup schema đặt trong thư mục `schemas/`).
- Quy tắc đặt tên file: Component dùng `PascalCase.tsx`, Hook dùng `camelCase.ts`, Schema dùng `camelCase.schema.ts`.
- Đối với React Components và Hooks, thống nhất CHỈ SỬ DỤNG named export.

---

## ERROR HANDLING & LOGGING

### Backend

- Chỉ sử dụng `logger` từ `fastapi_logger` (`from src.app.core.exceptions import logger`) để log.
- Nếu có lỗi logic/nghiệp vụ, bắt buộc raise `CustomAPIException` kèm theo `status_code`, `code`, và `message` chuẩn từ `src.app.constant.codes` và `messages`.
- Mọi API Endpoint đều phải có `response_model=APIResponse[...]`.

### Frontend

- Xử lý lỗi API thông qua interface `CustomApiError` từ `types/exception.type.ts`.
- Nếu API trả về lỗi form (Validation), BẮT BUỘC dùng hàm `handleServerFormErrors` từ `utils/handleServerFormErrors.ts` để map lỗi vào React Hook Form.

---

## AGENTIC WORKFLOW (Quy tắc cho Cline)

1. **Khảo sát trước khi Code:** BẮT BUỘC dùng công cụ đọc file để quét cấu trúc thư mục (đặc biệt là các thư mục `schemas/`, `models/`, và `crud/`) trước khi tạo file mới để tránh viết trùng lặp.
2. **Kế thừa UI:** Trước khi tạo một UI component mới (như Button, Input, Select, Dialog), phải kiểm tra xem trong `components/ui/` đã có chưa. Nếu có, bắt buộc phải import và sử dụng lại.
3. **Cập nhật đồng bộ:** Nếu bạn thêm 1 cột mới vào DB Model (Backend), bạn phải tự động cập nhật Pydantic Schema, CRUD query tương ứng, và Interface Type ở Frontend.
4. **Không tự ý xóa file:** Chỉ được thêm mới hoặc chỉnh sửa. Nếu thấy code thừa, hãy comment lại và xin phép tôi trước khi xóa.

### ĐỒNG NHẤT CONSTANTS & ENUMS (Backend)

- TUYỆT ĐỐI KHÔNG dùng "Magic Strings" cho các mã lỗi (Error codes), thông báo (Messages), hoặc role người dùng.
- Mọi mã lỗi trả về trong `CustomAPIException` bắt buộc phải được khai báo và gọi từ file `src/app/constant/codes.py` và `messages.py`. Nếu thiếu, hãy tự động thêm mới vào file constant đó.

### STRICT TYPING (Frontend)

- TUYỆT ĐỐI KHÔNG SỬ DỤNG kiểu dữ liệu `any`. Phải định nghĩa Interface hoặc Type rõ ràng cho mọi props, API response và payload.
- Bắt buộc phải define Type cho error response thay vì dùng `any` trong các khối `try...catch` hay hàm bắt lỗi của React Hook Form.
- Bắt buộc kiểm tra strict-null (ví dụ: `if (!data) return null;`) trước khi truy xuất dữ liệu.

### QUY TẮC HIỆU NĂNG ASYNC (Backend)

- FastAPI đang chạy ở chế độ Async. Nếu bắt buộc phải sử dụng một thư viện I/O bound chặn luồng (ví dụ: thư viện AI SDK, file processing, requests, image manipulation), BẮT BUỘC phải bọc lời gọi hàm đó trong `await asyncio.to_thread()`.
- Cấm tuyệt đối việc sử dụng `time.sleep()`, phải dùng `await asyncio.sleep()`.

### REACT QUERY STANDARD (Frontend)

- Không hardcode mảng Query Key (VD: `['questions']`) rải rác trong các file hook.
- Khuyến khích tạo một file/object `QueryKeys` chuẩn hóa (ví dụ: `export const QUERY_KEYS = { questions: (params) => ['questions', params] }`) để đồng bộ việc fetch và invalidate data.
- Luôn ưu tiên dùng `keepPreviousData` (hoặc `placeholderData`) khi làm tính năng Pagination/Filter để UX mượt mà.

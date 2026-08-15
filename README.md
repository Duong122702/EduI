# 🎓 EduExam (EduI) - Next-Gen Examination & AI-Powered Assessment Platform

<p align="center">
  <img src="./frontend/src/assets/hero.png" alt="EduExam Banner" width="800"/>
</p>

<p align="center">
  <strong>Nền tảng khảo thí trực tuyến thông minh & quản lý học tập chuyên sâu, tích hợp bộ giải mã công thức Toán/Khoa học (LaTeX/KaTeX), hệ thống giám sát chống gian lận (AI Proctoring) và Trợ lý AI gia sư giải đáp thích ứng.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Project_Status-Onboarding_%2F_Active_Development-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Frontend-React_18_%7C_TypeScript_%7C_Vite-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Backend-FastAPI_%7C_Python_3.11+-009688?style=flat-square&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL_%7C_Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Math_Engine-KaTeX-3178C6?style=flat-square&logo=latex&logoColor=white" />
  <img src="https://img.shields.io/badge/Architecture-Clean_%2F_Layered-7C3AED?style=flat-square" />
</p>

---

> 📌 **Ghi chú về dự án (Project Status):**  
> Dự án đang trong giai đoạn **Onboarding & Active Development**. Phần Core Backend, Authentication, Session Security và Phân hệ Quản lý Ngân hàng câu hỏi KaTeX đã hoàn thiện ổn định. Các phân hệ Phòng thi trực tuyến, Chống gian lận thời gian thực và Trợ lý AI đang được tích cực xây dựng theo các bản thiết kế chuẩn hóa.

---

## 📊 1. Bảng Trạng thái Tính năng (Feature Status Matrix)

| Phân hệ / Tính năng | Mô tả chức năng | Trạng thái | Nền tảng kỹ thuật |
| :--- | :--- | :---: | :--- |
| **Authentication & RBAC** | Đăng ký, Đăng nhập phân quyền (`Student` / `Teacher`), mã hóa Bcrypt | `✅ Đã hoàn thiện` | FastAPI, OAuth2, JWT |
| **Session Management** | Lưu vết phiên đăng nhập, thu hồi Token và Silent Refresh tự động | `✅ Đã hoàn thiện` | `user_sessions`, Axios Interceptor |
| **Question Bank CRUD** | Quản lý, thêm, sửa, xóa câu hỏi, phân loại môn học & cấp độ | `✅ Đã hoàn thiện` | Pydantic, SQLAlchemy, React Hook Form |
| **LaTeX / KaTeX Engine** | Bộ soạn thảo và render công thức Toán học thời gian thực (`MathInput`, `MathViewerKaTeX`) | `✅ Đã hoàn thiện` | KaTeX Engine, Zod Validation |
| **Standard Response & Errors**| Chuẩn hóa API Response Envelope, Global Exception & Form Error Mapping | `✅ Đã hoàn thiện` | Custom Middleware, Error Handler |
| **Exam & Room Management** | Soạn đề thi, cấu hình phòng thi (Mã phòng, Mật khẩu, Thời lượng, Quy chế) | `🚧 Đang phát triển` | Prototype Ready, Backend Schema defined |
| **Secure Exam Room** | Giao diện làm bài thi trực tuyến, Đồng hồ đếm ngược, Auto-save tiến độ câu | `🚧 Đang phát triển` | UI Ready, API Integration in progress |
| **Anti-Cheat Engine** | Bắt sự kiện rời Tab (`visibilitychange`), cảnh báo vi phạm, bắt buộc Fullscreen | `🚧 Đang phát triển` | Event Listener Engine, Logging |
| **AI Question Generator** | Nhập chủ đề/tài liệu để AI tự động sinh câu hỏi trắc nghiệm & giải thích | `⏳ Kế hoạch (Q3/26)` | Gemini API / LLM SDK |
| **AI Adaptive Practice** | Chế độ học sinh tự tạo đề luyện tập ngẫu nhiên theo môn và sửa sai tức thì | `⏳ Kế hoạch (Q3/26)` | Algorithm Shuffling, State Engine |
| **AI Tutor Chat Drawer** | Trợ lý gia sư AI chat tương tác giải thích lỗi sai bên cạnh từng câu hỏi | `⏳ Kế hoạch (Q3/26)` | Chatbot Contextual Prompting |
| **Analytics & Gauss Curve** | Phổ điểm phân phối Gauss, Biểu đồ Radar kỹ năng, chẩn đoán vùng kiến thức yếu | `⏳ Kế hoạch (Q4/26)` | Chart.js, Statistical Aggregations |
| **Live Monitoring Sync** | Bảng theo dõi thí sinh làm bài trực tiếp, lệnh thu bài khẩn cấp | `⏳ Kế hoạch (Q4/26)` | WebSockets, Supabase Realtime |
| **Excel Batch Import/Export**| Tải câu hỏi lên hàng loạt từ file `.xlsx`, xuất bảng điểm phòng thi | `⏳ Kế hoạch (Q4/26)` | OpenPyXL / Pandas / SheetJS |

*Chú thích:*
- `✅ Đã hoàn thiện`: Mã nguồn đã có sẵn trong repo, đã test và chạy ổn định.
- `🚧 Đang phát triển`: Đã có prototype UI hoàn chỉnh, đang kết nối API và hoàn thiện nghiệp vụ.
- `⏳ Kế hoạch`: Đã chốt đặc tả kiến trúc và database schema, sẵn sàng tích hợp trong các sprint kế tiếp.

---

## 🛠️ 2. Công nghệ sử dụng (Tech Stack)

### Frontend
- **Core Framework:** [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **UI & Styling:** [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), Lucide Icons
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Form & Validation:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Math Engine:** [KaTeX](https://katex.org/) (Hỗ trợ cú pháp `$inline$` và `$$display$$`)
- **Data Visualization (Upcoming):** [Chart.js](https://www.chartjs.org/) (Phổ điểm Gauss & Radar Chart)
- **HTTP Client:** [Axios](https://axios-http.com/) (Tích hợp Token Refresh Interceptor)

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Asynchronous Python 3.11+)
- **Validation & Serialization:** [Pydantic v2](https://docs.pydantic.dev/)
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) / [Supabase](https://supabase.com/), [SQLAlchemy](https://www.sqlalchemy.org/)
- **Security:** OAuth2 Password Bearer, JWT (Jose/PyJWT), Passlib (Bcrypt)
- **AI Integration (Roadmap):** Google Gemini API / LLM SDK

---

## 📐 3. Kiến trúc Cơ sở Dữ liệu (Database Schema & ERD)

Cơ sở dữ liệu được thiết kế trên **PostgreSQL / Supabase** theo chuẩn quan hệ nghiêm ngặt, sử dụng khóa chính `UUID`, tận dụng kiểu dữ liệu `JSONB` cho cấu hình động và quản lý phiên đa thiết bị:

```text
┌─────────────────────────┐                                 ┌─────────────────────────┐
│          users          │                                 │        questions        │
├─────────────────────────┤                                 ├─────────────────────────┤
│ id (PK)         uuid    │                                 │ id (PK)         uuid    │
│ email (UK)      varchar │                                 │ exam_id (FK)    uuid    │◄───────────────┐
│ hashed_password varchar │                                 │ question_number int4    │                │
│ full_name       varchar │                                 │ content         text    │ (LaTeX/Math)   │
│ role            varchar │                                 │ question_type   varchar │ (choice/tf/..) │
│ created_at      timestam│                                 │ options         jsonb   │                │
│ is_verified     bool    │                                 │ correct_answer  text    │                │
└────────────┬────────────┘                                 │ explanation     text    │                │
             │                                              │ score_weight    numeric │                │
             ├──────────────────────────┐                   │ created_at      timestam│                │
             │ 1                        │ 1                 │ topic           varchar │ (Chủ đề)       │
             │                          │                   │ level           varchar │ (easy/med/hd)  │
             ▼ N                        ▼ N                 │ subject         varchar │ (Toán/Lý/...)  │
┌─────────────────────────┐┌─────────────────────────┐      │ image_url       text    │                │
│      user_sessions      ││          exams          │      └────────────┬────────────┘                │
├─────────────────────────┤├─────────────────────────┤                   │ 1                           │
│ id (PK)         uuid    ││ id (PK)         uuid    │                   │                             │
│ user_id (FK)    uuid    ││ title           varchar │                   │                             │
│ refresh_token   varchar ││ description     text    │                   │                             │
│ ip_address      varchar ││ duration        int4    │                   │                             │
│ user_agent      text    ││ created_by (FK) uuid    │                   │                             │
│ is_revoked      bool    ││ created_at      timestam│                   │                             │
│ expires_at      timestam│└────────────┬────────────┘                   │                             │
│ created_at      timestam│             │ 1                              │                             │
└─────────────────────────┘             │                                │                             │
                                        │                                │                             │
                                        ▼ N                              │                             │
                           ┌─────────────────────────┐                   │                             │
                           │       exam_rooms        │                   │                             │
                           ├─────────────────────────┤                   │                             │
                           │ id (PK)         uuid    │                   │                             │
                           │ exam_id (FK)    uuid    ├───────────────────┘                             │
                           │ room_code (UK)  varchar │ (Mã phòng)                                      │
                           │ name            varchar │                                                 │
                           │ start_time      timestam│                                                 │
                           │ end_time        timestam│                                                 │
                           │ password        varchar │ (Mật khẩu)                                      │
                           │ settings        jsonb   │ (Quy chế thi)                                   │
                           │ created_at      timestam│                                                 │
                           └────────────┬────────────┘                                                 │
                                        │ 1                                                            │
                                        │                                                              │
                                        ▼ N                                                            │
                           ┌─────────────────────────┐                                                 │
                           │       submissions       │                                                 │
                           ├─────────────────────────┤                                                 │
                           │ id (PK)         uuid    │                                                 │
                           │ room_id (FK)    uuid    │                                                 │
                           │ student_id (FK) uuid    │                                                 │
                           │ started_at      timestam│                                                 │
                           │ submitted_at    timestam│                                                 │
                           │ status          varchar │ (doing/submitted/violated)                      │
                           │ total_score     numeric │                                                 │
                           │ cheat_logs      jsonb   │ (Vết chuyển Tab)                                │
                           │ teacher_comment text    │ (Lời phê GV)                                    │
                           └────────────┬────────────┘                                                 │
                                        │ 1                                                            │
                                        │                                                              │
                                        ▼ N                                                            ▼ N
                           ┌───────────────────────────────────────────────────────────────────────────┤
                           │                              student_answers                              │
                           ├───────────────────────────────────────────────────────────────────────────┤
                           │ id (PK)              uuid                                                 │
                           │ submission_id (FK)   uuid                                                 │
                           │ question_id (FK)     uuid                                                 │
                           │ selected_answer      text                                                 │
                           │ is_correct           bool                                                 │
                           │ score_earned         numeric                                              │
                           └───────────────────────────────────────────────────────────────────────────┘
```
## 4. Cấu trúc Mã nguồn (Directory Structure)
```plaintext
EduExam/
├── backend/
│   ├── src/
│   │   └── app/
│   │       ├── api/               # API Router & Dependency Injections (deps.py)
│   │       │   └── v1/endpoints/  # Auth, Questions, (Upcoming: Exams, Rooms, Analytics)
│   │       ├── constant/          # Error Codes & System Messages
│   │       ├── core/              # Config, Database Engine, JWT Security, Supabase Client
│   │       ├── crud/              # Data Access Layer (CRUD Operations)
│   │       ├── model/             # SQLAlchemy ORM Models (User, UserSessions, Questions)
│   │       ├── schemas/           # Pydantic DTOs & Validation Schemas
│   │       ├── services/          # Pure Business Logic Layer (User, Question, Email)
│   │       └── utils/             # File storage & Helpers
│   ├── .env.example
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── api/                   # API Axios clients & Token Interceptors
    │   ├── components/ui/         # Reusable UI component library (shadcn/ui & KaTeX)
    │   ├── features/              # Feature Modules (Components, Schemas, State)
    │   │   ├── auth/              # Login, Register, Session Handlers
    │   │   ├── home/              # Hero, Features, Landing components
    │   │   ├── questionbank/      # Question Bank CRUD, KaTeX Editor, Badges
    │   │   └── (in-progress)/     # Exam builder, Taking room, Analytics
    │   ├── hooks/                 # Custom React Hooks (useAuth, useQuestion)
    │   ├── layouts/               # Dashboard Layout & Main Layout
    │   ├── store/                 # Zustand Global Store (Auth Store)
    │   └── types/                 # TypeScript Interfaces & API Types
    ├── package.json
    └── vite.config.ts
```
---
## 🔒 5. Điểm sáng Kỹ thuật (Engineering Highlights)

* End-to-End Type Safety: Kết hợp chặt chẽ giữa Pydantic v2 ở Backend và TypeScript + Zod ở Frontend, giảm thiểu tối đa lỗi sai kiểu dữ liệu thời gian chạy (Runtime errors).

* Phân tầng kiến trúc rõ ràng (Layered Clean Architecture): Tách biệt triệt để luồng xử lý: API Endpoint ➡️ Service (Business Logic) ➡️ CRUD (Database Access) ➡️ Database Engine.

* Cơ chế Silent Refresh Token: Axios Interceptor tự động bắt mã 401 Unauthorized, gọi endpoint refresh token và replay lại request đang chờ mà không làm gián đoạn trải nghiệm người dùng.

* Xử lý lỗi đồng nhất (Global Error Handling): Mọi phản hồi API đều tuân thủ chuẩn JSON Envelope đồng nhất, hỗ trợ map trực tiếp lỗi validation từ Backend về React Hook Form.

## 🚀 6. Hướng dẫn Cài đặt & Khởi chạy (Getting Started)
### 1. Yêu cầu môi trường (Prerequisites)
* Node.js >= 18.x & npm / yarn / pnpm

* Python >= 3.11+

Cơ sở dữ liệu PostgreSQL hoặc tài khoản Supabase

### 2. Thiết lập Backend
```bash
Bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Tạo và kích hoạt môi trường ảo (Virtual Environment)
python -m venv venv
* Trên Windows:
.\venv\Scripts\activate
* Trên macOS/Linux:
source venv/bin/activate

# 3. Cài đặt thư viện phụ thuộc
pip install -r requirements.txt

# 4. Cấu hình biến môi trường
cp .env.example .env
Chỉnh sửa file .env với thông tin kết nối Database/Supabase & Secret Key của bạn

# 5. Khởi chạy Backend Server
uvicorn src.app.main:app --reload --host 127.0.0.1 --port 8000
```
📄 API Documentation Swagger UI: http://127.0.0.1:8000/docs

### 3. Thiết lập Frontend
```bash
Bash
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt các package
npm install

# 3. Cấu hình biến môi trường (nếu cần)
cp .env .env.local

# 4. Khởi chạy chế độ Development
npm run dev
```
🌐 Ứng dụng Frontend sẵn sàng tại: http://localhost:5173

## 👨‍💻 7. Tác giả & Liên hệ (Author & Contact)
* Họ và tên: Cao Văn Dương

* Email: duong.cv.hec@gmail.com

* GitHub: github.com/Duong122702

⭐ Nếu bạn thấy dự án này thú vị, hãy để lại 1 Star trên GitHub repository nhé!

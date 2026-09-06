from backend.src.app.model.exam_rooms import ExamRoom
from backend.src.app.model.exams import Exam
from backend.src.app.schemas.exam.create_exam_schema import CreateExamSchema
from backend.src.app.schemas.exam.exam_schema import ExamSchemaFilter
from backend.src.app.schemas.exam.response.exam_response import DataResponse
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession


class ExamCRUD:
    async def get_all_exam(
        self,
        db: AsyncSession,
        params: ExamSchemaFilter,
        page: int = 1,
        page_size: int = 10,
    ) -> tuple[list[DataResponse], int]:
        query = select(
            Exam,
            func.array_remove(func.array_agg(ExamRoom.room_code), None).label(
                "room_codes"
            ),
        ).outerjoin(ExamRoom, Exam.id == ExamRoom.exam_id)

        if params.title:
            query = query.where(Exam.title.ilike(f"%{params.title}%"))
        if params.status:
            query = query.where(Exam.status == params.status)

        query = query.group_by(Exam.id)
        # 4. Đếm tổng số lượng bản ghi (Đếm trên subquery đã group)
        count_stmt = select(func.count()).select_from(query.subquery())
        total_count_result = await db.execute(count_stmt)
        total: int = total_count_result.scalar_one()

        # 5. Áp dụng phân trang và sắp xếp
        offset = (page - 1) * page_size
        data_stmt = (
            query.order_by(Exam.created_at.desc()).offset(offset).limit(page_size)
        )

        # 6. Thực thi truy vấn lấy dữ liệu
        result = await db.execute(data_stmt)

        # Vì select trả về 2 cột (Exam object, mảng room_codes) nên ta dùng .all() thay vì .scalars().all()
        rows = result.all()

        # 7. Gắn mảng room_codes vào object Exam
        exams_list = []
        for exam_obj, room_codes in rows:
            # Bạn gán thêm thuộc tính động này để Pydantic schema có thể đọc được
            exam_obj.room_codes = room_codes
            exams_list.append(exam_obj)

        return exams_list, total

    async def create_exams(self, db: AsyncSession, data: CreateExamSchema) -> Exam:
        new_exam = Exam(
            title=data.title,
            description=data.description,
            duration=data.duration,
            created_by=data.created_by,
            status=data.status,
            subject_id=data.subject_id,
        )
        db.add(new_exam)
        await db.commit()
        await db.refresh(new_exam)
        return new_exam

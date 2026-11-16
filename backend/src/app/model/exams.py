import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.app.core.database import Base


class Exam(Base):
    __tablename__ = "exams"
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    duration: Mapped[int] = mapped_column(nullable=False)  # Duration in minutes
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False
    )  # User ID of the creator
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    status: Mapped[str] = mapped_column(
        String, nullable=False
    )  # e.g., 'draft', 'published', 'archived'
    subject: Mapped[str] = mapped_column(String, nullable=False)  # Subject of the exam
    question_exams = relationship(
        "QuestionExam",
        back_populates="exam",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

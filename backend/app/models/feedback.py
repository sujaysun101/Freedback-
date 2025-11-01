"""
Feedback and Task models
"""
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Boolean, Integer, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.database.base import Base


class SourceType(str, enum.Enum):
    TEXT = "text"
    SCREENSHOT = "screenshot"
    EMAIL = "email"


class DifficultyLevel(str, enum.Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class FeedbackInput(Base):
    __tablename__ = "feedback_inputs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    original_text = Column(Text, nullable=False)
    source_type = Column(Enum(SourceType), default=SourceType.TEXT, nullable=False)
    metadata = Column(JSONB)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    project = relationship("Project", back_populates="feedback_inputs")
    generated_tasks = relationship("GeneratedTask", back_populates="feedback_input", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<FeedbackInput {self.id}>"


class GeneratedTask(Base):
    __tablename__ = "generated_tasks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    input_id = Column(UUID(as_uuid=True), ForeignKey("feedback_inputs.id", ondelete="CASCADE"), nullable=False, index=True)
    task_description = Column(Text, nullable=False)
    is_completed = Column(Boolean, default=False, nullable=False)
    estimated_time_minutes = Column(Integer)
    difficulty_level = Column(Enum(DifficultyLevel))
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime)
    
    # Relationships
    feedback_input = relationship("FeedbackInput", back_populates="generated_tasks")
    
    def __repr__(self):
        return f"<GeneratedTask {self.task_description[:50]}>"

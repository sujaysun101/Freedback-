from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    stripe_customer_id = Column(String, nullable=True)
    subscription_status = Column(String, default="inactive")  # inactive, active, canceled
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="projects")
    feedback_inputs = relationship("FeedbackInput", back_populates="project", cascade="all, delete-orphan")


class FeedbackInput(Base):
    __tablename__ = "feedback_inputs"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    original_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="feedback_inputs")
    generated_tasks = relationship("GeneratedTask", back_populates="feedback_input", cascade="all, delete-orphan")


class GeneratedTask(Base):
    __tablename__ = "generated_tasks"

    id = Column(Integer, primary_key=True, index=True)
    input_id = Column(Integer, ForeignKey("feedback_inputs.id"), nullable=False)
    task_description = Column(Text, nullable=False)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    feedback_input = relationship("FeedbackInput", back_populates="generated_tasks")

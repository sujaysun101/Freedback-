from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional


# User schemas
class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    subscription_status: str
    created_at: datetime

    class Config:
        from_attributes = True


# Project schemas
class ProjectBase(BaseModel):
    name: str


class ProjectCreate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# Feedback schemas
class FeedbackInputCreate(BaseModel):
    project_id: int
    original_text: str


class FeedbackInputResponse(BaseModel):
    id: int
    project_id: int
    original_text: str
    created_at: datetime

    class Config:
        from_attributes = True
        # Pydantic v2 compatibility
        from_orm = True


# Task schemas
class TaskBase(BaseModel):
    task_description: str


class TaskResponse(TaskBase):
    id: int
    input_id: int
    is_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True
        # Pydantic v2 compatibility
        from_orm = True


class TranslateRequest(BaseModel):
    project_id: int
    input_text: str


class TranslateResponse(BaseModel):
    feedback_input: FeedbackInputResponse
    tasks: List[TaskResponse]


# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None

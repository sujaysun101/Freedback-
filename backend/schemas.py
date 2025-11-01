"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional


# User schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    subscription_status: str
    
    class Config:
        from_attributes = True


# Project schemas
class ProjectCreate(BaseModel):
    name: str


class ProjectResponse(BaseModel):
    id: str
    name: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# Feedback schemas
class FeedbackInputCreate(BaseModel):
    project_id: str
    original_text: str


class TaskResponse(BaseModel):
    id: str
    task_description: str
    is_completed: bool
    
    class Config:
        from_attributes = True


class TranslateRequest(BaseModel):
    project_id: str
    feedback_text: str


class TranslateResponse(BaseModel):
    feedback_input_id: str
    tasks: List[TaskResponse]

"""
Feedback translation endpoints - THE CORE FEATURE
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List
from uuid import UUID

from app.database.session import get_db
from app.services.auth_service import get_current_user
from app.services.translator_service import TranslatorService
from app.models.user import User
from app.models.project import Project
from app.models.feedback import FeedbackInput, GeneratedTask

router = APIRouter()


class FeedbackTranslateRequest(BaseModel):
    project_id: str
    input_text: str


class GeneratedTaskResponse(BaseModel):
    id: str
    task_description: str
    is_completed: bool
    estimated_time_minutes: int | None
    difficulty_level: str | None
    created_at: str
    
    class Config:
        from_attributes = True


class FeedbackTranslateResponse(BaseModel):
    feedback_id: str
    original_text: str
    tasks: List[GeneratedTaskResponse]


@router.post("/translate", response_model=FeedbackTranslateResponse)
async def translate_feedback(
    request: FeedbackTranslateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    THE MAGIC ENDPOINT
    Translate vague client feedback into actionable design tasks
    """
    # Verify project belongs to user
    result = await db.execute(
        select(Project).where(
            Project.id == UUID(request.project_id),
            Project.user_id == current_user.id
        )
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check subscription status
    if current_user.subscription_status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Active subscription required"
        )
    
    # Create feedback input record
    feedback_input = FeedbackInput(
        project_id=project.id,
        original_text=request.input_text,
        source_type="text"
    )
    db.add(feedback_input)
    await db.commit()
    await db.refresh(feedback_input)
    
    # Call AI translator service
    translator = TranslatorService()
    try:
        tasks_data = await translator.translate_feedback(request.input_text)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Translation failed: {str(e)}"
        )
    
    # Save generated tasks
    generated_tasks = []
    for task_data in tasks_data:
        task = GeneratedTask(
            input_id=feedback_input.id,
            task_description=task_data["task"],
            estimated_time_minutes=task_data.get("estimated_time_minutes"),
            difficulty_level=task_data.get("difficulty_level")
        )
        db.add(task)
        generated_tasks.append(task)
    
    await db.commit()
    
    # Refresh all tasks to get their IDs
    for task in generated_tasks:
        await db.refresh(task)
    
    return FeedbackTranslateResponse(
        feedback_id=str(feedback_input.id),
        original_text=feedback_input.original_text,
        tasks=[GeneratedTaskResponse(
            id=str(task.id),
            task_description=task.task_description,
            is_completed=task.is_completed,
            estimated_time_minutes=task.estimated_time_minutes,
            difficulty_level=task.difficulty_level,
            created_at=str(task.created_at)
        ) for task in generated_tasks]
    )


@router.get("/project/{project_id}/history")
async def get_project_feedback_history(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all feedback translations for a project
    """
    # Verify project belongs to user
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == current_user.id
        )
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Get all feedback inputs with their tasks
    result = await db.execute(
        select(FeedbackInput).where(FeedbackInput.project_id == project_id)
    )
    feedback_inputs = result.scalars().all()
    
    return {
        "project_id": str(project_id),
        "feedback_history": [
            {
                "id": str(f.id),
                "original_text": f.original_text,
                "created_at": str(f.created_at),
                "task_count": len(f.generated_tasks)
            }
            for f in feedback_inputs
        ]
    }

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import FeedbackInput, GeneratedTask, Project, User
from app.schemas import TranslateRequest, TranslateResponse, TaskResponse, FeedbackInputResponse
from app.routers.auth import get_current_user, require_subscription
from app.services.translator import translate_feedback
import json

router = APIRouter()


@router.post("", response_model=TranslateResponse)
def translate(
    request: TranslateRequest,
    current_user: User = Depends(require_subscription),
    db: Session = Depends(get_db)
):
    """Translate vague feedback into actionable design tasks"""
    # Verify project belongs to user
    project = db.query(Project).filter(
        Project.id == request.project_id,
        Project.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Save feedback input
    feedback_input = FeedbackInput(
        project_id=request.project_id,
        original_text=request.input_text
    )
    db.add(feedback_input)
    db.commit()
    db.refresh(feedback_input)
    
    # Translate feedback using AI
    try:
        tasks_data = translate_feedback(request.input_text)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Translation failed: {str(e)}"
        )
    
    # Save generated tasks
    generated_tasks = []
    for task_data in tasks_data:
        task = GeneratedTask(
            input_id=feedback_input.id,
            task_description=task_data.get("task", "")
        )
        db.add(task)
        generated_tasks.append(task)
    
    db.commit()
    
    # Refresh all tasks
    for task in generated_tasks:
        db.refresh(task)
    
    return TranslateResponse(
        feedback_input=FeedbackInputResponse.model_validate(feedback_input),
        tasks=[TaskResponse.model_validate(task) for task in generated_tasks]
    )


@router.get("/feedback/{feedback_id}/tasks", response_model=List[TaskResponse])
def get_tasks_for_feedback(
    feedback_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all tasks for a feedback input"""
    feedback = db.query(FeedbackInput).join(Project).filter(
        FeedbackInput.id == feedback_id,
        Project.user_id == current_user.id
    ).first()
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    
    tasks = db.query(GeneratedTask).filter(
        GeneratedTask.input_id == feedback_id
    ).all()
    return [TaskResponse.model_validate(task) for task in tasks]


@router.patch("/tasks/{task_id}/complete")
def toggle_task_completion(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggle task completion status"""
    task = db.query(GeneratedTask).join(FeedbackInput).join(Project).filter(
        GeneratedTask.id == task_id,
        Project.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.is_completed = not task.is_completed
    db.commit()
    db.refresh(task)
    return {"id": task.id, "is_completed": task.is_completed}

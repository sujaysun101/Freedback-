"""
FeedbackFix Backend API
FastAPI application for translating client feedback into actionable design tasks
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from database import engine, get_db, Base
from models import User, Project, FeedbackInput, GeneratedTask
from schemas import (
    UserCreate, UserResponse, ProjectCreate, ProjectResponse,
    FeedbackInputCreate, TaskResponse, TranslateRequest, TranslateResponse
)
from auth import get_current_user, create_access_token, verify_password, get_password_hash
from services.translate_service import translate_feedback
from services.stripe_service import create_checkout_session

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FeedbackFix API",
    description="Translate vague client feedback into actionable design tasks",
    version="1.0.0"
)

# CORS middleware
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()


@app.get("/")
async def root():
    return {
        "message": "FeedbackFix API",
        "version": "1.0.0",
        "status": "operational"
    }


@app.post("/api/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return UserResponse(
        id=str(new_user.id),
        email=new_user.email,
        subscription_status=new_user.subscription_status
    )


@app.post("/api/auth/login")
async def login(user_data: UserCreate, db: Session = Depends(get_db)):
    """Login user and return access token"""
    user = db.query(User).filter(User.email == user_data.email).first()
    
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=str(user.id),
            email=user.email,
            subscription_status=user.subscription_status
        )
    }


@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user information"""
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        subscription_status=current_user.subscription_status
    )


@app.get("/api/projects", response_model=list[ProjectResponse])
async def get_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all projects for the current user"""
    projects = db.query(Project).filter(Project.user_id == current_user.id).all()
    return [ProjectResponse(id=str(p.id), name=p.name, created_at=p.created_at) for p in projects]


@app.post("/api/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new project"""
    new_project = Project(
        user_id=current_user.id,
        name=project_data.name
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    return ProjectResponse(
        id=str(new_project.id),
        name=new_project.name,
        created_at=new_project.created_at
    )


@app.post("/api/translate", response_model=TranslateResponse)
async def translate_feedback_endpoint(
    request: TranslateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Translate vague client feedback into actionable design tasks.
    Requires active subscription.
    """
    # Check subscription status
    if current_user.subscription_status != 'active':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Active subscription required. Please subscribe to use this feature."
        )
    
    # Verify project belongs to user
    project = db.query(Project).filter(
        Project.id == request.project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Save feedback input
    feedback_input = FeedbackInput(
        project_id=request.project_id,
        original_text=request.feedback_text
    )
    db.add(feedback_input)
    db.commit()
    db.refresh(feedback_input)
    
    # Translate feedback using AI
    try:
        tasks = await translate_feedback(request.feedback_text)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Translation failed: {str(e)}"
        )
    
    # Save generated tasks
    task_responses = []
    for task_text in tasks:
        task = GeneratedTask(
            input_id=feedback_input.id,
            task_description=task_text
        )
        db.add(task)
        task_responses.append(TaskResponse(
            id=str(task.id),
            task_description=task.task_description,
            is_completed=task.is_completed
        ))
    
    db.commit()
    
    return TranslateResponse(
        feedback_input_id=str(feedback_input.id),
        tasks=task_responses
    )


@app.get("/api/projects/{project_id}/tasks", response_model=list[TaskResponse])
async def get_tasks(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all tasks for a project"""
    # Verify project belongs to user
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Get all feedback inputs for this project
    feedback_inputs = db.query(FeedbackInput).filter(
        FeedbackInput.project_id == project_id
    ).all()
    
    input_ids = [fi.id for fi in feedback_inputs]
    
    # Get all tasks for these inputs
    tasks = db.query(GeneratedTask).filter(
        GeneratedTask.input_id.in_(input_ids)
    ).order_by(GeneratedTask.created_at.desc()).all()
    
    return [TaskResponse(
        id=str(t.id),
        task_description=t.task_description,
        is_completed=t.is_completed
    ) for t in tasks]


@app.post("/api/stripe/create-checkout-session")
async def create_checkout_session_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a Stripe checkout session for subscription"""
    session_url = await create_checkout_session(str(current_user.id), current_user.email, db)
    return {"checkout_url": session_url}


@app.post("/api/stripe/webhook")
async def stripe_webhook(request: dict):
    """Handle Stripe webhook events"""
    from fastapi import Request
    from services.stripe_service import handle_webhook
    import json
    
    # In production, you should verify the webhook signature
    # For now, we'll process the event directly
    return await handle_webhook(request)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

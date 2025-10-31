"""
Main API v1 Router
"""
from fastapi import APIRouter

from app.api.v1.endpoints import auth, projects, feedback, users, stripe_webhook

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
api_router.include_router(stripe_webhook.router, prefix="/stripe", tags=["stripe"])

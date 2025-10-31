"""
User management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.database.session import get_db
from app.services.auth_service import get_current_user
from app.models.user import User

router = APIRouter()


class UserProfileResponse(BaseModel):
    id: str
    email: str
    subscription_status: str
    subscription_plan: str | None
    created_at: str
    
    class Config:
        from_attributes = True


@router.get("/profile", response_model=UserProfileResponse)
async def get_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Get user profile information
    """
    return current_user

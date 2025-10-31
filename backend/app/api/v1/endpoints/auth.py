"""
Authentication endpoints
Integrates with Clerk for authentication
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr

from app.database.session import get_db
from app.services.auth_service import verify_clerk_token, get_current_user
from app.models.user import User

router = APIRouter()


class UserResponse(BaseModel):
    id: str
    email: str
    subscription_status: str
    subscription_plan: str | None
    
    class Config:
        from_attributes = True


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user information
    """
    return current_user


@router.post("/sync-user")
async def sync_clerk_user(
    clerk_user_id: str,
    email: EmailStr,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Sync user data from Clerk
    Called after Clerk authentication on frontend
    """
    # User is already authenticated via Clerk token
    # This endpoint ensures user exists in our database
    return {
        "message": "User synced successfully",
        "user_id": str(current_user.id)
    }

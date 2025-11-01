"""
Authentication service using Clerk
"""
from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import httpx
import logging

from app.core.config import settings
from app.database.session import get_db
from app.models.user import User

logger = logging.getLogger(__name__)


async def verify_clerk_token(authorization: str = Header(None)) -> dict:
    """
    Verify Clerk JWT token
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )
    
    token = authorization.replace("Bearer ", "")
    
    # Verify token with Clerk
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                "https://api.clerk.com/v1/tokens/verify",
                headers={
                    "Authorization": f"Bearer {settings.CLERK_SECRET_KEY}",
                },
                params={"token": token}
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token"
                )
            
            return response.json()
        except httpx.HTTPError as e:
            logger.error(f"Error verifying Clerk token: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token verification failed"
            )


async def get_current_user(
    token_data: dict = Depends(verify_clerk_token),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Get current authenticated user from database
    Creates user if doesn't exist (first-time login)
    """
    clerk_user_id = token_data.get("sub")
    email = token_data.get("email")
    
    if not clerk_user_id or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token data"
        )
    
    # Try to find existing user
    result = await db.execute(
        select(User).where(User.clerk_user_id == clerk_user_id)
    )
    user = result.scalar_one_or_none()
    
    # Create user if doesn't exist
    if not user:
        user = User(
            email=email,
            clerk_user_id=clerk_user_id
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        logger.info(f"Created new user: {email}")
    
    return user

"""
User model
"""
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.database.base import Base


class SubscriptionStatus(str, enum.Enum):
    INACTIVE = "inactive"
    ACTIVE = "active"
    CANCELLED = "cancelled"
    PAST_DUE = "past_due"


class SubscriptionPlan(str, enum.Enum):
    MONTHLY = "monthly"
    PER_PROJECT = "per_project"
    ENTERPRISE = "enterprise"


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    clerk_user_id = Column(String(255), unique=True, nullable=False, index=True)
    stripe_customer_id = Column(String(255), unique=True, index=True)
    subscription_status = Column(
        Enum(SubscriptionStatus),
        default=SubscriptionStatus.INACTIVE,
        nullable=False
    )
    subscription_plan = Column(Enum(SubscriptionPlan), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    api_usage = relationship("APIUsage", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User {self.email}>"

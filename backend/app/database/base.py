"""
Base class for SQLAlchemy models
"""
from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import all models here for Alembic to detect them
from app.models.user import User  # noqa
from app.models.project import Project  # noqa
from app.models.feedback import FeedbackInput, GeneratedTask  # noqa
from app.models.api_usage import APIUsage  # noqa

"""
Freedback FastAPI Main Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.api.v1.router import api_router
from app.database.session import engine
from app.database.base import Base

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan events for startup and shutdown
    """
    # Startup
    logger.info("Starting Freedback API...")
    logger.info(f"Environment: {settings.ENV}")
    
    # Create database tables (for development)
    # In production, use Alembic migrations
    if settings.ENV == "development":
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            logger.info("Database tables created")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Freedback API...")
    await engine.dispose()


# Create FastAPI app
app = FastAPI(
    title="Freedback API",
    description="AI-powered tool to translate vague client feedback into actionable design tasks",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.ENV == "development" else None,
    redoc_url="/redoc" if settings.ENV == "development" else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring
    """
    return {
        "status": "healthy",
        "version": "0.1.0",
        "environment": settings.ENV
    }


@app.get("/")
async def root():
    """
    Root endpoint
    """
    return {
        "message": "Freedback API",
        "version": "0.1.0",
        "docs": "/docs" if settings.ENV == "development" else "disabled"
    }

"""
Application Configuration
Uses Pydantic Settings for environment variable management
"""
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """
    
    # Environment
    ENV: str = "development"
    
    # Database
    DATABASE_URL: str
    
    # OpenAI
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    OPENAI_FALLBACK_MODEL: str = "gpt-3.5-turbo"
    
    # Clerk Authentication
    CLERK_SECRET_KEY: str
    
    # Stripe
    STRIPE_SECRET_KEY: str
    STRIPE_WEBHOOK_SECRET: str
    STRIPE_PRICE_ID_MONTHLY: str = ""
    STRIPE_PRICE_ID_PER_PROJECT: str = ""
    
    # JWT
    JWT_SECRET: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440
    
    # CORS
    FRONTEND_URL: str = "http://localhost:3000"
    
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        """
        Allowed origins for CORS
        """
        if self.ENV == "development":
            return ["http://localhost:3000", "http://127.0.0.1:3000"]
        return [self.FRONTEND_URL]
    
    # Sentry
    SENTRY_DSN: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()

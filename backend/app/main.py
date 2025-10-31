from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, translate, projects, webhooks, stripe as stripe_router
from app.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FeedbackFix API",
    description="Translate vague client feedback into actionable design tasks",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(translate.router, prefix="/api/translate", tags=["translate"])
app.include_router(stripe_router.router, prefix="/api/stripe", tags=["stripe"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])


@app.get("/")
async def root():
    return {"message": "FeedbackFix API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

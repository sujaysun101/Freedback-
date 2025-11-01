# FeedbackFix Backend

FastAPI backend for translating client feedback into actionable design tasks.

## Tech Stack

- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Database**: PostgreSQL with SQLAlchemy ORM
- **AI**: OpenAI GPT-4
- **Payments**: Stripe
- **Authentication**: JWT tokens

## Getting Started

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
python -c "from database import engine, Base; Base.metadata.create_all(bind=engine)"

# Run development server
uvicorn main:app --reload
```

API will be available at http://localhost:8000

API docs: http://localhost:8000/docs

## Project Structure

```
backend/
  ??? main.py                    # FastAPI app and routes
  ??? database.py                # Database configuration
  ??? models.py                  # SQLAlchemy models
  ??? schemas.py                 # Pydantic schemas
  ??? auth.py                    # Authentication utilities
  ??? services/
  ?   ??? translate_service.py  # AI translation logic
  ?   ??? stripe_service.py     # Stripe integration
  ??? requirements.txt           # Python dependencies
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API key
- `JWT_SECRET`: Secret key for JWT tokens
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret
- `CORS_ORIGINS`: Allowed CORS origins (comma-separated)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{project_id}/tasks` - Get project tasks

### Translation
- `POST /api/translate` - Translate feedback to tasks

### Payments
- `POST /api/stripe/create-checkout-session` - Create subscription
- `POST /api/stripe/webhook` - Handle Stripe webhooks

## Database Models

- `User`: User accounts and subscriptions
- `Project`: User projects
- `FeedbackInput`: Original client feedback
- `GeneratedTask`: AI-generated actionable tasks

## Development

```bash
# Run with auto-reload
uvicorn main:app --reload

# Run with specific host/port
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## Deployment

Recommended platforms:
- **Railway**: Easy PostgreSQL + Python deployment
- **Render**: Good free tier, PostgreSQL support
- **Heroku**: Traditional option
- **DigitalOcean**: App Platform

Make sure to:
1. Set all environment variables
2. Run database migrations
3. Configure CORS for your frontend domain
4. Set up Stripe webhook endpoint
5. Enable HTTPS

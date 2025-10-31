# FeedbackFix Project

This repository contains the FeedbackFix application - a tool that translates vague client feedback into actionable design tasks.

## Project Structure

```
/
??? backend/          # FastAPI backend application
?   ??? app/          # Main application code
?   ??? alembic/      # Database migrations
?   ??? requirements.txt
??? frontend/         # Next.js frontend application
?   ??? pages/        # Next.js pages
?   ??? components/   # React components
?   ??? lib/          # Utility functions
??? docker-compose.yml
??? README.md
```

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- Docker & Docker Compose (for database)
- PostgreSQL (or use Docker)
- OpenAI API key
- Stripe account (for payments)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

5. Update `.env` with your configuration:
   - `DATABASE_URL`: PostgreSQL connection string
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
   - `STRIPE_PRICE_ID`: Your Stripe price ID for $79/month subscription
   - `JWT_SECRET`: A secure random string

6. Start PostgreSQL database:
```bash
cd ..
docker-compose up -d db
```

7. Run database migrations:
```bash
cd backend
alembic upgrade head
```

8. Start the backend server:
```bash
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file (copy from `.env.example`):
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your configuration:
   - `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8000)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

5. Start the development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project by ID
- `DELETE /api/projects/{id}` - Delete project

### Translation
- `POST /api/translate` - Translate feedback to tasks
- `GET /api/translate/feedback/{id}/tasks` - Get tasks for feedback
- `PATCH /api/translate/tasks/{id}/complete` - Toggle task completion

### Stripe
- `POST /api/stripe/create-checkout-session` - Create checkout session

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler

## Database Schema

### Users
- `id`: Primary key
- `email`: Unique email address
- `password_hash`: Bcrypt hashed password
- `stripe_customer_id`: Stripe customer ID
- `subscription_status`: inactive, active, or canceled
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Projects
- `id`: Primary key
- `user_id`: Foreign key to users
- `name`: Project name
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Feedback Inputs
- `id`: Primary key
- `project_id`: Foreign key to projects
- `original_text`: Original client feedback text
- `created_at`: Timestamp

### Generated Tasks
- `id`: Primary key
- `input_id`: Foreign key to feedback_inputs
- `task_description`: Generated task description
- `is_completed`: Boolean completion status
- `created_at`: Timestamp

## Features

### MVP Features (Implemented)
- ? User authentication (register/login)
- ? Project management
- ? AI-powered feedback translation using OpenAI GPT-4
- ? Task list generation and management
- ? Task completion tracking
- ? Copy tasks to clipboard
- ? Stripe subscription integration
- ? Landing page with before/after examples

### Post-MVP Features (Planned)
- [ ] Screenshot/image upload with OCR
- [ ] Direct Figma integration
- [ ] Direct Asana integration
- [ ] Direct Trello integration
- [ ] Per-project pricing option
- [ ] Time/difficulty estimates for tasks
- [ ] Enterprise features
- [ ] Automatic project scoping from briefs
- [ ] Client education modules

## Development

### Running Tests
(To be added)

### Code Style
- Backend: Follow PEP 8 Python style guide
- Frontend: ESLint configuration included

### Database Migrations
Create a new migration:
```bash
cd backend
alembic revision --autogenerate -m "description"
```

Apply migrations:
```bash
alembic upgrade head
```

## Deployment

### Backend Deployment
The FastAPI backend can be deployed to:
- Heroku
- Railway
- AWS Elastic Beanstalk
- DigitalOcean App Platform
- Any platform supporting Python/WSGI

### Frontend Deployment
The Next.js frontend can be deployed to:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any platform supporting Node.js

### Environment Variables
Make sure to set all required environment variables in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

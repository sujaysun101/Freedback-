# FeedbackFix

> Turn vague client feedback into clear, actionable design tasks with AI

[![Status](https://img.shields.io/badge/status-MVP-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

## ?? Overview

FeedbackFix is an AI-powered SaaS tool that translates messy, vague client feedback (like "make it pop" or "needs more pizzazz") into specific, actionable design tasks that integrate directly with your workflow.

**Problem:** Clients say vague things while designers are left guessing what they actually want, leading to endless revision cycles and scope creep.

**Solution:** Upload client comments or paste their feedback, and get back clear instructions like "increase contrast on the headline by 40%" or "add 20px padding around the CTA button."

## ?? Business Model

- **Solo Plan**: $79/month for unlimited projects
- **Per Project**: $25 for occasional users
- **Enterprise**: Custom pricing for agencies (coming soon)

## ??? Architecture

### Tech Stack

**Frontend:**
- Next.js 14 (React 18, TypeScript)
- Tailwind CSS
- Clerk Authentication
- Stripe Payment Integration

**Backend:**
- FastAPI (Python 3.11+)
- PostgreSQL 15
- SQLAlchemy (async ORM)
- OpenAI API (GPT-4)

**Infrastructure:**
- Docker & Docker Compose
- Vercel (Frontend)
- Railway/Render (Backend)

### Project Structure

```
/workspace
??? backend/              # FastAPI backend
?   ??? app/
?   ?   ??? api/         # API endpoints
?   ?   ??? core/        # Configuration
?   ?   ??? database/    # Database setup
?   ?   ??? models/      # SQLAlchemy models
?   ?   ??? services/    # Business logic (AI translator!)
?   ??? database/
?   ?   ??? schema.sql   # Database schema
?   ?   ??? init.sql     # Initialization script
?   ??? Dockerfile
?   ??? requirements.txt
?
??? frontend/            # Next.js frontend
?   ??? src/
?   ?   ??? app/        # App router pages
?   ?   ??? components/ # React components
?   ?   ??? lib/        # Utilities & API client
?   ?   ??? styles/     # Global styles
?   ??? public/         # Static assets
?   ??? Dockerfile.dev
?   ??? package.json
?
??? docker-compose.yml   # Local development setup
??? .env.example        # Environment variables template
??? README.md           # This file
```

## ?? Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local frontend development)
- Python 3.11+ (for local backend development)
- OpenAI API key
- Clerk account (for authentication)
- Stripe account (for payments)

### Setup

1. **Clone the repository**
   ```bash
   cd /workspace
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database on port 5432
   - FastAPI backend on port 8000
   - Next.js frontend on port 3000

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
# Database
DATABASE_URL=postgresql://feedbackfix:feedbackfix_dev_password@localhost:5432/feedbackfix_dev

# OpenAI (REQUIRED)
OPENAI_API_KEY=sk-your-openai-api-key

# Clerk (REQUIRED)
CLERK_SECRET_KEY=sk_test_your-clerk-secret-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key

# Stripe (REQUIRED for payments)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

## ?? Development

### Backend Development

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest

# Code formatting
black app/
flake8 app/
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

### Database Management

```bash
# Access PostgreSQL shell
docker-compose exec db psql -U feedbackfix -d feedbackfix_dev

# Apply schema
docker-compose exec db psql -U feedbackfix -d feedbackfix_dev < backend/database/schema.sql

# Backup database
docker-compose exec db pg_dump -U feedbackfix feedbackfix_dev > backup.sql
```

## ?? Database Schema

**Core Tables:**
- `users` - User accounts (synced with Clerk)
- `projects` - User projects/workspaces
- `feedback_inputs` - Original vague feedback
- `generated_tasks` - AI-translated actionable tasks
- `api_usage` - Usage tracking for billing

See `backend/database/schema.sql` for complete schema.

## ?? Core Features (MVP)

### ? Implemented
- [x] User authentication (Clerk)
- [x] Project management (CRUD)
- [x] AI feedback translation (OpenAI GPT-4)
- [x] Task generation with time estimates
- [x] Subscription management (Stripe webhooks)
- [x] Basic landing page
- [x] RESTful API with FastAPI
- [x] PostgreSQL database with proper schema
- [x] Docker development environment

### ?? In Progress (Phase 3-6)
- [ ] Frontend dashboard UI
- [ ] Feedback translation interface
- [ ] Task list display component
- [ ] Screenshot upload & OCR
- [ ] Figma/Asana/Trello integration
- [ ] Client education modules
- [ ] Enterprise features

## ?? Testing

### Backend Tests
```bash
cd backend
pytest -v
pytest --cov=app tests/
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:e2e
```

## ?? Deployment

### Backend (Railway/Render)
1. Connect repository
2. Set environment variables
3. Use `backend/Dockerfile`
4. Deploy

### Frontend (Vercel)
1. Import repository
2. Set root directory to `frontend`
3. Set environment variables
4. Deploy

### Database (Managed PostgreSQL)
1. Create managed PostgreSQL instance
2. Apply schema: `psql < backend/database/schema.sql`
3. Update `DATABASE_URL` in environment

## ?? API Documentation

When running locally, visit: http://localhost:8000/docs

### Key Endpoints

**Authentication:**
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/sync-user` - Sync Clerk user

**Projects:**
- `GET /api/v1/projects/` - List projects
- `POST /api/v1/projects/` - Create project
- `GET /api/v1/projects/{id}` - Get project
- `DELETE /api/v1/projects/{id}` - Delete project

**Feedback Translation (THE MAGIC):**
- `POST /api/v1/feedback/translate` - Translate feedback to tasks
- `GET /api/v1/feedback/project/{id}/history` - Get translation history

**Stripe:**
- `POST /api/v1/stripe/webhook` - Handle Stripe events

## ?? Design System

Colors, typography, and components follow our design system in `frontend/tailwind.config.js`.

**Primary Colors:**
- Blue 50-900 scale for brand
- Success, warning, error states
- Semantic color naming

## ?? Roadmap

### Phase 1: Foundation ?
- Market research
- MVP feature definition
- Tech stack selection

### Phase 2: Technical Architecture ? (CURRENT)
- Environment setup
- Database schema
- Backend scaffolding
- Frontend scaffolding

### Phase 3: Core Feature (In Progress)
- AI prompt engineering
- Translation API endpoint
- Basic UI components

### Phase 4: Frontend UI/UX
- Wireframing
- Component development
- Application flow

### Phase 5: Billing & GTM
- Stripe integration
- Landing page
- Marketing content

### Phase 6: Future Vision
- API integrations (Figma, Asana, Trello)
- Project scoping feature
- Enterprise features

## ?? Contributing

This is a private project. For team members:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create a Pull Request

## ?? License

Proprietary - All rights reserved

## ?? Team

- **Product**: [Your Name]
- **Engineering**: [Your Name]
- **Design**: [Your Name]

## ?? Support

For issues or questions, contact: support@feedbackfix.com

---

**Built with ?? to save designers from "make it pop" hell**

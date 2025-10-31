# Freedback Technical Stack

## Overview
Freedback is a web application that translates vague client feedback into actionable design tasks using AI.

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context / Zustand
- **API Client**: Axios / Fetch API
- **Deployment**: Vercel

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Language**: Python
- **API Style**: RESTful JSON API
- **Authentication**: JWT tokens with Clerk
- **Deployment**: Docker containers

### Database
- **Primary Database**: PostgreSQL 15
- **ORM**: SQLAlchemy
- **Migrations**: Alembic

### AI/ML
- **Provider**: OpenAI API
- **Model**: GPT-4 Turbo
- **Fallback**: GPT-3.5-Turbo

### Authentication & Authorization
- **Service**: Clerk
- **Method**: JWT tokens
- **Features**: Email/password, social login (Google, GitHub)

### Payment Processing
- **Provider**: Stripe
- **Features**: Subscriptions, webhooks, customer portal
- **Plans**: $79/month solo, $25 per project

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (error tracking)
- **Logging**: Python logging + CloudWatch

### Development Tools
- **Version Control**: Git & GitHub
- **Code Quality**: ESLint, Prettier (frontend) / Black, Flake8 (backend)
- **Testing**: Jest, React Testing Library (frontend) / Pytest (backend)

## Architecture Principles
1. **Separation of Concerns**: Frontend and backend are completely decoupled
2. **API-First**: All functionality exposed via RESTful API
3. **Security**: Authentication on all protected routes, input validation
4. **Scalability**: Stateless backend, horizontal scaling capability
5. **Cost Efficiency**: Serverless where possible, optimize AI API calls

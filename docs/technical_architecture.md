# Technical Architecture & Environment Setup

## Stack Selection (Phase 2.1)

- **Frontend**: Next.js 14 (App Router) + TypeScript for server-/client-side rendering flexibility and Vercel-first deployment.
- **Backend API**: FastAPI (Python 3.11) deployed as standalone service; chosen for async support, OpenAPI docs, and strong AI ecosystem.
- **Database**: PostgreSQL 15 managed via Supabase or self-hosted container in development.
- **AI Integration**: OpenAI GPT-4o-mini (fallback to GPT-3.5-turbo) accessed from backend server with prompt templates.
- **Authentication**: Supabase Auth (email/password + OAuth) delivering JWTs validated on backend.
- **Payments**: Stripe Checkout & Billing Portal for subscription management.
- **Infrastructure**: Docker Compose for local env; Vercel (frontend) + Render/Fly.io (backend) for production; Supabase/Neon for managed Postgres.

## High-Level Architecture

- **Frontend (Next.js)** consumes `/api/*` routes from FastAPI via HTTPS.
- **Backend (FastAPI)** exposes REST endpoints for auth-protected operations: translation, project management, billing webhooks.
- **PostgreSQL** stores normalized relational data; SQLModel/SQLAlchemy used for ORM.
- **LLM Service Layer** encapsulates prompt templates, validation, and retry logic.
- **Queue (Optional, Post-MVP)**: Celery/RQ for asynchronous translation if throughput increases.

```
Client (Next.js) --> FastAPI --> Postgres
                        \--> OpenAI API
                        \--> Stripe API (webhooks -> FastAPI)
```

## Repository Structure (Proposed)

```
/frontend           # Next.js app
  /app
  /components
  /lib
/backend            # FastAPI service
  /app
    /api
    /models
    /services
    /schemas
/infra
  docker-compose.yml
  /terraform (post-MVP)
/docs
  ...
/data
```

## Environment Setup (Phase 2.2)

1. **Prerequisites**: Node.js 20, pnpm, Python 3.11, Docker Desktop.
2. **Repo Initialization**:
   - `git init`
   - `pnpm create next-app frontend --ts`
   - `uv init backend` (or `poetry init`)
3. **Environment Variables**:
   - `frontend/.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_BASE_URL`.
   - `backend/.env`: `DATABASE_URL`, `OPENAI_API_KEY`, `SUPABASE_JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
4. **Docker Compose**: runs Postgres, pgAdmin (optional), and backend service in dev mode.
5. **Deployment Targets**:
   - Frontend: Vercel project connected to main branch; environment variables configured in dashboard.
   - Backend: Render/Fly.io Docker deployment with continuous deploy from `dev/main` branch.
   - Database: Supabase project with SQL migrations deployed via `supabase db push`.

## Database Schema (Phase 2.3)

Primary tables captured in `/database/schema.sql` and managed via Alembic migrations.

- `users`: auth metadata + billing status.
- `projects`: user-owned collections of feedback inputs.
- `feedback_inputs`: raw user-submitted text.
- `generated_tasks`: structured task outputs linked to feedback entries.
- `subscriptions` (optional extension): Stripe subscription metadata if more granularity is needed later.

See accompanying SQL file for explicit definitions.

## Tooling & Dev Experience

- **Testing**: pytest for backend, Playwright/React Testing Library for frontend.
- **Linting/Formatting**: `ruff` + `black` for Python; `eslint` + `prettier` for frontend.
- **Type Safety**: Pydantic models for request/response; zod for frontend validation.
- **CI/CD**: GitHub Actions workflows for test suite, linting, Docker image build, and deployment gating.

## Security & Compliance Considerations

- Store OpenAI & Stripe keys in secure secrets manager (Vercel/Render).
- Enforce HTTPS across environments.
- Role-based access control reserved for post-MVP; rely on project ownership scoping initially.
- Log translation requests with hashed user IDs for analytics while protecting PII.

## Scaling Roadmap

- Introduce background job queue for batch translations and scheduled re-interpretations.
- Implement audit logging for enterprise tier.
- Add vector database (Pinecone/Supabase vectors) for contextual memory around recurring clients.
- Explore fine-tuned LLM or distilled local model for cost efficiency at scale.

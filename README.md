# FeedbackFix - Client Feedback Translator

Turn vague client notes into clear design tasks with AI-powered feedback translation.

## ?? Product Overview

FeedbackFix translates messy client feedback into specific, actionable design tasks. Upload a screenshot of client comments or paste their rambling email, and get back clear instructions like "increase contrast on the headline by 40%" or "add 20px padding around the CTA button."

## ??? Architecture

- **Frontend**: Next.js (React)
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **AI Model**: OpenAI API (GPT-4/GPT-3.5-Turbo)
- **Authentication**: Supabase Auth
- **Payments**: Stripe

## ?? Project Structure

```
/
??? backend/          # FastAPI backend
??? frontend/         # Next.js frontend
??? docker-compose.yml
??? README.md
```

## ?? Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Setup

1. **Clone and setup backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Setup frontend:**
```bash
cd frontend
npm install
```

3. **Start database:**
```bash
docker-compose up -d db
```

4. **Run migrations:**
```bash
cd backend
alembic upgrade head
```

5. **Start backend:**
```bash
cd backend
uvicorn app.main:app --reload
```

6. **Start frontend:**
```bash
cd frontend
npm run dev
```

## ?? Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories.

### Backend `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/feedbackfix
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
```

### Frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## ?? Features (MVP)

- ? User authentication
- ? Project management
- ? AI-powered feedback translation
- ? Task list generation
- ? Stripe subscription integration
- ? Landing page

## ??? Roadmap

- [ ] Screenshot/image upload with OCR
- [ ] Direct Figma/Asana/Trello integration
- [ ] Per-project pricing
- [ ] Time/difficulty estimates
- [ ] Enterprise features
- [ ] Automatic project scoping

## ?? License

MIT

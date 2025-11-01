# FeedbackFix Setup Guide

## Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.11+ (for backend)
- **PostgreSQL** 15+ (or use Docker)
- **Docker & Docker Compose** (optional, recommended)
- **Stripe Account** (for payments)
- **OpenAI API Key** (for AI translation)

## Quick Start with Docker

### 1. Clone and Setup

```bash
# Navigate to project directory
cd /workspace

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Configure Environment Variables

#### Backend (.env)
```bash
DATABASE_URL=postgresql://feedbackfix:feedbackfix_dev@postgres:5432/feedbackfix
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_secure_jwt_secret_min_32_chars
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CORS_ORIGINS=http://localhost:3000
```

#### Frontend (.env)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 3. Start Services

```bash
# Start PostgreSQL and backend with Docker
docker-compose up -d postgres backend

# Wait for services to be ready (about 30 seconds)
docker-compose ps

# Initialize database (first time only)
docker-compose exec backend python -c "from database import engine, Base; Base.metadata.create_all(bind=engine)"
```

### 4. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at http://localhost:3000

Backend API will be available at http://localhost:8000

API docs: http://localhost:8000/docs

## Manual Setup (Without Docker)

### 1. Setup PostgreSQL

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt-get install postgresql-15

# Create database
sudo -u postgres psql
CREATE DATABASE feedbackfix;
CREATE USER feedbackfix WITH PASSWORD 'feedbackfix_dev';
GRANT ALL PRIVILEGES ON DATABASE feedbackfix TO feedbackfix;
\q

# Run schema
psql -U feedbackfix -d feedbackfix -f database/schema.sql
```

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your values

# Run migrations (creates tables)
python -c "from database import engine, Base; Base.metadata.create_all(bind=engine)"

# Start server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev
```

## Stripe Setup

### 1. Create Stripe Account
1. Sign up at https://stripe.com
2. Get API keys from Dashboard ? Developers ? API keys
3. Add keys to `.env` files

### 2. Create Subscription Product
1. Go to Products ? Add Product
2. Create recurring product: $79/month
3. Copy the Price ID (starts with `price_`)
4. Add to `backend/.env`: `STRIPE_MONTHLY_PRICE_ID=price_xxx`

### 3. Setup Webhook (For Production)
1. Go to Developers ? Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 4. Test with Stripe CLI (Local Development)
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Forward webhooks to local server
stripe listen --forward-to localhost:8000/api/stripe/webhook

# This will give you a webhook secret starting with whsec_
# Use this in your backend .env for local testing
```

## OpenAI Setup

1. Sign up at https://platform.openai.com
2. Create API key at https://platform.openai.com/api-keys
3. Add to `backend/.env`: `OPENAI_API_KEY=sk-xxx`

**Note**: GPT-4 costs ~$0.03 per translation. Consider using GPT-3.5-turbo for development/testing ($0.001 per translation).

## Database Migrations (Future)

For production, use Alembic for migrations:

```bash
cd backend

# Initialize Alembic (first time)
alembic init migrations

# Create migration
alembic revision --autogenerate -m "Initial schema"

# Apply migration
alembic upgrade head
```

## Development Workflow

### Backend Development
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Database Changes
1. Update `models.py`
2. Update `database/schema.sql`
3. In production, create Alembic migration

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Backend (Railway/Render)
1. Connect GitHub repository
2. Set environment variables
3. Add PostgreSQL database
4. Deploy

### Database
- Use managed PostgreSQL (Supabase, Railway, Render)
- Run schema migration on first deploy

## Troubleshooting

### Database Connection Issues
- Check `DATABASE_URL` format: `postgresql://user:password@host:port/dbname`
- Ensure PostgreSQL is running: `docker-compose ps` or `systemctl status postgresql`
- Check firewall/network settings

### CORS Errors
- Ensure `CORS_ORIGINS` in backend `.env` includes frontend URL
- Check browser console for specific CORS error

### OpenAI API Errors
- Verify API key is correct
- Check API usage/quota in OpenAI dashboard
- Ensure sufficient credits

### Stripe Webhook Issues
- Use Stripe CLI for local testing
- Verify webhook secret matches
- Check webhook logs in Stripe dashboard

## Production Checklist

- [ ] Change `JWT_SECRET` to secure random string
- [ ] Use production Stripe keys (not test keys)
- [ ] Set up proper domain and SSL
- [ ] Configure production database backup
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Configure rate limiting
- [ ] Set up logging
- [ ] Enable email verification (optional)
- [ ] Set up password reset (optional)

## Support

For issues or questions:
1. Check logs: `docker-compose logs backend` or `docker-compose logs frontend`
2. Review API docs: http://localhost:8000/docs
3. Check environment variables are set correctly

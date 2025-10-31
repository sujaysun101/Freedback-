# Quick Start Guide

## One-Command Setup

Run the setup script:
```bash
./setup.sh
```

Or manually follow these steps:

## Manual Setup

### 1. Start Database
```bash
docker-compose up -d db
```

### 2. Setup Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
alembic upgrade head
uvicorn app.main:app --reload
```

### 3. Setup Frontend (in new terminal)
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your API keys
npm run dev
```

## Environment Variables Needed

### Backend (.env)
- `OPENAI_API_KEY` - Get from https://platform.openai.com/api-keys
- `STRIPE_SECRET_KEY` - Get from https://dashboard.stripe.com/apikeys
- `STRIPE_WEBHOOK_SECRET` - Get from Stripe webhook settings
- `STRIPE_PRICE_ID` - Create a product in Stripe and use the price ID
- `JWT_SECRET` - Any random string (keep secret!)

### Frontend (.env.local)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Get from Stripe dashboard

## Testing the Application

1. Visit http://localhost:3000
2. Register a new account
3. Create a project
4. Paste vague feedback like "make it pop" or "needs more pizzazz"
5. See it translated into actionable tasks!

## Troubleshooting

### Database Connection Issues
- Make sure Docker is running: `docker ps`
- Check database logs: `docker-compose logs db`

### OpenAI API Errors
- Verify your API key is correct
- Check you have credits in your OpenAI account
- Consider using `gpt-3.5-turbo` instead of `gpt-4` for testing (cheaper)

### Stripe Issues
- Use Stripe test mode keys for development
- Create a test product with $79/month recurring price
- Use Stripe CLI for local webhook testing: `stripe listen --forward-to localhost:8000/api/webhooks/stripe`

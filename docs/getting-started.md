# Getting Started with FeedbackFix

This guide will help you get FeedbackFix up and running on your local machine.

## Quick Start (5 minutes)

### Option 1: Docker (Recommended)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd feedbackfix

# 2. Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Edit backend/.env and add:
#    - Your OpenAI API key
#    - A secure JWT secret (32+ characters)
#    - Your Stripe keys (for payments)

# 4. Start services
docker-compose up -d

# 5. Setup frontend
cd frontend
npm install
npm run dev

# 6. Open browser
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

See [SETUP.md](../SETUP.md) for detailed manual setup instructions.

## First Steps

### 1. Create an Account

1. Go to http://localhost:3000
2. Click "Get Started"
3. Enter your email and password
4. You'll be redirected to the dashboard

### 2. Subscribe (Required for Translation)

1. On the dashboard, you'll see a subscription prompt
2. Click "Subscribe Now"
3. You'll be redirected to Stripe Checkout
4. Use Stripe test card: `4242 4242 4242 4242`
5. Enter any future expiry date and any CVC
6. Complete the checkout
7. You'll be redirected back with an active subscription

### 3. Create Your First Project

1. In the dashboard, click "+ New" in the Projects sidebar
2. Enter a project name (e.g., "Client Website Redesign")
3. Click "Create"

### 4. Translate Your First Feedback

1. Select your project
2. In the feedback text area, paste some vague client feedback:
   ```
   make it pop
   ```
3. Click "Translate to Tasks"
4. Wait a few seconds
5. You'll see actionable tasks like:
   - "Increase contrast ratio between background and foreground elements by at least 40%"
   - "Apply a vibrant color accent to primary call-to-action buttons"
   - "Add subtle shadow or depth effects to key visual elements"
6. Click "Copy" on any task to copy it to your clipboard

## Testing with Stripe

### Test Cards

Use these test card numbers in Stripe Checkout:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

For all cards:
- Use any future expiry date
- Use any 3-digit CVC
- Use any postal code

### Testing Webhooks Locally

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Forward webhooks to local server
stripe listen --forward-to localhost:8000/api/stripe/webhook

# This will output a webhook secret (whsec_...)
# Add it to backend/.env as STRIPE_WEBHOOK_SECRET

# Test webhook events
stripe trigger checkout.session.completed
```

## Example Feedback to Try

### Vague Feedback Examples

1. **"make it pop"**
   - Generates tasks about contrast, colors, shadows, typography

2. **"needs more pizzazz"**
   - Generates tasks about animations, color palettes, spacing

3. **"make the logo bigger and add pizzazz"**
   - Generates tasks about logo size, colors, fonts

4. **"it feels empty"**
   - Generates tasks about spacing, content, visual elements

5. **"make it more professional"**
   - Generates tasks about typography, colors, spacing, alignment

## Troubleshooting

### "Connection refused" errors
- Ensure backend is running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`

### "Subscription required" error
- Make sure you completed Stripe checkout
- Check your subscription status in the dashboard
- If using test mode, ensure webhook secret is configured

### No tasks generated
- Check OpenAI API key is set correctly
- Check backend logs for OpenAI errors
- Ensure you have OpenAI credits

### Database errors
- Ensure PostgreSQL is running: `docker-compose ps postgres`
- Check database connection string in `.env`
- Try recreating database: `docker-compose down -v && docker-compose up -d`

## Next Steps

- Read the [MVP Specification](phase1-mvp-spec.md) to understand the product
- Check the [Roadmap](phase6-roadmap.md) for future features
- Review the [API Integration Plan](phase6-api-integrations.md) for upcoming integrations

## Need Help?

- Check [SETUP.md](../SETUP.md) for detailed setup instructions
- Review backend logs: `docker-compose logs backend`
- Review frontend console for errors
- Check API docs: http://localhost:8000/docs

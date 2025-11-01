# Getting Started with Freedback Development

This guide will help you set up your local development environment for Freedback.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** (for Mac/Windows) or **Docker + Docker Compose** (for Linux)
- **Node.js 20+** (for local frontend development)
- **Python 3.11+** (for local backend development)
- **Git**
- **VS Code** (recommended) or your preferred IDE

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd freedback
```

### 2. Get API Keys

You'll need accounts and API keys for:

#### OpenAI (Required)
1. Go to https://platform.openai.com/
2. Sign up / Log in
3. Navigate to API Keys
4. Create new secret key
5. Copy key (starts with `sk-`)

#### Clerk (Required for Auth)
1. Go to https://clerk.com/
2. Sign up for free account
3. Create new application
4. Copy Publishable Key (starts with `pk_test_`)
5. Copy Secret Key (starts with `sk_test_`)

#### Stripe (Required for Payments)
1. Go to https://stripe.com/
2. Sign up for free account
3. Use test mode (toggle in top right)
4. Get API keys from Developers ? API Keys
5. Copy Secret Key (starts with `sk_test_`)
6. Set up webhook for local testing:
   ```bash
   stripe listen --forward-to localhost:8000/api/v1/stripe/webhook
   ```
7. Copy webhook secret (starts with `whsec_`)

### 3. Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env with your API keys
nano .env  # or use your preferred editor
```

Fill in your API keys:
```bash
# OpenAI
OPENAI_API_KEY=sk-your-actual-key-here

# Clerk
CLERK_SECRET_KEY=sk_test_your-actual-key-here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-actual-key-here

# Stripe
STRIPE_SECRET_KEY=sk_test_your-actual-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-actual-secret-here
```

### 4. Start with Docker Compose (Easiest)

This will start everything (database, backend, frontend):

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Services will be available at:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Database: localhost:5432

### 5. Alternative: Local Development (More Control)

#### Start Database Only
```bash
docker-compose up db -d
```

#### Backend (Terminal 1)
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend (Terminal 2)
```bash
cd frontend

# Install dependencies
npm install

# Copy frontend env
cp .env.local.example .env.local
# Edit .env.local with your Clerk keys

# Run development server
npm run dev
```

### 6. Initialize Database

The database schema will be automatically created when you start the backend (in development mode).

To manually apply the schema:
```bash
docker-compose exec db psql -U freedback -d freedback_dev -f /docker-entrypoint-initdb.d/init.sql
```

Or from your local machine:
```bash
psql postgresql://freedback:freedback_dev_password@localhost:5432/freedback_dev < backend/database/schema.sql
```

### 7. Verify Everything Works

#### Test Backend
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy","version":"0.1.0","environment":"development"}
```

#### Test Frontend
Open http://localhost:3000 in your browser. You should see the landing page.

#### Test Database
```bash
docker-compose exec db psql -U freedback -d freedback_dev -c "\dt"
# Should list tables: users, projects, feedback_inputs, generated_tasks, api_usage
```

## Common Issues & Solutions

### Issue: Port Already in Use

**Error:** `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution:**
```bash
# Find process using port
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill process or change port in docker-compose.yml
```

### Issue: Database Connection Failed

**Error:** `could not connect to server: Connection refused`

**Solution:**
```bash
# Ensure database container is running
docker-compose ps

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Issue: OpenAI API Rate Limit

**Error:** `Rate limit exceeded`

**Solution:**
- You're on free tier - upgrade or wait
- Add payment method to OpenAI account
- Implement retry logic (already in code)

### Issue: Clerk Authentication Not Working

**Error:** `Invalid token` or `Unauthorized`

**Solution:**
- Ensure you copied BOTH keys (publishable + secret)
- Check keys are in correct environment files
- Verify keys are for same Clerk application
- Try creating new API keys

## Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Backend: Edit files in `backend/app/`
   - Frontend: Edit files in `frontend/src/`

3. **Test your changes**
   - Backend: `pytest` (in backend directory)
   - Frontend: `npm test` (in frontend directory)

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   git push origin feature/your-feature-name
   ```

### Code Style

**Backend (Python):**
```bash
# Format code
black app/

# Lint code
flake8 app/

# Type check
mypy app/
```

**Frontend (TypeScript):**
```bash
# Lint
npm run lint

# Type check
npm run type-check

# Format (if using Prettier)
npm run format
```

## Testing the AI Translation

Once everything is running, test the core feature:

1. **Sign up** at http://localhost:3000/sign-up
2. **Create a project** (via API or UI when built)
3. **Test translation** with curl:

```bash
# Get auth token from Clerk (check browser dev tools)
TOKEN="your-clerk-jwt-token"

# Translate feedback
curl -X POST http://localhost:8000/api/v1/feedback/translate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "project_id": "your-project-uuid",
    "input_text": "make it pop and add more pizzazz"
  }'
```

Expected response:
```json
{
  "feedback_id": "uuid",
  "original_text": "make it pop and add more pizzazz",
  "tasks": [
    {
      "id": "uuid",
      "task_description": "Increase contrast ratio on the main headline from 4.5:1 to at least 7:1",
      "is_completed": false,
      "estimated_time_minutes": 10,
      "difficulty_level": "easy",
      "created_at": "2024-01-15T10:30:00Z"
    },
    // ... more tasks
  ]
}
```

## Useful Commands

### Docker

```bash
# View all containers
docker-compose ps

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Restart a service
docker-compose restart backend

# Rebuild after changing Dockerfile
docker-compose up --build

# Stop all services
docker-compose down

# Stop and remove volumes (CAUTION: deletes data)
docker-compose down -v
```

### Database

```bash
# Access PostgreSQL shell
docker-compose exec db psql -U freedback -d freedback_dev

# Common SQL commands
\dt              # List tables
\d users         # Describe users table
SELECT * FROM users;
\q               # Quit
```

### Backend

```bash
# Run specific test file
pytest tests/test_translator.py -v

# Run with coverage
pytest --cov=app tests/

# Check code style
black --check app/
flake8 app/

# Generate requirements.txt
pip freeze > requirements.txt
```

### Frontend

```bash
# Install new package
npm install <package-name>

# Remove package
npm uninstall <package-name>

# Update packages
npm update

# Clear Next.js cache
rm -rf .next
npm run dev
```

## Next Steps

Now that you have everything set up:

1. **Familiarize yourself with the codebase**
   - Read `ARCHITECTURE.md` for system design
   - Check `backend/app/services/translator_service.py` for AI magic
   - Look at `backend/app/api/v1/endpoints/` for API structure

2. **Start building features**
   - See `TODO.md` for current sprint tasks
   - Check GitHub Issues for bugs/features
   - Join team Slack for discussions

3. **Review the roadmap**
   - We're currently in Phase 2 (Technical Setup) ?
   - Next: Phase 3 (Core Feature Development)
   - Then: Phase 4 (Frontend UI/UX)

## Getting Help

- **Technical Issues**: Check `ARCHITECTURE.md` and inline code comments
- **API Questions**: Visit http://localhost:8000/docs when backend is running
- **Team Chat**: [Your team communication channel]
- **Documentation**: All `.md` files in repository root

## Troubleshooting Checklist

Before asking for help, check:

- [ ] Are all environment variables set correctly?
- [ ] Is Docker Desktop running?
- [ ] Are all containers running? (`docker-compose ps`)
- [ ] Are API keys valid and not expired?
- [ ] Did you restart after changing `.env`?
- [ ] Are you on the correct branch?
- [ ] Did you pull latest changes? (`git pull`)
- [ ] Is your Node.js/Python version correct?

---

**Happy coding! ?? Let's save designers from "make it pop" hell!**

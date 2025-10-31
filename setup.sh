#!/bin/bash

# FeedbackFix Setup Script
# This script helps set up the development environment

echo "?? Setting up FeedbackFix..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "? Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start database
echo "?? Starting PostgreSQL database..."
docker-compose up -d db

# Wait for database to be ready
echo "? Waiting for database to be ready..."
sleep 5

# Setup backend
echo "?? Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
echo "Installing Python dependencies..."
pip install -r requirements.txt

if [ ! -f ".env" ]; then
    echo "??  Creating .env file from example..."
    cp .env.example .env
    echo "??  Please update backend/.env with your API keys!"
fi

echo "Running database migrations..."
alembic upgrade head

cd ..

# Setup frontend
echo "??  Setting up frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

if [ ! -f ".env.local" ]; then
    echo "??  Creating .env.local file from example..."
    cp .env.example .env.local
    echo "??  Please update frontend/.env.local with your API keys!"
fi

cd ..

echo ""
echo "? Setup complete!"
echo ""
echo "?? Next steps:"
echo "1. Update backend/.env with your OpenAI API key and Stripe keys"
echo "2. Update frontend/.env.local with your Stripe publishable key"
echo "3. Start the backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "4. Start the frontend: cd frontend && npm run dev"
echo ""
echo "?? Backend will run on http://localhost:8000"
echo "?? Frontend will run on http://localhost:3000"

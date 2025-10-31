# Freedback Backend

Express.js REST API for the Freedback application.

## Features

- RESTful API with Express.js
- JWT-based authentication
- PostgreSQL database with Prisma ORM
- CRUD operations for users and feedback
- Environment-based configuration
- Error handling middleware

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up the database (optional - using Prisma):
```bash
npx prisma migrate dev --name init
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user (requires auth)

### Users
- `GET /api/users` - Get all users (requires auth)
- `GET /api/users/:id` - Get user by ID (requires auth)
- `PUT /api/users/:id` - Update user (requires auth)
- `DELETE /api/users/:id` - Delete user (requires auth)

### Feedback
- `POST /api/feedback` - Create feedback (requires auth)
- `GET /api/feedback` - Get all feedback (requires auth)
- `GET /api/feedback/:id` - Get feedback by ID (requires auth)
- `PUT /api/feedback/:id` - Update feedback (requires auth)
- `DELETE /api/feedback/:id` - Delete feedback (requires auth)

## Testing

```bash
npm test
```

## Production

```bash
npm start
```

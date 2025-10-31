# Freedback - Full Stack Web Application Template

A complete full stack web application template built with modern technologies. This template provides a solid foundation for building web applications with authentication, CRUD operations, and a responsive user interface.

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Prisma** - ORM (optional)
- **PostgreSQL** - Database

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## ✨ Features

- 🔐 **Authentication System** - JWT-based auth with login/register
- 👤 **User Management** - CRUD operations for users
- 📝 **Feedback System** - Create, read, update, delete feedback
- 🎨 **Modern UI** - Clean, responsive interface
- 🔒 **Protected Routes** - Authorization middleware
- 🐳 **Docker Ready** - Easy deployment with Docker
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Fast Development** - Hot reload for frontend and backend

## 📦 Project Structure

```
Freedback-/
├── backend/              # Express backend
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Data models
│   │   ├── config/       # Configuration
│   │   └── server.js     # Entry point
│   ├── prisma/           # Database schema
│   ├── package.json
│   └── Dockerfile
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── services/     # API services
│   │   ├── hooks/        # Custom hooks
│   │   └── utils/        # Utilities
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml    # Docker orchestration
```

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL (optional - can use Docker)
- Docker & Docker Compose (optional)

### Option 1: Run with Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/sujaysun101/Freedback-.git
cd Freedback-
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/health

### Option 2: Run Locally

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. (Optional) Set up database with Prisma:
```bash
npx prisma migrate dev --name init
```

5. Start the server:
```bash
npm run dev
```

Backend will run on http://localhost:5000

#### Frontend Setup

1. Navigate to frontend directory (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API URL
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user (requires auth)

### User Endpoints (Protected)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Feedback Endpoints (Protected)

- `POST /api/feedback` - Create feedback
- `GET /api/feedback` - Get all feedback (supports filters)
- `GET /api/feedback/:id` - Get feedback by ID
- `PUT /api/feedback/:id` - Update feedback
- `DELETE /api/feedback/:id` - Delete feedback

## 🔧 Configuration

### Backend Environment Variables

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/freedback?schema=public"
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📝 Development Workflow

1. **Backend Development**: The backend uses nodemon for hot reload. Make changes in `backend/src/` and they'll automatically reload.

2. **Frontend Development**: Vite provides instant HMR. Make changes in `frontend/src/` and see them immediately in the browser.

3. **Database Changes**: If using Prisma, modify `backend/prisma/schema.prisma` and run:
```bash
npx prisma migrate dev --name your_migration_name
```

## 🚢 Production Deployment

### Using Docker

```bash
docker-compose up -d
```

### Manual Deployment

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Start backend:
```bash
cd backend
npm start
```

3. Serve frontend build with a web server (nginx, Apache, etc.)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

This template is designed to help developers quickly bootstrap full stack web applications with best practices and modern tools.

## 📧 Support

For support, please open an issue in the GitHub repository.
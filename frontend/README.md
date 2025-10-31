# Freedback Frontend

React-based frontend for the Freedback application.

## Features

- React 18 with modern hooks
- React Router for navigation
- Axios for API calls
- Context API for state management
- Responsive design
- JWT authentication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API URL
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Project Structure

```
src/
├── components/     # Reusable components
├── contexts/       # React contexts
├── hooks/          # Custom hooks
├── pages/          # Page components
├── services/       # API services
├── utils/          # Utility functions
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## Building for Production

```bash
npm run build
```

The production files will be in the `dist/` directory.

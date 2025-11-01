# FeedbackFix Frontend

Next.js 14 application for translating client feedback into actionable design tasks.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL and Stripe key

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
  ??? page.tsx              # Landing page
  ??? login/
  ?   ??? page.tsx          # Login page
  ??? register/
  ?   ??? page.tsx          # Registration page
  ??? dashboard/
  ?   ??? page.tsx          # Main dashboard
  ??? layout.tsx             # Root layout
  ??? globals.css            # Global styles

lib/
  ??? api.ts                 # API client
  ??? store.ts               # Zustand store

components/                   # Reusable components (future)
```

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8000)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key

## Features

- ? User authentication (login/register)
- ? Project management
- ? Feedback translation UI
- ? Task list display
- ? Copy-to-clipboard functionality
- ? Subscription management (Stripe)
- ? Responsive design

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This project is optimized for Vercel deployment:

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

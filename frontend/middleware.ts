import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Note: Auth tokens are stored in localStorage (client-side)
  // Client components handle auth redirects
  // This middleware is kept minimal - auth checks happen in components
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};

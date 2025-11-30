import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Cookie name must match the one in cookies.ts
const AUTH_COOKIE_NAME = 'kostlife_auth';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/wallet',
  '/profile',
];

// Routes that should redirect to home if already authenticated
const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth cookie
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const isAuthenticated = !!authCookie?.value;

  // Check if accessing a protected route without authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login page with return URL
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if accessing auth routes while already authenticated
  const isAuthRoute = AUTH_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  if (isAuthRoute && isAuthenticated) {
    // Redirect to recipe page (main page after login)
    return NextResponse.redirect(new URL('/recipe', request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which routes the proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/data (Next.js data routes)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     */
    '/((?!api|_next/static|_next/image|_next/data|favicon.ico|assets).*)',
  ],
};

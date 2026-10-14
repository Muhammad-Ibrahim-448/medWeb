// src/middleware.js
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const COOKIE_NAME = 'sj_auth_token';

// Routes that require authentication
const protectedRoutes = ['/dashboard'];

// Routes that require admin role — ALL dashboard routes
const adminRoutes = ['/dashboard'];

// Public routes (no auth needed)
const publicRoutes = ['/login', '/register', '/forgot-password'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  // If user is logged in and tries to access login/register, redirect appropriately
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    if (session) {
      const redirectUrl = session.role === 'admin' ? '/dashboard' : '/';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // Check protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Not logged in → login with redirect back
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Logged in but not admin → home
    if (adminRoutes.some((route) => pathname.startsWith(route)) && session.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/forgot-password'],
};
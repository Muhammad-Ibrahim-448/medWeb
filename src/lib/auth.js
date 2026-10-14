// src/lib/auth.js
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { signToken, verifyToken } from './jwt';

const COOKIE_NAME = 'sj_auth_token';

/* ------------------------------------------------------------------ */
/* Password helpers                                                    */
/* ------------------------------------------------------------------ */
export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/* ------------------------------------------------------------------ */
/* Re-export token helpers                                             */
/* ------------------------------------------------------------------ */
export { signToken, verifyToken };

/* ------------------------------------------------------------------ */
/* Session cookie helpers                                              */
/* ------------------------------------------------------------------ */
export async function setSessionCookie(payload) {
  const token = await signToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

/**
 * Read the session from the cookie.
 * Returns decoded JWT payload { id, name, email, role } or null.
 * Use in Server Components, Route Handlers, Server Actions.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}


/* ---------- Guards ---------- */
export class UnauthorizedError extends Error {
  constructor(msg = 'Unauthorized') { super(msg); this.name = 'UnauthorizedError'; }
}
export class ForbiddenError extends Error {
  constructor(msg = 'Forbidden') { super(msg); this.name = 'ForbiddenError'; }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) throw new UnauthorizedError('Authentication required');
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.role !== 'admin') throw new ForbiddenError('Admin access required');
  return session;
}
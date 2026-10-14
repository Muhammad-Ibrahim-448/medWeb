// src/lib/auth.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const AUTH_SECRET = process.env.AUTH_SECRET || 'change-me-in-production';
const COOKIE_NAME = 'sj_auth_token';
const TOKEN_TTL = 60 * 60 * 24 * 7; // 7 days

/* ---------- Password ---------- */
export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/* ---------- JWT ---------- */
export function signToken(payload) {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: TOKEN_TTL });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, AUTH_SECRET);
  } catch {
    return null;
  }
}

/* ---------- Session (cookie) ---------- */
export async function setSessionCookie(payload) {
  const token = signToken(payload);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TOKEN_TTL,
  });
  return token;
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
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
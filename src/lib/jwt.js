// src/lib/jwt.js
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-change-me';
const TOKEN_EXPIRY = '7d';

const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * Sign a JWT. Works in Node and Edge runtimes.
 */
export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(secret);
}

/**
 * Verify a JWT. Returns payload or null.
 * Works in Node and Edge runtimes.
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}
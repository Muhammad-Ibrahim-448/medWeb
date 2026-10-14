// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, setSessionCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const users = await query(
      'SELECT id, name, email, password_hash, phone, role, status, email_verified FROM users WHERE email = ?',
      [email]
    );

    if (!users.length) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0];

    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'Your account has been suspended. Please contact support.' },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);

    const sessionPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    await setSessionCookie(sessionPayload);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        email_verified: user.email_verified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
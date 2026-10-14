import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, setSessionCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password, phone } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email exists
    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const result = await query(
      `INSERT INTO users (name, email, password_hash, phone, role, status, email_verified)
       VALUES (?, ?, ?, ?, 'customer', 'active', 0)`,
      [name, email, passwordHash, phone || null]
    );

    const userId = result.insertId;

    const sessionPayload = {
      id: userId,
      name,
      email,
      role: 'customer',
    };

    await setSessionCookie(sessionPayload);

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        id: userId,
        name,
        email,
        phone: phone || null,
        role: 'customer',
        email_verified: 0,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
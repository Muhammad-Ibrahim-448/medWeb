// src/app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const users = await query(
      'SELECT id, name, email, phone, role, status, email_verified, created_at FROM users WHERE id = ?',
      [session.id]
    );

    if (!users.length) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const user = users[0];

    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'Account suspended' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        email_verified: user.email_verified,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
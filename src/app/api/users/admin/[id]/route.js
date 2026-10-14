// src/app/api/users/admin/[id]/route.js
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request, { params }) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const rows = await query(
      `SELECT id, name, email, phone, role, status, email_verified,
              last_login_at, created_at, updated_at
       FROM users WHERE id = ? LIMIT 1`,
      [id]
    )

    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      )
    }

    const customer = rows[0]

    // Recent orders
    const orders = await query(
      `SELECT id, order_number, total, payment_status, order_status,
              created_at
       FROM orders WHERE user_id = ?
       ORDER BY created_at DESC LIMIT 20`,
      [id]
    )

    // Addresses
    const addresses = await query(
      `SELECT * FROM addresses WHERE user_id = ?
       ORDER BY is_default DESC, created_at DESC`,
      [id]
    )

    // Aggregate
    const aggRows = await query(
      `SELECT
         COUNT(*) AS order_count,
         COALESCE(SUM(CASE WHEN order_status NOT IN ('cancelled','returned') THEN total ELSE 0 END), 0) AS total_spent,
         COALESCE(AVG(CASE WHEN order_status NOT IN ('cancelled','returned') THEN total END), 0) AS avg_order_value
       FROM orders WHERE user_id = ?`,
      [id]
    )

    return NextResponse.json({
      success: true,
      data: {
        ...customer,
        orders,
        addresses,
        stats: aggRows[0] || {},
      },
    })
  } catch (err) {
    console.error('GET /api/users/admin/[id] error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch customer' },
      { status: 500 }
    )
  }
}

/* PATCH — update status / role */
export async function PATCH(request, { params }) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    const updates = []
    const values = []

    if (body.status && ['active', 'inactive', 'suspended'].includes(body.status)) {
      updates.push('status = ?')
      values.push(body.status)
    }
    if (body.role && ['customer', 'admin'].includes(body.role)) {
      // Prevent self-demotion
      if (Number(id) === session.id && body.role !== 'admin') {
        return NextResponse.json(
          { success: false, message: "You can't change your own role" },
          { status: 400 }
        )
      }
      updates.push('role = ?')
      values.push(body.role)
    }

    if (!updates.length) {
      return NextResponse.json(
        { success: false, message: 'No valid fields to update' },
        { status: 400 }
      )
    }

    values.push(id)
    await query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values)

    return NextResponse.json({
      success: true,
      message: 'Customer updated successfully',
    })
  } catch (err) {
    console.error('PATCH /api/users/admin/[id] error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to update customer' },
      { status: 500 }
    )
  }
}
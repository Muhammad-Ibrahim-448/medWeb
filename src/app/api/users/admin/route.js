// src/app/api/users/admin/route.js
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

/* GET /api/users/admin — list customers (excludes admins) */
export async function GET(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.min(100, Number(searchParams.get('limit')) || 15)
    const offset = (page - 1) * limit
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const sort = searchParams.get('sort') || 'newest'
    const includeAdmins = searchParams.get('includeAdmins') === '1'

    const where = []
    const params = []

    if (!includeAdmins) {
      where.push("u.role = 'customer'")
    }
    if (status !== 'all') {
      where.push('u.status = ?')
      params.push(status)
    }
    if (search) {
      where.push('(u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)')
      const term = `%${search}%`
      params.push(term, term, term)
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    const orderMap = {
      newest: 'u.created_at DESC',
      oldest: 'u.created_at ASC',
      name_asc: 'u.name ASC',
      name_desc: 'u.name DESC',
      orders_desc: 'order_count DESC',
      spent_desc: 'total_spent DESC',
    }
    const orderSql = orderMap[sort] || orderMap.newest

    const countRows = await query(
      `SELECT COUNT(*) AS total FROM users u ${whereSql}`,
      params
    )
    const total = countRows[0]?.total || 0

    const rows = await query(
      `SELECT
         u.id, u.name, u.email, u.phone, u.role, u.status,
         u.email_verified, u.last_login_at, u.created_at,
         (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count,
         (SELECT COALESCE(SUM(o.total), 0) FROM orders o
            WHERE o.user_id = u.id AND o.order_status NOT IN ('cancelled','returned')
         ) AS total_spent,
         (SELECT MAX(o.created_at) FROM orders o WHERE o.user_id = u.id) AS last_order_at
       FROM users u
       ${whereSql}
       ORDER BY ${orderSql}
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )

    // Stats
    const statsRows = await query(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN role = 'customer' THEN 1 ELSE 0 END) AS customers,
         SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS admins,
         SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active,
         SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) AS suspended,
         SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) AS new_last_30d
       FROM users`
    )

    return NextResponse.json({
      success: true,
      data: rows,
      stats: statsRows[0] || {},
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    })
  } catch (err) {
    console.error('GET /api/users/admin error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}
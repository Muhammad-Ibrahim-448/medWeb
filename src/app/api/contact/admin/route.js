// src/app/api/contact/admin/route.js
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

/* GET /api/contact/admin — list all contact messages */
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

    const where = []
    const params = []

    if (status !== 'all') {
      where.push('status = ?')
      params.push(status)
    }
    if (search) {
      where.push(
        '(name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ? OR phone LIKE ?)'
      )
      const term = `%${search}%`
      params.push(term, term, term, term, term)
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    const orderMap = {
      newest: 'created_at DESC',
      oldest: 'created_at ASC',
      name_asc: 'name ASC',
      status_asc: 'status ASC, created_at DESC',
    }
    const orderSql = orderMap[sort] || orderMap.newest

    const countRows = await query(
      `SELECT COUNT(*) AS total FROM contact_messages ${whereSql}`,
      params
    )
    const total = countRows[0]?.total || 0

    const rows = await query(
      `SELECT
         id, name, email, phone, subject, message,
         status, ip_address, replied_at, replied_by, created_at
       FROM contact_messages
       ${whereSql}
       ORDER BY ${orderSql}
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )

    // Stats
    const statsRows = await query(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS new_count,
         SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) AS read_count,
         SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) AS replied,
         SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) AS archived,
         SUM(CASE WHEN status = 'spam' THEN 1 ELSE 0 END) AS spam,
         SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS last_7d
       FROM contact_messages`
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
    console.error('GET /api/contact/admin error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
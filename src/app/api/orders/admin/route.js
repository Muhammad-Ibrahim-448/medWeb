// src/app/api/orders/admin/route.js
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

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
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '15', 10)
    const status = searchParams.get('status') || ''
    const payment = searchParams.get('payment') || ''
    const search = searchParams.get('search') || ''
    const offset = (page - 1) * limit

    const where = []
    const params = []

    if (status && status !== 'all') {
      where.push('o.order_status = ?')
      params.push(status)
    }
    if (payment && payment !== 'all') {
      where.push('o.payment_status = ?')
      params.push(payment)
    }
    if (search) {
      where.push(
        '(o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_email LIKE ? OR o.customer_phone LIKE ?)'
      )
      const like = `%${search}%`
      params.push(like, like, like, like)
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''

    // Count
    const countRows = await query(
      `SELECT COUNT(*) AS total FROM orders o ${whereClause}`,
      params
    )
    const total = countRows[0]?.total || 0

    // Orders
    const orders = await query(
      `SELECT
         o.id, o.order_number, o.customer_name, o.customer_email, o.customer_phone,
         o.total, o.subtotal, o.shipping_fee,
         o.payment_method, o.payment_status, o.order_status,
         o.shipping_city, o.shipping_country,
         o.created_at, o.updated_at,
         (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
       FROM orders o
       ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )

    // Stats (across all orders, not filtered)
    const statsRows = await query(
      `SELECT
         COUNT(*) AS total_orders,
         SUM(CASE WHEN order_status = 'pending'    THEN 1 ELSE 0 END) AS pending,
         SUM(CASE WHEN order_status = 'confirmed'  THEN 1 ELSE 0 END) AS confirmed,
         SUM(CASE WHEN order_status = 'processing' THEN 1 ELSE 0 END) AS processing,
         SUM(CASE WHEN order_status = 'shipped'    THEN 1 ELSE 0 END) AS shipped,
         SUM(CASE WHEN order_status = 'delivered'  THEN 1 ELSE 0 END) AS delivered,
         SUM(CASE WHEN order_status = 'cancelled'  THEN 1 ELSE 0 END) AS cancelled,
         COALESCE(SUM(CASE WHEN order_status != 'cancelled' AND order_status != 'returned' THEN total ELSE 0 END), 0) AS revenue
       FROM orders`
    )

    return NextResponse.json({
      success: true,
      data: orders,
      stats: statsRows[0] || {},
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    })
  } catch (err) {
    console.error('GET /api/orders/admin error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
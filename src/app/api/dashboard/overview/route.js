// src/app/api/dashboard/overview/route.js
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    /* ─── Stats ─── */
    const [revenueRows, ordersRows, productsRows, customersRows] =
      await Promise.all([
        // Revenue (non-cancelled/returned)
        query(
          `SELECT
             COALESCE(SUM(total), 0) AS revenue,
             COUNT(*) AS order_count
           FROM orders
           WHERE order_status NOT IN ('cancelled','returned')`
        ),
        // Orders this month vs last
        query(
          `SELECT
             SUM(CASE WHEN created_at >= DATE_FORMAT(NOW(),'%Y-%m-01') THEN 1 ELSE 0 END) AS this_month,
             SUM(CASE WHEN created_at >= DATE_FORMAT(NOW() - INTERVAL 1 MONTH,'%Y-%m-01')
                       AND created_at < DATE_FORMAT(NOW(),'%Y-%m-01') THEN 1 ELSE 0 END) AS last_month,
             SUM(CASE WHEN order_status = 'pending' THEN 1 ELSE 0 END) AS pending_orders
           FROM orders`
        ),
        // Products + new this month
        query(
          `SELECT
             COUNT(*) AS total,
             SUM(CASE WHEN created_at >= DATE_FORMAT(NOW(),'%Y-%m-01') THEN 1 ELSE 0 END) AS this_month
           FROM products
           WHERE status = 'active'`
        ),
        // Customers + new this month
        query(
          `SELECT
             COUNT(*) AS total,
             SUM(CASE WHEN created_at >= DATE_FORMAT(NOW(),'%Y-%m-01') THEN 1 ELSE 0 END) AS this_month
           FROM users
           WHERE role = 'customer'`
        ),
      ])

    const revenue = Number(revenueRows[0]?.revenue || 0)
    const ordersThisMonth = Number(ordersRows[0]?.this_month || 0)
    const ordersLastMonth = Number(ordersRows[0]?.last_month || 0)
    const productsCount = Number(productsRows[0]?.total || 0)
    const productsThisMonth = Number(productsRows[0]?.this_month || 0)
    const customersCount = Number(customersRows[0]?.total || 0)
    const customersThisMonth = Number(customersRows[0]?.this_month || 0)

    const changePct = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0
      return Math.round(((curr - prev) / prev) * 100)
    }

    const stats = {
      revenue,
      orders: ordersThisMonth,
      products: productsCount,
      customers: customersCount,
      pending_orders: Number(ordersRows[0]?.pending_orders || 0),
      revenue_change: 0, // can extend: compare vs previous month
      orders_change: changePct(ordersThisMonth, ordersLastMonth),
      products_change: productsThisMonth,
      customers_change: customersThisMonth,
    }

    /* ─── Recent orders ─── */
    const recentOrders = await query(
      `SELECT id, order_number, customer_name, total, order_status, created_at
       FROM orders
       ORDER BY created_at DESC
       LIMIT 5`
    )

    /* ─── Low stock ─── */
    const lowStock = await query(
      `SELECT id, name, sku, stock_quantity
       FROM products
       WHERE status = 'active'
         AND stock_quantity <= low_stock_threshold
       ORDER BY stock_quantity ASC
       LIMIT 5`
    )

    return NextResponse.json({
      success: true,
      data: { stats, recentOrders, lowStock },
    })
  } catch (err) {
    console.error('GET /api/dashboard/overview error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to load dashboard' },
      { status: 500 }
    )
  }
}
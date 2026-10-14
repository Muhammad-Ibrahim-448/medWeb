// src/app/api/orders/admin/[id]/route.js
import { NextResponse } from 'next/server'
import { query, transaction } from '@/lib/db'
import { getSession } from '@/lib/auth'

/* ─── GET single order with items ─── */
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
      `SELECT * FROM orders WHERE id = ? LIMIT 1`,
      [id]
    )

    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    const items = await query(
      `SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC`,
      [id]
    )

    return NextResponse.json({
      success: true,
      data: { ...rows[0], items },
    })
  } catch (err) {
    console.error('GET /api/orders/admin/[id] error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

/* ─── PATCH: update order_status / payment_status / admin_notes ─── */
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

    const allowedOrderStatus = [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'returned',
    ]
    const allowedPaymentStatus = ['pending', 'paid', 'failed', 'refunded']

    const updates = []
    const values = []

    if (body.order_status && allowedOrderStatus.includes(body.order_status)) {
      updates.push('order_status = ?')
      values.push(body.order_status)

      // Stamp timestamps
      if (body.order_status === 'shipped') {
        updates.push('shipped_at = CURRENT_TIMESTAMP')
      } else if (body.order_status === 'delivered') {
        updates.push('delivered_at = CURRENT_TIMESTAMP')
      } else if (body.order_status === 'cancelled') {
        updates.push('cancelled_at = CURRENT_TIMESTAMP')
      }
    }

    if (
      body.payment_status &&
      allowedPaymentStatus.includes(body.payment_status)
    ) {
      updates.push('payment_status = ?')
      values.push(body.payment_status)
    }

    if (typeof body.admin_notes === 'string') {
      updates.push('admin_notes = ?')
      values.push(body.admin_notes.slice(0, 5000))
    }

    if (!updates.length) {
      return NextResponse.json(
        { success: false, message: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // If cancelling, restore stock in a transaction
    if (body.order_status === 'cancelled') {
      await transaction(async (conn) => {
        // Check current status first
        const [current] = await conn.execute(
          `SELECT order_status FROM orders WHERE id = ? FOR UPDATE`,
          [id]
        )
        if (!current.length) throw new Error('Order not found')

        const prevStatus = current[0].order_status
        if (prevStatus === 'cancelled') {
          // Already cancelled — just update notes/other fields
          await conn.execute(
            `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
            [...values, id]
          )
          return
        }

        // Restore stock
        const [items] = await conn.execute(
          `SELECT product_id, quantity FROM order_items WHERE order_id = ?`,
          [id]
        )

        for (const item of items) {
          if (!item.product_id) continue
          await conn.execute(
            `UPDATE products
               SET stock_quantity = stock_quantity + ?,
                   sold_count     = GREATEST(sold_count - ?, 0)
             WHERE id = ?`,
            [item.quantity, item.quantity, item.product_id]
          )

          await conn.execute(
            `INSERT INTO inventory_logs (
               product_id, change_type, quantity_change,
               previous_stock, new_stock, reference_id, note, created_by
             )
             SELECT id, 'cancel', ?, stock_quantity - ?, stock_quantity, ?, ?, ?
             FROM products WHERE id = ?`,
            [
              item.quantity,
              item.quantity,
              id,
              `Order cancelled`,
              session.id,
              item.product_id,
            ]
          )
        }

        await conn.execute(
          `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
          [...values, id]
        )
      })
    } else {
      await query(
        `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
        [...values, id]
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
    })
  } catch (err) {
    console.error('PATCH /api/orders/admin/[id] error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to update order' },
      { status: 500 }
    )
  }
}
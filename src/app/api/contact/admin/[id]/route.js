// src/app/api/contact/admin/[id]/route.js
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
      `SELECT cm.*, u.name AS replied_by_name
       FROM contact_messages cm
       LEFT JOIN users u ON u.id = cm.replied_by
       WHERE cm.id = ? LIMIT 1`,
      [id]
    )

    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      )
    }

    const message = rows[0]

    // Auto-mark as read when first viewed
    if (message.status === 'new') {
      await query(
        "UPDATE contact_messages SET status = 'read' WHERE id = ?",
        [id]
      )
      message.status = 'read'
    }

    return NextResponse.json({ success: true, data: message })
  } catch (err) {
    console.error('GET /api/contact/admin/[id] error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch message' },
      { status: 500 }
    )
  }
}

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

    const allowedStatuses = [
      'new',
      'read',
      'replied',
      'archived',
      'spam',
    ]

    const updates = []
    const values = []

    if (body.status && allowedStatuses.includes(body.status)) {
      updates.push('status = ?')
      values.push(body.status)

      if (body.status === 'replied') {
        updates.push('replied_at = CURRENT_TIMESTAMP')
        updates.push('replied_by = ?')
        values.push(session.id)
      }
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

    values.push(id)
    await query(
      `UPDATE contact_messages SET ${updates.join(', ')} WHERE id = ?`,
      values
    )

    return NextResponse.json({
      success: true,
      message: 'Message updated successfully',
    })
  } catch (err) {
    console.error('PATCH /api/contact/admin/[id] error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to update message' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const existing = await query(
      'SELECT id FROM contact_messages WHERE id = ? LIMIT 1',
      [id]
    )
    if (!existing.length) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      )
    }

    await query('DELETE FROM contact_messages WHERE id = ?', [id])
    return NextResponse.json({ success: true, message: 'Message deleted' })
  } catch (err) {
    console.error('DELETE /api/contact/admin/[id] error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to delete message' },
      { status: 500 }
    )
  }
}
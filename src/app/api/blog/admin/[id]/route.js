// src/app/api/blog/admin/[id]/route.js
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

/* GET single post for admin editing */
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
      `SELECT bp.*, u.name AS author_name
       FROM blog_posts bp
       LEFT JOIN users u ON u.id = bp.author_id
       WHERE bp.id = ? LIMIT 1`,
      [id]
    )

    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: rows[0] })
  } catch (err) {
    console.error('GET /api/blog/admin/[id] error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch post' },
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
      'SELECT id FROM blog_posts WHERE id = ? LIMIT 1',
      [id]
    )
    if (!existing.length) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      )
    }

    await query('DELETE FROM blog_posts WHERE id = ?', [id])
    return NextResponse.json({ success: true, message: 'Post deleted' })
  } catch (err) {
    console.error('DELETE /api/blog/admin/[id] error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
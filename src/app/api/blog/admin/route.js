// src/app/api/blog/admin/route.js
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

/* GET /api/blog/admin — list all blog posts (drafts + published) */
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
      where.push('bp.status = ?')
      params.push(status)
    }
    if (search) {
      where.push('(bp.title LIKE ? OR bp.excerpt LIKE ? OR bp.slug LIKE ?)')
      const term = `%${search}%`
      params.push(term, term, term)
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    const orderMap = {
      newest: 'bp.created_at DESC',
      oldest: 'bp.created_at ASC',
      title_asc: 'bp.title ASC',
      published_desc: 'bp.published_at DESC',
    }
    const orderSql = orderMap[sort] || orderMap.newest

    const countRows = await query(
      `SELECT COUNT(*) AS total FROM blog_posts bp ${whereSql}`,
      params
    )
    const total = countRows[0]?.total || 0

    const rows = await query(
      `SELECT
         bp.id, bp.title, bp.slug, bp.excerpt, bp.cover_image,
         bp.status, bp.published_at, bp.created_at, bp.updated_at,
         u.name AS author_name
       FROM blog_posts bp
       LEFT JOIN users u ON u.id = bp.author_id
       ${whereSql}
       ORDER BY ${orderSql}
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )

    // Stats
    const statsRows = await query(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS published,
         SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft,
         SUM(CASE WHEN published_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) AS published_last_30d
       FROM blog_posts`
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
    console.error('GET /api/blog/admin error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}
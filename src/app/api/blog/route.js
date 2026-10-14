// src/app/api/blog/route.js
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

/* ─── slugify helper ─── */
function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/* GET /api/blog — public list (published only) */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.min(50, Number(searchParams.get('limit')) || 9)
    const offset = (page - 1) * limit
    const search = searchParams.get('search') || ''

    const where = ["bp.status = 'published'"]
    const params = []
    if (search) {
      where.push('(bp.title LIKE ? OR bp.excerpt LIKE ?)')
      const term = `%${search}%`
      params.push(term, term)
    }
    const whereSql = `WHERE ${where.join(' AND ')}`

    const countRows = await query(
      `SELECT COUNT(*) AS total FROM blog_posts bp ${whereSql}`,
      params
    )
    const total = countRows[0]?.total || 0

    const posts = await query(
      `SELECT bp.id, bp.title, bp.slug, bp.excerpt, bp.cover_image,
              bp.published_at, bp.created_at, u.name AS author_name
       FROM blog_posts bp
       LEFT JOIN users u ON u.id = bp.author_id
       ${whereSql}
       ORDER BY bp.published_at DESC, bp.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    })
  } catch (err) {
    console.error('GET /api/blog error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

/* POST /api/blog — create post (admin only) */
export async function POST(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    if (!body.title || !String(body.title).trim()) {
      return NextResponse.json(
        { success: false, message: 'Title is required' },
        { status: 400 }
      )
    }

    let slug = slugify(body.slug || body.title)
    if (!slug) slug = `post-${Date.now()}`

    // Handle slug collisions
    const dupSlug = await query(
      'SELECT id FROM blog_posts WHERE slug = ? LIMIT 1',
      [slug]
    )
    if (dupSlug.length) slug = `${slug}-${Date.now().toString(36)}`

    const status = body.status === 'published' ? 'published' : 'draft'
    const publishedAt =
      status === 'published'
        ? body.published_at || new Date()
        : null

    const result = await query(
      `INSERT INTO blog_posts
         (title, slug, excerpt, content, cover_image, author_id, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.title.trim(),
        slug,
        body.excerpt || null,
        body.content || null,
        body.cover_image || null,
        session.id,
        status,
        publishedAt,
      ]
    )

    const rows = await query(
      'SELECT * FROM blog_posts WHERE id = ?',
      [result.insertId]
    )

    return NextResponse.json(
      { success: true, data: rows[0], message: 'Post created' },
      { status: 201 }
    )
  } catch (err) {
    console.error('POST /api/blog error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to create post' },
      { status: 500 }
    )
  }
}
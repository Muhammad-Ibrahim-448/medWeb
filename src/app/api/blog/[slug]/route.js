// src/app/api/blog/[slug]/route.js
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/* ────────────────────────────────────────────
   GET /api/blog/[slug]
   Public — published posts only. Also accepts
   numeric id when called by admin (with session).
   ──────────────────────────────────────────── */
export async function GET(request, { params }) {
  try {
    const { slug } = await params
    const isNumeric = /^\d+$/.test(slug)

    // Check if the caller is admin (unlocks drafts)
    let isAdmin = false
    try {
      const session = await getSession()
      isAdmin = !!session && session.role === 'admin'
    } catch {
      /* anonymous */
    }

    const where = isNumeric ? 'bp.id = ?' : 'bp.slug = ?'
    const params_ = [slug]

    const rows = await query(
      `SELECT
         bp.id, bp.title, bp.slug, bp.excerpt, bp.content,
         bp.cover_image, bp.status, bp.published_at,
         bp.created_at, bp.updated_at, bp.author_id,
         u.name AS author_name, u.email AS author_email
       FROM blog_posts bp
       LEFT JOIN users u ON u.id = bp.author_id
       WHERE ${where}
       LIMIT 1`,
      params_
    )

    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      )
    }

    const post = rows[0]

    // Non-admins can only see published posts
    if (!isAdmin && post.status !== 'published') {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Related posts (only for published viewing)
    let related = []
    if (post.status === 'published') {
      related = await query(
        `SELECT id, title, slug, excerpt, cover_image, published_at
         FROM blog_posts
         WHERE status = 'published' AND slug != ?
         ORDER BY published_at DESC
         LIMIT 3`,
        [post.slug]
      )
    }

    return NextResponse.json({
      success: true,
      data: post,
      related,
    })
  } catch (err) {
    console.error('GET /api/blog/[slug] error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

/* ────────────────────────────────────────────
   PUT /api/blog/[slug]  (admin only)
   Accepts numeric id OR slug in the URL.
   ──────────────────────────────────────────── */
export async function PUT(request, { params }) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { slug } = await params
    const isNumeric = /^\d+$/.test(slug)

    const existing = await query(
      `SELECT * FROM blog_posts WHERE ${isNumeric ? 'id = ?' : 'slug = ?'} LIMIT 1`,
      [slug]
    )
    if (!existing.length) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      )
    }

    const current = existing[0]
    const body = await request.json()

    const updates = []
    const values = []

    if (body.title !== undefined) {
      updates.push('title = ?')
      values.push(String(body.title).trim())

      // Auto-update slug if title changed and no explicit slug given
      if (body.slug === undefined && body.title !== current.title) {
        let newSlug = slugify(body.title)
        if (!newSlug) newSlug = `post-${Date.now()}`
        const dup = await query(
          'SELECT id FROM blog_posts WHERE slug = ? AND id != ? LIMIT 1',
          [newSlug, current.id]
        )
        if (dup.length) newSlug = `${newSlug}-${Date.now().toString(36)}`
        updates.push('slug = ?')
        values.push(newSlug)
      }
    }

    if (body.slug !== undefined) {
      let newSlug = slugify(body.slug)
      if (newSlug) {
        const dup = await query(
          'SELECT id FROM blog_posts WHERE slug = ? AND id != ? LIMIT 1',
          [newSlug, current.id]
        )
        if (dup.length) newSlug = `${newSlug}-${Date.now().toString(36)}`
        updates.push('slug = ?')
        values.push(newSlug)
      }
    }

    if (body.excerpt !== undefined) {
      updates.push('excerpt = ?')
      values.push(body.excerpt || null)
    }
    if (body.content !== undefined) {
      updates.push('content = ?')
      values.push(body.content || null)
    }
    if (body.cover_image !== undefined) {
      updates.push('cover_image = ?')
      values.push(body.cover_image || null)
    }
    if (body.status !== undefined) {
      const nextStatus = body.status === 'published' ? 'published' : 'draft'
      updates.push('status = ?')
      values.push(nextStatus)

      if (nextStatus === 'published' && !current.published_at) {
        updates.push('published_at = ?')
        values.push(new Date())
      }
    }

    if (!updates.length) {
      return NextResponse.json(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      )
    }

    values.push(current.id)
    await query(
      `UPDATE blog_posts SET ${updates.join(', ')} WHERE id = ?`,
      values
    )

    const rows = await query(
      'SELECT * FROM blog_posts WHERE id = ?',
      [current.id]
    )
    return NextResponse.json({
      success: true,
      data: rows[0],
      message: 'Post updated',
    })
  } catch (err) {
    console.error('PUT /api/blog/[slug] error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to update post' },
      { status: 500 }
    )
  }
}

/* ────────────────────────────────────────────
   DELETE /api/blog/[slug]  (admin only)
   Accepts numeric id OR slug.
   ──────────────────────────────────────────── */
export async function DELETE(request, { params }) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { slug } = await params
    const isNumeric = /^\d+$/.test(slug)

    const existing = await query(
      `SELECT id FROM blog_posts WHERE ${isNumeric ? 'id = ?' : 'slug = ?'} LIMIT 1`,
      [slug]
    )
    if (!existing.length) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      )
    }

    await query('DELETE FROM blog_posts WHERE id = ?', [existing[0].id])
    return NextResponse.json({ success: true, message: 'Post deleted' })
  } catch (err) {
    console.error('DELETE /api/blog/[slug] error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
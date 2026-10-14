// src/app/api/products/admin/route.js
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

/* GET /api/products/admin — list all products including drafts */
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
    const gender = searchParams.get('gender') || ''
    const categoryId = searchParams.get('category') || ''
    const featured = searchParams.get('featured') || ''
    const sort = searchParams.get('sort') || 'newest'

    const where = []
    const params = []

    if (status !== 'all') {
      where.push('p.status = ?')
      params.push(status)
    }
    if (gender) {
      where.push('p.gender = ?')
      params.push(gender)
    }
    if (categoryId) {
      where.push('p.category_id = ?')
      params.push(categoryId)
    }
    if (featured === '1') where.push('p.featured = 1')
    if (featured === '0') where.push('p.featured = 0')

    if (search) {
      where.push(
        '(p.name LIKE ? OR p.sku LIKE ? OR p.short_description LIKE ?)'
      )
      const term = `%${search}%`
      params.push(term, term, term)
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    const orderMap = {
      newest: 'p.created_at DESC',
      oldest: 'p.created_at ASC',
      price_asc: 'p.price ASC',
      price_desc: 'p.price DESC',
      name_asc: 'p.name ASC',
      stock_asc: 'p.stock_quantity ASC',
      popular: 'p.sold_count DESC, p.views_count DESC',
    }
    const orderSql = orderMap[sort] || orderMap.newest

    const countRows = await query(
      `SELECT COUNT(*) AS total FROM products p ${whereSql}`,
      params
    )
    const total = countRows[0]?.total || 0

    const rows = await query(
      `SELECT
         p.id, p.name, p.slug, p.sku, p.price, p.sale_price,
         p.stock_quantity, p.status, p.featured, p.gender,
         p.views_count, p.sold_count, p.created_at, p.updated_at,
         c.name AS category_name, c.slug AS category_slug,
         (SELECT image_url FROM product_images
           WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1)
           AS primary_image
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       ${whereSql}
       ORDER BY ${orderSql}
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )

    // Stats
    const statsRows = await query(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active,
         SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft,
         SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) AS archived,
         SUM(CASE WHEN featured = 1 THEN 1 ELSE 0 END) AS featured,
         SUM(CASE WHEN stock_quantity <= low_stock_threshold THEN 1 ELSE 0 END) AS low_stock,
         COALESCE(SUM(stock_quantity), 0) AS total_stock
       FROM products`
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
    console.error('GET /api/products/admin error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
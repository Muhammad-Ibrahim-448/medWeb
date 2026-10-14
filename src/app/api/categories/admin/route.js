// src/app/api/categories/admin/route.js
import { query } from '@/lib/db'
import { success, error, handleApiError } from '@/lib/api-response'
import { requireAdmin } from '@/lib/auth'

/* GET /api/categories/admin?status=all|active|inactive&gender=&search= */
export async function GET(request) {
  return handleApiError(async () => {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const gender = searchParams.get('gender') || ''
    const search = searchParams.get('search') || ''

    const where = []
    const params = []

    if (status !== 'all') {
      where.push('c.status = ?')
      params.push(status)
    }
    if (gender) {
      where.push('c.gender = ?')
      params.push(gender)
    }
    if (search) {
      where.push('(c.name LIKE ? OR c.slug LIKE ?)')
      const term = `%${search}%`
      params.push(term, term)
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    const rows = await query(
      `SELECT
         c.id, c.name, c.slug, c.description, c.image,
         c.parent_id, c.gender, c.sort_order, c.status,
         c.created_at, c.updated_at,
         p.name AS parent_name,
         (SELECT COUNT(*) FROM products WHERE category_id = c.id) AS product_count
       FROM categories c
       LEFT JOIN categories p ON p.id = c.parent_id
       ${whereSql}
       ORDER BY c.sort_order ASC, c.name ASC`,
      params
    )

    // Stats
    const statsRows = await query(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active,
         SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactive,
         SUM(CASE WHEN gender = 'women' THEN 1 ELSE 0 END) AS women,
         SUM(CASE WHEN gender = 'men' THEN 1 ELSE 0 END) AS men
       FROM categories`
    )

    return success({ items: rows, stats: statsRows[0] || {} })
  })
}
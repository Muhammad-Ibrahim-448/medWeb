// src/app/api/categories/[id]/route.js
import { query } from '@/lib/db'
import { success, error, handleApiError } from '@/lib/api-response'
import { requireAdmin } from '@/lib/auth'
import { slugify } from '@/lib/validation'

export async function GET(_req, { params }) {
  return handleApiError(async () => {
    const { id } = await params
    const rows = await query(
      'SELECT * FROM categories WHERE id = ? LIMIT 1',
      [id]
    )
    if (rows.length === 0) return error('Category not found', 404)
    return success(rows[0])
  })
}

export async function PUT(request, { params }) {
  return handleApiError(async () => {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()

    const existing = await query(
      'SELECT id FROM categories WHERE id = ? LIMIT 1',
      [id]
    )
    if (existing.length === 0) return error('Category not found', 404)

    const fields = []
    const values = []
    const updatable = [
      'name',
      'description',
      'image',
      'parent_id',
      'gender',
      'sort_order',
      'status',
    ]
    for (const key of updatable) {
      if (body[key] !== undefined) {
        fields.push(`${key} = ?`)
        values.push(body[key])
      }
    }
    if (body.slug !== undefined) {
      fields.push('slug = ?')
      values.push(slugify(body.slug))
    }
    if (fields.length === 0) return error('No fields to update', 400)

    values.push(id)
    await query(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      values
    )

    const rows = await query('SELECT * FROM categories WHERE id = ?', [id])
    return success(rows[0], 'Category updated successfully')
  })
}

export async function DELETE(_req, { params }) {
  return handleApiError(async () => {
    await requireAdmin()
    const { id } = await params

    const existing = await query(
      'SELECT id FROM categories WHERE id = ? LIMIT 1',
      [id]
    )
    if (existing.length === 0) return error('Category not found', 404)

    // Reparent children to top-level instead of orphaning them
    await query('UPDATE categories SET parent_id = NULL WHERE parent_id = ?', [
      id,
    ])
    // Unlink products
    await query('UPDATE products SET category_id = NULL WHERE category_id = ?', [
      id,
    ])
    await query('DELETE FROM categories WHERE id = ?', [id])
    return success(null, 'Category deleted successfully')
  })
}
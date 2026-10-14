// src/app/api/products/admin/[id]/route.js
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
    const isNumeric = /^\d+$/.test(id)

    const rows = await query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE ${isNumeric ? 'p.id = ?' : 'p.slug = ?'}
       LIMIT 1`,
      [id]
    )

    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    const product = rows[0]

    product.images = await query(
      `SELECT id, image_url, alt_text, is_primary, sort_order
       FROM product_images
       WHERE product_id = ?
       ORDER BY is_primary DESC, sort_order ASC`,
      [product.id]
    )

    return NextResponse.json({ success: true, data: product })
  } catch (err) {
    console.error('GET /api/products/admin/[id] error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
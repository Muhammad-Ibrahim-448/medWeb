// src/app/api/collections/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const rows = await query(
      `SELECT
         c.id,
         c.name,
         c.slug,
         c.description,
         c.image,
         c.gender,
         c.sort_order,
         (SELECT COUNT(*) FROM products p
           WHERE p.category_id = c.id AND p.status = 'active') AS product_count,
         (SELECT image_url FROM product_images pi
           JOIN products p2 ON p2.id = pi.product_id
           WHERE p2.category_id = c.id AND p2.status = 'active'
           ORDER BY pi.is_primary DESC, pi.sort_order ASC
           LIMIT 1) AS cover_image
       FROM categories c
       WHERE c.status = 'active'
       ORDER BY c.sort_order ASC, c.name ASC`
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (err) {
    console.error('GET /api/collections error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}
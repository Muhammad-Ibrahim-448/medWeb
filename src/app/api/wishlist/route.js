// src/app/api/wishlist/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

// ────────────────────────────────────────────────────────────
// GET /api/wishlist — list current user's wishlist
// ────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rows = await query(
      `SELECT
         w.id            AS wishlist_id,
         w.created_at    AS added_at,
         p.id,
         p.name,
         p.slug,
         p.sku,
         p.price,
         p.sale_price,
         p.stock_quantity,
         p.gender,
         p.featured,
         p.stone,
         p.short_description,
         c.name          AS category_name,
         (SELECT image_url FROM product_images
           WHERE product_id = p.id
           ORDER BY is_primary DESC, sort_order ASC
           LIMIT 1)      AS primary_image
       FROM wishlist_items w
       JOIN products p   ON p.id = w.product_id
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE w.user_id = ? AND p.status = 'active'
       ORDER BY w.created_at DESC`,
      [session.id]
    );

    return NextResponse.json({
      success: true,
      data: rows,
      total: rows.length,
    });
  } catch (err) {
    console.error('GET /api/wishlist error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// ────────────────────────────────────────────────────────────
// POST /api/wishlist — add product to wishlist
// Body: { productId: number }
// ────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Please login to add to wishlist' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const productId = Number(body?.productId);

    if (!productId || Number.isNaN(productId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Ensure product exists & is active
    const productRows = await query(
      `SELECT id FROM products WHERE id = ? AND status = 'active' LIMIT 1`,
      [productId]
    );
    if (productRows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Insert (ignore if already exists)
    await query(
      `INSERT INTO wishlist_items (user_id, product_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE created_at = created_at`,
      [session.id, productId]
    );

    return NextResponse.json({
      success: true,
      message: 'Added to wishlist',
      data: { productId, wishlisted: true },
    });
  } catch (err) {
    console.error('POST /api/wishlist error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

// ────────────────────────────────────────────────────────────
// DELETE /api/wishlist — clear entire wishlist
// ────────────────────────────────────────────────────────────
export async function DELETE() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await query(`DELETE FROM wishlist_items WHERE user_id = ?`, [session.id]);

    return NextResponse.json({
      success: true,
      message: 'Wishlist cleared',
    });
  } catch (err) {
    console.error('DELETE /api/wishlist error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to clear wishlist' },
      { status: 500 }
    );
  }
}
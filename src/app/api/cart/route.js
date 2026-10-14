// src/app/api/cart/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

const MAX_QTY = 10; // per-item cap

/* ────────────────────────────────────────────────────────────
   GET /api/cart — list current user's cart with product info
   ──────────────────────────────────────────────────────────── */
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
         ci.id            AS cart_item_id,
         ci.quantity,
         ci.created_at,
         ci.updated_at,
         p.id             AS product_id,
         p.name,
         p.slug,
         p.sku,
         p.price,
         p.sale_price,
         p.stock_quantity,
         p.status         AS product_status,
         p.gender,
         c.name           AS category_name,
         (SELECT image_url FROM product_images
           WHERE product_id = p.id
           ORDER BY is_primary DESC, sort_order ASC
           LIMIT 1)       AS primary_image
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE ci.user_id = ?
       ORDER BY ci.created_at DESC`,
      [session.id]
    );

    const items = rows.map((r) => {
      const unitPrice = Number(r.sale_price ?? r.price);
      return {
        ...r,
        price: Number(r.price),
        sale_price: r.sale_price != null ? Number(r.sale_price) : null,
        unit_price: unitPrice,
        line_total: unitPrice * Number(r.quantity),
        in_stock: r.product_status === 'active' && Number(r.stock_quantity) > 0,
      };
    });

    const subtotal = items.reduce(
      (sum, i) => sum + (i.in_stock ? i.line_total : 0),
      0
    );
    const totalItems = items.reduce((sum, i) => sum + Number(i.quantity), 0);

    return NextResponse.json({
      success: true,
      data: {
        items,
        subtotal,
        totalItems,
      },
    });
  } catch (err) {
    console.error('GET /api/cart error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

/* ────────────────────────────────────────────────────────────
   POST /api/cart — add product to cart
   Body: { productId: number, quantity?: number }
   Upserts into cart_items
   ──────────────────────────────────────────────────────────── */
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Please login to add to cart' },
        { status: 401 }
      );
    }

    let body = null;
    try {
      body = await request.json();
    } catch {
      body = null;
    }

    const productId = Number(body?.productId);
    const quantity = Math.max(1, Math.min(MAX_QTY, Number(body?.quantity) || 1));

    if (!productId || Number.isNaN(productId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Ensure product exists, active, and in stock
    const productRows = await query(
      `SELECT id, stock_quantity, status
       FROM products
       WHERE id = ? LIMIT 1`,
      [productId]
    );
    if (productRows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    const product = productRows[0];
    if (product.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'Product is not available' },
        { status: 400 }
      );
    }
    if (Number(product.stock_quantity) < 1) {
      return NextResponse.json(
        { success: false, message: 'Product is out of stock' },
        { status: 400 }
      );
    }

    // Fetch current qty (if any) to enforce stock limit
    const existing = await query(
      `SELECT id, quantity FROM cart_items
       WHERE user_id = ? AND product_id = ? LIMIT 1`,
      [session.id, productId]
    );

    const currentQty = existing.length ? Number(existing[0].quantity) : 0;
    const desiredQty = Math.min(
      MAX_QTY,
      Math.min(Number(product.stock_quantity), currentQty + quantity)
    );

    if (desiredQty <= currentQty) {
      return NextResponse.json({
        success: true,
        message: 'Cart already at maximum available quantity',
        data: { productId, quantity: currentQty },
      });
    }

    await query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`,
      [session.id, productId, desiredQty]
    );

    return NextResponse.json({
      success: true,
      message: 'Added to cart',
      data: { productId, quantity: desiredQty },
    });
  } catch (err) {
    console.error('POST /api/cart error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

/* ────────────────────────────────────────────────────────────
   DELETE /api/cart — clear entire cart
   ──────────────────────────────────────────────────────────── */
export async function DELETE() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await query(`DELETE FROM cart_items WHERE user_id = ?`, [session.id]);

    return NextResponse.json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (err) {
    console.error('DELETE /api/cart error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
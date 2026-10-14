// src/app/api/cart/[productId]/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

const MAX_QTY = 10;

/* ────────────────────────────────────────────────────────────
   PUT /api/cart/[productId] — update quantity
   Body: { quantity: number }   (0 → remove, or use DELETE)
   ──────────────────────────────────────────────────────────── */
export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId } = await params;
    const pid = Number(productId);
    if (!pid || Number.isNaN(pid)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      );
    }

    let body = null;
    try {
      body = await request.json();
    } catch {
      body = null;
    }

    const quantity = Math.floor(Number(body?.quantity));

    if (Number.isNaN(quantity) || quantity < 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid quantity' },
        { status: 400 }
      );
    }

    // quantity = 0 → remove
    if (quantity === 0) {
      await query(
        `DELETE FROM cart_items WHERE user_id = ? AND product_id = ?`,
        [session.id, pid]
      );
      return NextResponse.json({
        success: true,
        message: 'Removed from cart',
        data: { productId: pid, quantity: 0 },
      });
    }

    // Check stock
    const productRows = await query(
      `SELECT stock_quantity, status FROM products WHERE id = ? LIMIT 1`,
      [pid]
    );
    if (productRows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    const product = productRows[0];
    const maxAllowed = Math.min(MAX_QTY, Number(product.stock_quantity));

    if (maxAllowed < 1) {
      return NextResponse.json(
        { success: false, message: 'Product is out of stock' },
        { status: 400 }
      );
    }

    const finalQty = Math.min(quantity, maxAllowed);

    const result = await query(
      `UPDATE cart_items SET quantity = ?
       WHERE user_id = ? AND product_id = ?`,
      [finalQty, session.id, pid]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Item not in cart' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Quantity updated',
      data: { productId: pid, quantity: finalQty },
    });
  } catch (err) {
    console.error('PUT /api/cart/[productId] error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to update quantity' },
      { status: 500 }
    );
  }
}

/* ────────────────────────────────────────────────────────────
   DELETE /api/cart/[productId] — remove one item
   ──────────────────────────────────────────────────────────── */
export async function DELETE(_req, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId } = await params;
    const pid = Number(productId);
    if (!pid || Number.isNaN(pid)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const result = await query(
      `DELETE FROM cart_items WHERE user_id = ? AND product_id = ?`,
      [session.id, pid]
    );

    return NextResponse.json({
      success: true,
      message: result.affectedRows > 0 ? 'Removed from cart' : 'Not in cart',
      data: { productId: pid },
    });
  } catch (err) {
    console.error('DELETE /api/cart/[productId] error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}
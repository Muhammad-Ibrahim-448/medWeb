// src/app/api/wishlist/[productId]/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

// ────────────────────────────────────────────────────────────
// DELETE /api/wishlist/[productId] — remove one item
// ────────────────────────────────────────────────────────────
export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Next 16 → params is a Promise
    const { productId } = await params;
    const pid = Number(productId);

    if (!pid || Number.isNaN(pid)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const result = await query(
      `DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?`,
      [session.id, pid]
    );

    return NextResponse.json({
      success: true,
      message: result.affectedRows > 0 ? 'Removed from wishlist' : 'Not in wishlist',
      data: { productId: pid, wishlisted: false },
    });
  } catch (err) {
    console.error('DELETE /api/wishlist/[productId] error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}
// src/app/api/orders/route.js
import { NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db';
import { getSession } from '@/lib/auth';

/* ────────────────────────────────────────────────────────────
   Helper: generate order number SJ-YYYYMMDD-XXXX
   ──────────────────────────────────────────────────────────── */
function generateOrderNumber() {
  const d = new Date();
  const ymd =
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SJ-${ymd}-${rand}`;
}


export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orders = await query(
      `SELECT id, order_number, total, payment_method, payment_status,
              order_status, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [session.id]
    );

    return NextResponse.json({ success: true, data: orders });
  } catch (err) {
    console.error('GET /api/orders error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

/* ────────────────────────────────────────────────────────────
   POST /api/orders — create a new order (Cash on Delivery only)
   Body: { shipping: { fullName, phone, address1, address2, city, state, postalCode, country }, notes? }
   Uses the current user's cart as the source of items.
   ──────────────────────────────────────────────────────────── */
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Please login to place an order' },
        { status: 401 }
      );
    }

    let body = null;
    try {
      body = await request.json();
    } catch {
      body = null;
    }

    const shipping = body?.shipping || {};
    const notes = (body?.notes || '').toString().slice(0, 1000);

    // Validate shipping fields
    const required = ['fullName', 'phone', 'address1', 'city'];
    for (const key of required) {
      if (!shipping[key] || !String(shipping[key]).trim()) {
        return NextResponse.json(
          { success: false, message: `Missing shipping field: ${key}` },
          { status: 400 }
        );
      }
    }

    // Fetch cart items (with product info)
    const cartRows = await query(
      `SELECT
         ci.product_id,
         ci.quantity,
         p.name,
         p.sku,
         p.price,
         p.sale_price,
         p.stock_quantity,
         p.status AS product_status,
         (SELECT image_url FROM product_images
           WHERE product_id = p.id
           ORDER BY is_primary DESC, sort_order ASC
           LIMIT 1) AS primary_image
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = ?`,
      [session.id]
    );

    if (cartRows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Your cart is empty' },
        { status: 400 }
      );
    }

    // Validate stock and compute totals
    let subtotal = 0;
    const lineItems = [];

    for (const row of cartRows) {
      if (row.product_status !== 'active') {
        return NextResponse.json(
          { success: false, message: `"${row.name}" is no longer available` },
          { status: 400 }
        );
      }
      const qty = Number(row.quantity);
      if (Number(row.stock_quantity) < qty) {
        return NextResponse.json(
          {
            success: false,
            message: `"${row.name}" only has ${row.stock_quantity} in stock`,
          },
          { status: 400 }
        );
      }
      const unitPrice = Number(row.sale_price ?? row.price);
      const lineTotal = unitPrice * qty;
      subtotal += lineTotal;
      lineItems.push({
        product_id: row.product_id,
        product_name: row.name,
        product_sku: row.sku,
        product_image: row.primary_image,
        product_price: unitPrice,
        quantity: qty,
        subtotal: lineTotal,
      });
    }

    // Shipping: free above threshold, flat otherwise
    const FREE_THRESHOLD = Number(
      process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || 5000
    );
    const FLAT_SHIPPING = Number(process.env.NEXT_PUBLIC_SHIPPING_FEE || 250);
    const shippingFee =
      subtotal >= FREE_THRESHOLD ? 0 : FLAT_SHIPPING;
    const total = subtotal + shippingFee;

    const orderNumber = generateOrderNumber();

    // Insert order + items + decrement stock inside a transaction
    const orderId = await transaction(async (conn) => {
      const [orderResult] = await conn.execute(
        `INSERT INTO orders (
           order_number, user_id,
           customer_name, customer_email, customer_phone,
           shipping_full_name, shipping_phone,
           shipping_address1, shipping_address2,
           shipping_city, shipping_state, shipping_postal_code, shipping_country,
           subtotal, shipping_fee, discount_amount, total,
           payment_method, payment_status, order_status,
           notes
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 'cod', 'pending', 'pending', ?)`,
        [
          orderNumber,
          session.id,
          session.name,
          session.email,
          shipping.phone,
          shipping.fullName,
          shipping.phone,
          shipping.address1,
          shipping.address2 || null,
          shipping.city,
          shipping.state || null,
          shipping.postalCode || null,
          shipping.country || 'Pakistan',
          subtotal,
          shippingFee,
          total,
          notes || null,
        ]
      );

      const newOrderId = orderResult.insertId;

      for (const item of lineItems) {
        await conn.execute(
          `INSERT INTO order_items (
             order_id, product_id, product_name, product_sku,
             product_image, product_price, quantity, subtotal
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newOrderId,
            item.product_id,
            item.product_name,
            item.product_sku,
            item.product_image,
            item.product_price,
            item.quantity,
            item.subtotal,
          ]
        );

        // Decrement stock
        await conn.execute(
          `UPDATE products
             SET stock_quantity = stock_quantity - ?,
                 sold_count     = sold_count + ?
           WHERE id = ?`,
          [item.quantity, item.quantity, item.product_id]
        );

        // Inventory log
        await conn.execute(
          `INSERT INTO inventory_logs (
             product_id, change_type, quantity_change,
             previous_stock, new_stock, reference_id, note, created_by
           )
           SELECT id, 'order', -?, stock_quantity + ?, stock_quantity, ?, ?, ?
           FROM products WHERE id = ?`,
          [
            item.quantity,
            item.quantity,
            newOrderId,
            `Order ${orderNumber}`,
            session.id,
            item.product_id,
          ]
        );
      }

      // Clear the cart
      await conn.execute(`DELETE FROM cart_items WHERE user_id = ?`, [
        session.id,
      ]);

      return newOrderId;
    });

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId,
        orderNumber,
        subtotal,
        shippingFee,
        total,
      },
    });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to place order' },
      { status: 500 }
    );
  }
}
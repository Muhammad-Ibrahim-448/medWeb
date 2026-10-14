// src/app/api/collections/[slug]/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { collectionFilter, COLLECTIONS } from '@/lib/collections';

const ALLOWED_SORTS = {
  newest: 'p.created_at DESC',
  price_asc: 'COALESCE(p.sale_price, p.price) ASC',
  price_desc: 'COALESCE(p.sale_price, p.price) DESC',
  popular: 'p.sold_count DESC, p.views_count DESC',
  name_asc: 'p.name ASC',
};

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    if (!COLLECTIONS[slug]) {
      return NextResponse.json(
        { success: false, message: 'Collection not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'newest';
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(48, Math.max(1, Number(searchParams.get('limit')) || 12));
    const offset = (page - 1) * limit;
    const gender = searchParams.get('gender'); // 'men' | 'women' | null

    const { where, params: whereParams } = collectionFilter(slug);

    // Optional gender filter
    let genderClause = '';
    const allParams = [...whereParams];
    if (gender === 'men' || gender === 'women') {
      genderClause = ` AND (p.gender = ? OR p.gender = 'unisex')`;
      allParams.push(gender);
    }

    const orderBy = ALLOWED_SORTS[sort] || ALLOWED_SORTS.newest;

    // Fetch products
    const products = await query(
      `SELECT
         p.id, p.name, p.slug, p.sku,
         p.price, p.sale_price,
         p.stock_quantity, p.status,
         p.gender, p.material, p.stone,
         p.featured, p.sold_count,
         c.name AS category_name, c.slug AS category_slug,
         (SELECT image_url FROM product_images pi
           WHERE pi.product_id = p.id
           ORDER BY pi.is_primary DESC, pi.sort_order ASC
           LIMIT 1) AS primary_image
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.status = 'active'
         AND ${where}${genderClause}
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [...allParams, limit, offset]
    );

    // Count total for pagination
    const countRows = await query(
      `SELECT COUNT(*) AS total
       FROM products p
       WHERE p.status = 'active'
         AND ${where}${genderClause}`,
      allParams
    );
    const total = Number(countRows[0]?.total || 0);

    // Normalize
    const normalized = products.map((r) => {
      const unitPrice = Number(r.sale_price ?? r.price);
      return {
        ...r,
        price: Number(r.price),
        sale_price: r.sale_price != null ? Number(r.sale_price) : null,
        unit_price: unitPrice,
        in_stock: Number(r.stock_quantity) > 0,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        collection: COLLECTIONS[slug],
        products: normalized,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error('GET /api/collections/[slug] error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch collection' },
      { status: 500 }
    );
  }
}
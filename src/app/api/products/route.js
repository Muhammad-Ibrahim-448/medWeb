// src/app/api/products/route.js
import { query } from '@/lib/db';
import { success, error, paginated, handleApiError } from '@/lib/api-response';
import { requireAdmin } from '@/lib/auth';
import { validate, slugify } from '@/lib/validation';

/* GET /api/products
   ?page=1&limit=20&search=ring&category=1&gender=women
   &minPrice=0&maxPrice=500000&sort=newest|price_asc|price_desc|popular
   &featured=1&status=active
*/
export async function GET(request) {
  return handleApiError(async () => {
    const { searchParams } = new URL(request.url);
    const page     = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit    = Math.min(100, Number(searchParams.get('limit')) || 20);
    const offset   = (page - 1) * limit;
    const search   = searchParams.get('search');
    const category = searchParams.get('category');
    const gender   = searchParams.get('gender');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured');
    const status   = searchParams.get('status') || 'active';
    const sort     = searchParams.get('sort') || 'newest';
    const isAdmin  = searchParams.get('admin') === '1';

    const where = [];
    const params = [];

    if (!isAdmin) {
      where.push('p.status = ?');
      params.push('active');
    } else if (status) {
      where.push('p.status = ?');
      params.push(status);
    }

    if (search) {
      where.push('(p.name LIKE ? OR p.sku LIKE ? OR p.short_description LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    if (category) { where.push('p.category_id = ?'); params.push(category); }
    if (gender)   { where.push('p.gender = ?');      params.push(gender); }
    if (minPrice) { where.push('p.price >= ?');      params.push(minPrice); }
    if (maxPrice) { where.push('p.price <= ?');      params.push(maxPrice); }
    if (featured === '1') { where.push('p.featured = 1'); }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const orderMap = {
      newest:     'p.created_at DESC',
      price_asc:  'p.price ASC',
      price_desc: 'p.price DESC',
      popular:    'p.sold_count DESC, p.views_count DESC',
      name_asc:   'p.name ASC',
    };
    const orderSql = orderMap[sort] || orderMap.newest;

    const countRows = await query(
      `SELECT COUNT(*) AS total FROM products p ${whereSql}`,
      params
    );
    const total = countRows[0].total;

    const rows = await query(
      `SELECT
         p.*,
         c.name AS category_name,
         c.slug AS category_slug,
         (SELECT image_url FROM product_images
           WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) AS primary_image
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       ${whereSql}
       ORDER BY ${orderSql}
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return paginated(rows, page, limit, total);
  });
}

/* POST /api/products (admin only) */
export async function POST(request) {
  return handleApiError(async () => {
    await requireAdmin();
    const body = await request.json();

    validate(body, {
      name:  { required: true, maxLength: 255 },
      sku:   { required: true, maxLength: 100 },
      price: { required: true, type: 'number', min: 0 },
    });

    const slug = body.slug ? slugify(body.slug) : slugify(body.name);

    const dup = await query(
      'SELECT id FROM products WHERE slug = ? OR sku = ? LIMIT 1',
      [slug, body.sku]
    );
    if (dup.length > 0) {
      return error('Product with this slug or SKU already exists', 409);
    }

    const result = await query(
      `INSERT INTO products
        (name, slug, sku, category_id, description, short_description,
         price, sale_price, cost_price, stock_quantity, low_stock_threshold,
         material, weight, size, stone, gender, featured, status,
         meta_title, meta_description)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        body.name, slug, body.sku, body.category_id || null,
        body.description || null, body.short_description || null,
        body.price, body.sale_price || null, body.cost_price || null,
        body.stock_quantity || 0, body.low_stock_threshold || 5,
        body.material || null, body.weight || null, body.size || null,
        body.stone || null, body.gender || 'unisex',
        body.featured ? 1 : 0, body.status || 'draft',
        body.meta_title || null, body.meta_description || null,
      ]
    );

    if (Array.isArray(body.images) && body.images.length > 0) {
      for (let i = 0; i < body.images.length; i++) {
        const img = body.images[i];
        await query(
          `INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
           VALUES (?, ?, ?, ?, ?)`,
          [
            result.insertId,
            img.url,
            img.alt || body.name,
            img.is_primary ? 1 : 0,
            i + 1,
          ]
        );
      }
    }

    const rows = await query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    return success(rows[0], 'Product created successfully', 201);
  });
}
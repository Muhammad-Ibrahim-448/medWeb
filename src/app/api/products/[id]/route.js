import { query } from '@/lib/db';
import { success, error, handleApiError } from '@/lib/api-response';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/validation';

/* GET by numeric id OR by slug */
export async function GET(_req, { params }) {
  return handleApiError(async () => {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);

    const rows = await query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE ${isNumeric ? 'p.id = ?' : 'p.slug = ?'}
       LIMIT 1`,
      [id]
    );
    if (rows.length === 0) return error('Product not found', 404);

    const product = rows[0];
    product.images = await query(
      'SELECT id, image_url, alt_text, is_primary, sort_order FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC',
      [product.id]
    );

    // Increment views (non-blocking)
    query('UPDATE products SET views_count = views_count + 1 WHERE id = ?', [product.id]).catch(() => {});

    return success(product);
  });
}

export async function PUT(request, { params }) {
  return handleApiError(async () => {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const existing = await query('SELECT id FROM products WHERE id = ? LIMIT 1', [id]);
    if (existing.length === 0) return error('Product not found', 404);

    const fields = [];
    const values = [];
    const updatable = [
      'name','sku','category_id','description','short_description',
      'price','sale_price','cost_price','stock_quantity','low_stock_threshold',
      'material','weight','size','stone','gender','featured','status',
      'meta_title','meta_description',
    ];
    for (const key of updatable) {
      if (body[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(key === 'featured' ? (body[key] ? 1 : 0) : body[key]);
      }
    }
    if (body.slug !== undefined) { fields.push('slug = ?'); values.push(slugify(body.slug)); }
    if (fields.length === 0) return error('No fields to update', 400);

    values.push(id);
    await query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);

    // Replace images if provided
    if (Array.isArray(body.images)) {
      await query('DELETE FROM product_images WHERE product_id = ?', [id]);
      for (let i = 0; i < body.images.length; i++) {
        const img = body.images[i];
        await query(
          `INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
           VALUES (?, ?, ?, ?, ?)`,
          [id, img.url, img.alt || body.name || '', img.is_primary ? 1 : 0, i + 1]
        );
      }
    }

    const rows = await query('SELECT * FROM products WHERE id = ?', [id]);
    return success(rows[0], 'Product updated successfully');
  });
}

export async function DELETE(_req, { params }) {
  return handleApiError(async () => {
    await requireAdmin();
    const { id } = await params;

    const existing = await query('SELECT id FROM products WHERE id = ? LIMIT 1', [id]);
    if (existing.length === 0) return error('Product not found', 404);

    // Soft-delete to preserve order history
    await query('UPDATE products SET status = "archived" WHERE id = ?', [id]);
    return success(null, 'Product archived successfully');
  });
}
import { query } from '@/lib/db';
import { success, error, handleApiError } from '@/lib/api-response';
import { requireAdmin } from '@/lib/auth';
import { validate, slugify } from '@/lib/validation';

/* GET /api/categories?gender=women&status=active */
export async function GET(request) {
  return handleApiError(async () => {
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender');
    const status = searchParams.get('status') || 'active';

    let sql = 'SELECT * FROM categories WHERE status = ?';
    const params = [status];
    if (gender) { sql += ' AND gender = ?'; params.push(gender); }
    sql += ' ORDER BY sort_order ASC, name ASC';

    const rows = await query(sql, params);
    return success(rows);
  });
}

/* POST /api/categories (admin only) */
export async function POST(request) {
  return handleApiError(async () => {
    await requireAdmin();
    const body = await request.json();

    validate(body, {
      name:   { required: true, maxLength: 150 },
      gender: { required: true },
    });

    const slug = body.slug ? slugify(body.slug) : slugify(body.name);
    const existing = await query('SELECT id FROM categories WHERE slug = ? LIMIT 1', [slug]);
    if (existing.length > 0) return error('Category slug already exists', 409);

    const result = await query(
      `INSERT INTO categories (name, slug, description, image, parent_id, gender, sort_order, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.name,
        slug,
        body.description || null,
        body.image || null,
        body.parent_id || null,
        body.gender,
        body.sort_order || 0,
        body.status || 'active',
      ]
    );

    const rows = await query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    return success(rows[0], 'Category created successfully', 201);
  });
}
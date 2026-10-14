// src/app/api/contact/route.js
import { query } from '@/lib/db';
import { success, error, paginated, handleApiError } from '@/lib/api-response';
import { requireAdmin } from '@/lib/auth';
import { validate } from '@/lib/validation';

/* ------------------------------------------------------------------ */
/* POST /api/contact — public                                          */
/* ------------------------------------------------------------------ */
export async function POST(request) {
  return handleApiError(async () => {
    const body = await request.json();

    validate(body, {
      name:    { required: true, maxLength: 150, minLength: 2 },
      email:   { required: true, email: true, maxLength: 255 },
      message: { required: true, minLength: 10, maxLength: 5000 },
      phone:   { maxLength: 50 },
      subject: { maxLength: 255 },
    });

    // Basic spam guard: reject if same email sent > 5 messages in last hour
    const recent = await query(
      `SELECT COUNT(*) AS c FROM contact_messages
       WHERE email = ? AND created_at > (NOW() - INTERVAL 1 HOUR)`,
      [body.email]
    );
    if (recent[0].c >= 5) {
      return error('Too many messages from this email. Please try again later.', 429);
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      null;
    const ua = request.headers.get('user-agent')?.slice(0, 500) || null;

    const result = await query(
      `INSERT INTO contact_messages
        (name, email, phone, subject, message, ip_address, user_agent, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'new')`,
      [
        body.name.trim(),
        body.email.trim().toLowerCase(),
        body.phone?.trim() || null,
        body.subject?.trim() || null,
        body.message.trim(),
        ip,
        ua,
      ]
    );

    // OPTIONAL: send email notification here (see section 8)

    const rows = await query(
      'SELECT id, name, email, subject, status, created_at FROM contact_messages WHERE id = ?',
      [result.insertId]
    );

    return success(rows[0], 'Message sent successfully. We will get back to you soon.', 201);
  });
}

/* ------------------------------------------------------------------ */
/* GET /api/contact — admin only                                       */
/* ?page=1&limit=20&status=new&search=john                             */
/* ------------------------------------------------------------------ */
export async function GET(request) {
  return handleApiError(async () => {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page   = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit  = Math.min(100, Number(searchParams.get('limit')) || 20);
    const offset = (page - 1) * limit;
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where = [];
    const params = [];

    if (status) { where.push('status = ?'); params.push(status); }
    if (search) {
      where.push('(name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const countRows = await query(
      `SELECT COUNT(*) AS total FROM contact_messages ${whereSql}`,
      params
    );
    const total = countRows[0].total;

    const rows = await query(
      `SELECT id, name, email, phone, subject, message, status,
              replied_at, created_at, updated_at
       FROM contact_messages
       ${whereSql}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return paginated(rows, page, limit, total);
  });
}
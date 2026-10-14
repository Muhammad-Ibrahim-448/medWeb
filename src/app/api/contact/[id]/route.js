// src/app/api/contact/[id]/route.js
import { query } from '@/lib/db';
import { success, error, handleApiError } from '@/lib/api-response';
import { requireAdmin } from '@/lib/auth';

const ALLOWED_STATUS = ['new', 'read', 'replied', 'archived', 'spam'];

/* GET /api/contact/[id] — admin */
export async function GET(_req, { params }) {
  return handleApiError(async () => {
    await requireAdmin();
    const { id } = await params;

    const rows = await query('SELECT * FROM contact_messages WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) return error('Message not found', 404);

    return success(rows[0]);
  });
}

/* PUT /api/contact/[id] — admin */
export async function PUT(request, { params }) {
  return handleApiError(async () => {
    const session = await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const existing = await query('SELECT id FROM contact_messages WHERE id = ? LIMIT 1', [id]);
    if (existing.length === 0) return error('Message not found', 404);

    const fields = [];
    const values = [];

    if (body.status !== undefined) {
      if (!ALLOWED_STATUS.includes(body.status)) {
        return error(`status must be one of: ${ALLOWED_STATUS.join(', ')}`, 422);
      }
      fields.push('status = ?');
      values.push(body.status);

      if (body.status === 'replied') {
        fields.push('replied_at = NOW()');
        fields.push('replied_by = ?');
        values.push(session.id);
      }
    }

    if (body.admin_notes !== undefined) {
      fields.push('admin_notes = ?');
      values.push(body.admin_notes);
    }

    if (fields.length === 0) return error('No fields to update', 400);

    values.push(id);
    await query(`UPDATE contact_messages SET ${fields.join(', ')} WHERE id = ?`, values);

    const rows = await query('SELECT * FROM contact_messages WHERE id = ?', [id]);
    return success(rows[0], 'Message updated');
  });
}

/* DELETE /api/contact/[id] — admin (soft delete to 'archived') */
export async function DELETE(_req, { params }) {
  return handleApiError(async () => {
    await requireAdmin();
    const { id } = await params;

    const existing = await query('SELECT id FROM contact_messages WHERE id = ? LIMIT 1', [id]);
    if (existing.length === 0) return error('Message not found', 404);

    await query("UPDATE contact_messages SET status = 'archived' WHERE id = ?", [id]);
    return success(null, 'Message archived');
  });
}
import { NextResponse } from 'next/server';

export function success(data = null, message = 'Success', status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function error(message = 'Something went wrong', status = 400, details = null) {
  return NextResponse.json({ success: false, message, ...(details && { details }) }, { status });
}

export function paginated(data, page, limit, total) {
  return NextResponse.json({
    success: true,
    message: 'Success',
    data,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: Number(total),
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function handleApiError(fn) {
  try {
    return await fn();
  } catch (err) {
    console.error('[API_ERROR]', err);
    if (err.name === 'UnauthorizedError') return error(err.message, 401);
    if (err.name === 'ForbiddenError')    return error(err.message, 403);
    if (err.name === 'NotFoundError')     return error(err.message, 404);
    if (err.name === 'ValidationError')   return error(err.message, 422);
    return error(err.message || 'Internal server error', 500);
  }
}
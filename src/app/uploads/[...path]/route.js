// src/app/uploads/[...path]/route.js
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UPLOAD_ROOT = path.join(process.cwd(), 'data', 'uploads')

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
}

export async function GET(_req, { params }) {
  const { path: parts } = await params
  const rel = Array.isArray(parts) ? parts.join('/') : String(parts || '')

  // Resolve and confirm the path stays inside UPLOAD_ROOT
  const abs = path.resolve(UPLOAD_ROOT, rel)
  const rootWithSep = UPLOAD_ROOT.endsWith(path.sep)
    ? UPLOAD_ROOT
    : UPLOAD_ROOT + path.sep

  if (!abs.startsWith(rootWithSep)) {
    return new NextResponse('Not found', { status: 404 })
  }

  try {
    const data = await fs.readFile(abs)
    const ext = path.extname(abs).toLowerCase()
    return new NextResponse(data, {
      headers: {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
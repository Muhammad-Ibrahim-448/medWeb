// src/app/api/uploads/delete/route.js
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { getSession } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UPLOAD_ROOT = path.join(process.cwd(), 'data', 'uploads')

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { url } = await request.json()
    if (!url || typeof url !== 'string' || !url.startsWith('/uploads/')) {
      return NextResponse.json(
        { success: false, message: 'Invalid image URL' },
        { status: 400 }
      )
    }

    // "/uploads/products/abc.png" → "products/abc.png"
    const rel = url.replace(/^\/uploads\//, '')

    // Resolve against UPLOAD_ROOT and confirm the result stays inside it.
    const abs = path.resolve(UPLOAD_ROOT, rel)
    const rootWithSep = UPLOAD_ROOT.endsWith(path.sep)
      ? UPLOAD_ROOT
      : UPLOAD_ROOT + path.sep

    if (!abs.startsWith(rootWithSep)) {
      return NextResponse.json(
        { success: false, message: 'Invalid path' },
        { status: 400 }
      )
    }

    await fs.unlink(abs).catch(() => {})
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/uploads/delete error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
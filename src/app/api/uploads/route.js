// src/app/api/uploads/route.js
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'
import { getSession } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Uploads live OUTSIDE public/ so runtime-added files are always served
// by the route handler at src/app/uploads/[...path]/route.js
const UPLOAD_ROOT = path.join(process.cwd(), 'data', 'uploads')

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
])

const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const MAX_FILES = 8

const ALLOWED_BUCKETS = ['products', 'categories', 'banners', 'users']

/* POST /api/uploads
   multipart/form-data:
     bucket: "products" | "categories" | "banners" | "users"
     files:  File[]
*/
export async function POST(req) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin privileges required' },
        { status: 403 }
      )
    }

    // Parse multipart/form-data with the native Web API.
    // Works identically in dev, `next build && next start`, and Docker.
    let formData
    try {
      formData = await req.formData()
    } catch (err) {
      console.error('POST /api/uploads formData parse error:', err)
      return NextResponse.json(
        { success: false, message: 'Failed to parse upload' },
        { status: 400 }
      )
    }

    const rawBucket = String(formData.get('bucket') || 'products').toLowerCase()
    const bucket = ALLOWED_BUCKETS.includes(rawBucket) ? rawBucket : 'products'

    // formData.getAll('files') returns File[] (or Blob[] in edge cases).
    const files = formData
      .getAll('files')
      .filter(
        (f) =>
          f &&
          typeof f === 'object' &&
          typeof f.arrayBuffer === 'function' &&
          typeof f.type === 'string'
      )

    if (!files.length) {
      return NextResponse.json(
        { success: false, message: 'No files were uploaded' },
        { status: 400 }
      )
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, message: `You can upload up to ${MAX_FILES} files at once` },
        { status: 400 }
      )
    }

    const destDir = path.join(UPLOAD_ROOT, bucket)
    await fs.mkdir(destDir, { recursive: true })

    const uploaded = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Mime allow-list check
      if (!ALLOWED_MIME.has(file.type)) {
        continue
      }

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      if (!buffer.length) continue

      if (buffer.length > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, message: `"${file.name}" exceeds 5 MB` },
          { status: 400 }
        )
      }

      const ext =
        MIME_TO_EXT[file.type] ||
        path.extname(file.name || '').toLowerCase() ||
        '.bin'

      const hash = crypto
        .createHash('sha1')
        .update(buffer)
        .update(String(Date.now()) + i)
        .digest('hex')
        .slice(0, 16)

      const filename = `${hash}${ext}`
      const absolutePath = path.join(destDir, filename)
      const publicUrl = `/uploads/${bucket}/${filename}`

      await fs.writeFile(absolutePath, buffer)

      uploaded.push({
        url: publicUrl,
        size: buffer.length,
        mime: file.type,
        originalName: file.name,
      })
    }

    if (!uploaded.length) {
      return NextResponse.json(
        {
          success: false,
          message:
            'No valid image files were uploaded. Allowed types: JPEG, PNG, WEBP, GIF, AVIF.',
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data: uploaded })
  } catch (err) {
    console.error('POST /api/uploads error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to upload' },
      { status: 500 }
    )
  }
}
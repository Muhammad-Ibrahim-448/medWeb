// src/app/api/debug-uploads/route.js
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const dir = path.join(process.cwd(), 'public', 'uploads', 'products')
  try {
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, 'test.txt'), 'hi')
    const files = await fs.readdir(dir)
    return Response.json({ cwd: process.cwd(), dir, files })
  } catch (e) {
    return Response.json({ error: e.message, code: e.code }, { status: 500 })
  }
}
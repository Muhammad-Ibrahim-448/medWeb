// src/app/(dashboard)/dashboard/blog/BlogForm.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  UploadCloud,
  X,
  Loader2,
  Save,
  AlertCircle,
  CheckCircle2,
  PackageX,
  Image as ImageIcon,
  Eye,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/helpers'

const STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
]

const MAX_FILE_SIZE = 5 * 1024 * 1024

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function BlogForm({ mode = 'create' }) {
  const router = useRouter()
  const params = useParams()
  const postId = params?.id

  const fileInputRef = useRef(null)

  const [state, setState] = useState(mode === 'edit' ? 'loading' : 'ready')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [slugTouched, setSlugTouched] = useState(false)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    status: 'draft',
  })

  /* Load post when editing */
  useEffect(() => {
    if (mode !== 'edit') {
      setState('ready')
      return
    }
    if (!postId) {
      setState('notfound')
      return
    }

    let cancelled = false

    ;(async () => {
      setState('loading')
      try {
        const res = await fetch(`/api/blog/${postId}`)
        const contentType = res.headers.get('content-type') || ''
        if (!contentType.includes('application/json')) {
          throw new Error(`Non-JSON response (${res.status})`)
        }
        const data = await res.json()
        if (cancelled) return

        if (!res.ok || !data.success || !data.data) {
          setState('notfound')
          return
        }

        const p = data.data
        setForm({
          title: p.title || '',
          slug: p.slug || '',
          excerpt: p.excerpt || '',
          content: p.content || '',
          cover_image: p.cover_image || '',
          status: p.status || 'draft',
        })
        setSlugTouched(true)
        setState('ready')
      } catch (err) {
        console.error('[BlogForm] load error:', err)
        if (!cancelled) setState('notfound')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [mode, postId])

  const setField = (key, value) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleTitleChange = (value) => {
    setForm((f) => ({
      ...f,
      title: value,
      slug: slugTouched ? f.slug : slugify(value),
    }))
  }

  const handleSlugChange = (value) => {
    setSlugTouched(true)
    setField('slug', value)
  }

  /* Cover upload */
  const handleUpload = async (file) => {
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      setFeedback({ type: 'error', message: `${file.name} exceeds 5 MB` })
      return
    }
    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: `${file.name} is not an image` })
      return
    }

    setUploading(true)
    setFeedback(null)

    try {
      const fd = new FormData()
      fd.append('bucket', 'blog')
      fd.append('files', file)

      const res = await fetch('/api/uploads', { method: 'POST', body: fd })
      const data = await res.json()

      if (!data.success || !data.data?.[0]?.url) {
        setFeedback({ type: 'error', message: data.message || 'Upload failed' })
        return
      }

      setField('cover_image', data.data[0].url)
      setFeedback({ type: 'success', message: 'Cover uploaded' })
    } catch (err) {
      console.error(err)
      setFeedback({ type: 'error', message: 'Upload failed' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeCover = async () => {
    const url = form.cover_image
    setField('cover_image', '')
    if (url?.startsWith('/uploads/')) {
      fetch('/api/uploads/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      }).catch(() => {})
    }
  }

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.title.trim()) {
      setFeedback({ type: 'error', message: 'Title is required' })
      return
    }

    setSaving(true)
    setFeedback(null)

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || undefined,
      excerpt: form.excerpt.trim() || null,
      content: form.content || null,
      cover_image: form.cover_image || null,
      status: form.status,
    }

    try {
      const url =
        mode === 'edit' ? `/api/blog/${postId}` : '/api/blog'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!data.success) {
        setFeedback({
          type: 'error',
          message: data.message || 'Save failed',
        })
        setSaving(false)
        return
      }

      setFeedback({
        type: 'success',
        message: mode === 'edit' ? 'Post updated' : 'Post created',
      })

      setTimeout(() => router.push('/dashboard/blog'), 700)
    } catch (err) {
      console.error(err)
      setFeedback({ type: 'error', message: 'Something went wrong' })
      setSaving(false)
    }
  }

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-[#fffdf7] p-8 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
        <p className="text-sm text-stone-500">Loading post…</p>
      </div>
    )
  }

  if (state === 'notfound') {
    return (
      <div className="min-h-screen bg-[#fffdf7] p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border border-amber-100 mb-4">
            <PackageX className="h-7 w-7 text-amber-600" />
          </div>
          <h1 className="text-2xl  font-bold text-stone-900 mb-2">
            Post not found
          </h1>
          <p className="text-stone-500 mb-6">
            This journal entry may have been removed.
          </p>
          <Link href="/dashboard/blog">
            <Button className="bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white border-0 rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Journal
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const previewSlug = form.slug || slugify(form.title) || 'your-post-url'

  return (
    <div className="min-h-screen bg-[#fffdf7] p-4 sm:p-6 lg:p-8">
      <Link
        href="/dashboard/blog"
        className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 mb-5 font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Journal
      </Link>

      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl  font-bold text-stone-900 mb-1">
            {mode === 'edit' ? 'Edit Post' : 'New Journal Entry'}
          </h1>
          <p className="text-sm text-stone-500">
            {mode === 'edit'
              ? 'Update your story and publish when ready'
              : 'Share a story, guide, or inspiration with your readers'}
          </p>
        </div>
        {mode === 'edit' && form.slug && form.status === 'published' && (
          <a
            href={`/blog/${form.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-50 border border-amber-200 transition-colors"
          >
            <Eye className="h-4 w-4" />
            View Live
          </a>
        )}
      </div>

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'mb-6 px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-2',
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          )}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {feedback.message}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* LEFT — main content */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Post Content">
            <Field label="Title" required>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. The Story Behind Our Bridal Collection"
                className={cn(inputCls, 'text-lg  font-semibold')}
              />
            </Field>

            <Field label="URL Slug">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 font-mono whitespace-nowrap">
                  /blog/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder={slugify(form.title) || 'your-post-url'}
                  className={cn(inputCls, 'font-mono text-xs')}
                />
              </div>
              <p className="text-xs text-stone-400 mt-1.5">
                Preview: <span className="font-mono">/blog/{previewSlug}</span>
              </p>
            </Field>

            <Field label="Excerpt" hint="Short summary shown in listings and previews">
              <textarea
                value={form.excerpt}
                onChange={(e) => setField('excerpt', e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="A brief, engaging teaser for your post..."
                className={cn(inputCls, 'resize-none')}
              />
              <p className="text-xs text-stone-400 mt-1 text-right">
                {form.excerpt.length} / 500
              </p>
            </Field>

            <Field
              label="Content"
              hint="Markdown or HTML supported — use headings, lists, and bold for structure"
            >
              <textarea
                value={form.content}
                onChange={(e) => setField('content', e.target.value)}
                rows={18}
                placeholder={`Write your journal entry here...

# A Heading
Some paragraph text.

## A Subheading
- Bullet point
- Another point

**Bold text** and *italic text* work.`}
                className={cn(
                  inputCls,
                  'resize-y font-mono text-xs leading-relaxed min-h-[400px]'
                )}
              />
            </Field>
          </Section>
        </div>

        {/* RIGHT — sidebar */}
        <div className="space-y-6">
          <Section title="Publishing">
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => setField('status', e.target.value)}
                className={inputCls}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          <Section title="Cover Image">
            {form.cover_image ? (
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-stone-200 bg-gradient-to-br from-amber-50 to-stone-100">
                <Image
                  src={form.cover_image}
                  alt="Cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removeCover}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white text-red-600 hover:bg-red-50 flex items-center justify-center shadow-md border border-red-200 transition-colors"
                  title="Remove cover"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/50 hover:bg-amber-50/50 hover:border-amber-400 transition-colors cursor-pointer p-6 text-center',
                  uploading && 'opacity-60 pointer-events-none'
                )}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-8 w-8 text-amber-600 mx-auto mb-2 animate-spin" />
                    <p className="text-sm font-medium text-stone-700">
                      Uploading...
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center mx-auto mb-3 shadow-md shadow-amber-500/25">
                      <UploadCloud className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-stone-800 mb-1">
                      Upload cover image
                    </p>
                    <p className="text-xs text-stone-500">
                      PNG, JPG, WEBP · max 5 MB
                    </p>
                  </>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleUpload(e.target.files?.[0])}
            />
          </Section>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white border-0 rounded-xl shadow-md shadow-amber-600/25 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'edit' ? 'Update Post' : 'Create Post'}
                </>
              )}
            </Button>

            <Link href="/dashboard/blog">
              <button
                type="button"
                className="w-full mt-2 px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
            </Link>
          </div>

          <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="h-4 w-4 text-amber-700" />
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Writing Tips
              </p>
            </div>
            <ul className="space-y-2 text-xs text-amber-900/80">
              <li>• Lead with a strong hook in the first paragraph</li>
              <li>• Use headings to break long content into sections</li>
              <li>• Cover images work best at 16:10, min 1200px wide</li>
              <li>• Save as draft first — publish when ready</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-amber-700" />
              <p className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Post Checklist
              </p>
            </div>
            <ul className="space-y-2 text-xs">
              <ChecklistItem ok={!!form.title.trim()}>
                Title added
              </ChecklistItem>
              <ChecklistItem ok={!!form.excerpt.trim()}>
                Excerpt written
              </ChecklistItem>
              <ChecklistItem ok={!!form.content.trim()}>
                Content added
              </ChecklistItem>
              <ChecklistItem ok={!!form.cover_image}>
                Cover image set
              </ChecklistItem>
            </ul>
          </div>
        </div>
      </form>
    </div>
  )
}

const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 focus:bg-white transition-all'

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
      <h2 className=" font-bold text-stone-900 text-lg mb-4 pb-3 border-b border-stone-100">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-stone-400 mt-1.5">{hint}</p>}
    </div>
  )
}

function ChecklistItem({ ok, children }) {
  return (
    <li className="flex items-center gap-2 text-stone-600">
      {ok ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
      ) : (
        <span className="w-3.5 h-3.5 rounded-full border-2 border-stone-300 flex-shrink-0" />
      )}
      <span className={ok ? 'text-stone-900' : ''}>{children}</span>
    </li>
  )
}
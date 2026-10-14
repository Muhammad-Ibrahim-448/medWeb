// src/app/(dashboard)/dashboard/categories/CategoryForm.jsx
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
  FolderTree,
  Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/helpers'

const GENDERS = [
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'kids', label: 'Kids' },
]

const STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const MAX_FILE_SIZE = 5 * 1024 * 1024

export function CategoryForm({ mode = 'create' }) {
  const router = useRouter()
  const params = useParams()
  const categoryId = params?.id

  const fileInputRef = useRef(null)

  const [state, setState] = useState(mode === 'edit' ? 'loading' : 'ready')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [parents, setParents] = useState([])
  const [feedback, setFeedback] = useState(null)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parent_id: '',
    gender: 'unisex',
    sort_order: 0,
    status: 'active',
  })

  /* Load all categories for parent select (excludes self on edit) */
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/categories?status=active')
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        const list = Array.isArray(data.data)
          ? data.data
          : data.data?.items || []
        setParents(list)
      } catch {
        /* ignore */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  /* Load category if editing */
  useEffect(() => {
    if (mode !== 'edit') {
      setState('ready')
      return
    }
    if (!categoryId) {
      setState('notfound')
      return
    }

    let cancelled = false

    ;(async () => {
      setState('loading')
      try {
        const res = await fetch(`/api/categories/${categoryId}`)
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

        const c = data.data
        setForm({
          name: c.name || '',
          slug: c.slug || '',
          description: c.description || '',
          image: c.image || '',
          parent_id: c.parent_id ?? '',
          gender: c.gender || 'unisex',
          sort_order: c.sort_order ?? 0,
          status: c.status || 'active',
        })
        setState('ready')
      } catch (err) {
        console.error('[CategoryForm] load error:', err)
        if (!cancelled) setState('notfound')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [mode, categoryId])

  const setField = (key, value) =>
    setForm((f) => ({ ...f, [key]: value }))

  /* ─── Image upload ─── */
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
      fd.append('bucket', 'categories')
      fd.append('files', file)

      const res = await fetch('/api/uploads', { method: 'POST', body: fd })
      const data = await res.json()

      if (!data.success || !data.data?.[0]?.url) {
        setFeedback({ type: 'error', message: data.message || 'Upload failed' })
        return
      }

      setField('image', data.data[0].url)
      setFeedback({ type: 'success', message: 'Image uploaded' })
    } catch (err) {
      console.error(err)
      setFeedback({ type: 'error', message: 'Upload failed' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = async () => {
    const url = form.image
    setField('image', '')
    if (url?.startsWith('/uploads/')) {
      fetch('/api/uploads/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      }).catch(() => {})
    }
  }

  /* ─── Submit ─── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setFeedback({ type: 'error', message: 'Name is required' })
      return
    }

    setSaving(true)
    setFeedback(null)

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim() || null,
      image: form.image || null,
      parent_id: form.parent_id ? Number(form.parent_id) : null,
      gender: form.gender,
      sort_order: Number(form.sort_order) || 0,
      status: form.status,
    }

    try {
      const url =
        mode === 'edit'
          ? `/api/categories/${categoryId}`
          : '/api/categories'
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
        message: mode === 'edit' ? 'Category updated' : 'Category created',
      })
      setTimeout(() => router.push('/dashboard/categories'), 700)
    } catch (err) {
      console.error(err)
      setFeedback({ type: 'error', message: 'Something went wrong' })
      setSaving(false)
    }
  }

  /* ─── Early states ─── */
  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-[#fffdf7] p-8 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
        <p className="text-sm text-stone-500">Loading category…</p>
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
            Category not found
          </h1>
          <p className="text-stone-500 mb-6">
            We couldn't load this category. It may have been removed.
          </p>
          <Link href="/dashboard/categories">
            <Button className="bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white border-0 rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffdf7] p-4 sm:p-6 lg:p-8">
      <Link
        href="/dashboard/categories"
        className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 mb-5 font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Categories
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl  font-bold text-stone-900 mb-1">
          {mode === 'edit' ? 'Edit Category' : 'Add New Category'}
        </h1>
        <p className="text-sm text-stone-500">
          {mode === 'edit'
            ? 'Update category details and image'
            : 'Create a new category to organise your products'}
        </p>
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
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Basic Information">
            <Field label="Category Name" required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="e.g. Bridal Sets"
                className={inputCls}
              />
            </Field>

            <Field label="Slug">
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setField('slug', e.target.value)}
                placeholder="Auto-generated from name if left blank"
                className={cn(inputCls, 'font-mono text-xs')}
              />
            </Field>

            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                rows={4}
                placeholder="Brief description of this category..."
                className={cn(inputCls, 'resize-none')}
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Parent Category">
                <select
                  value={form.parent_id}
                  onChange={(e) => setField('parent_id', e.target.value)}
                  className={inputCls}
                >
                  <option value="">— None (top-level) —</option>
                  {parents
                    .filter((p) => String(p.id) !== String(categoryId))
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </Field>
              <Field label="Gender">
                <select
                  value={form.gender}
                  onChange={(e) => setField('gender', e.target.value)}
                  className={inputCls}
                >
                  {GENDERS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          <Section title="Category Image">
            {form.image ? (
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-stone-200 bg-gradient-to-br from-amber-50 to-stone-100">
                <Image
                  src={form.image}
                  alt={form.name || 'Category image'}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white text-red-600 hover:bg-red-50 flex items-center justify-center shadow-md border border-red-200 transition-colors"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/50 hover:bg-amber-50/50 hover:border-amber-400 transition-colors cursor-pointer p-8 text-center',
                  uploading && 'opacity-60 pointer-events-none'
                )}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-10 w-10 text-amber-600 mx-auto mb-3 animate-spin" />
                    <p className="text-sm font-medium text-stone-700">
                      Uploading...
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center mx-auto mb-4 shadow-md shadow-amber-500/25">
                      <UploadCloud className="h-7 w-7 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-stone-800 mb-1">
                      Upload category image
                    </p>
                    <p className="text-xs text-stone-500">
                      PNG, JPG, WEBP · max 5 MB · 16:9 recommended
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
        </div>

        {/* RIGHT */}
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

            <Field label="Sort Order">
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setField('sort_order', e.target.value)}
                min="0"
                className={inputCls}
              />
            </Field>
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
                  {mode === 'edit' ? 'Update Category' : 'Create Category'}
                </>
              )}
            </Button>

            <Link href="/dashboard/categories">
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
                Image Tips
              </p>
            </div>
            <ul className="space-y-2 text-xs text-amber-900/80">
              <li>• Use a clean lifestyle or product shot</li>
              <li>• 16:9 ratio looks best in the storefront grid</li>
              <li>• Aim for 1200×675px or larger</li>
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

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}
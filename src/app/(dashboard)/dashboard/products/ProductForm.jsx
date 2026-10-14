// src/app/(dashboard)/dashboard/products/ProductForm.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  UploadCloud,
  X,
  Star,
  Loader2,
  Image as ImageIcon,
  Save,
  AlertCircle,
  CheckCircle2,
  PackageX,
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
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
]

const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_FILES = 8

export function ProductForm({ mode = 'create' }) {
  const router = useRouter()
  const params = useParams()
  const productId = params?.id // resolved from the URL

  const fileInputRef = useRef(null)

  // 'loading' | 'ready' | 'notfound'
  const [state, setState] = useState(mode === 'edit' ? 'loading' : 'ready')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState([])
  const [feedback, setFeedback] = useState(null)

  const [form, setForm] = useState({
    name: '',
    sku: '',
    description: '',
    short_description: '',
    price: '',
    sale_price: '',
    cost_price: '',
    stock_quantity: '',
    low_stock_threshold: 5,
    category_id: '',
    gender: 'unisex',
    material: '',
    weight: '',
    size: '',
    stone: '',
    status: 'active',
    featured: false,
  })

  const [images, setImages] = useState([])

  /* ─── Load categories (best effort, never blocks) ─── */
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/categories')
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && data.success) setCategories(data.data || [])
      } catch {
        /* ignore — categories are optional */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  /* ─── Load product when editing ─── */
  useEffect(() => {
    if (mode !== 'edit') {
      setState('ready')
      return
    }

    // If for some reason the id is missing, stop the spinner and show an error
    if (!productId) {
      console.warn('[ProductForm] edit mode but no productId in params')
      setState('notfound')
      return
    }

    let cancelled = false

    ;(async () => {
      setState('loading')
      try {
        const res = await fetch(`/api/products/admin/${productId}`)

        // Handle non-JSON responses (401 HTML pages, 500 etc.)
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
          name: p.name || '',
          sku: p.sku || '',
          description: p.description || '',
          short_description: p.short_description || '',
          price: p.price ?? '',
          sale_price: p.sale_price ?? '',
          cost_price: p.cost_price ?? '',
          stock_quantity: p.stock_quantity ?? '',
          low_stock_threshold: p.low_stock_threshold ?? 5,
          category_id: p.category_id ?? '',
          gender: p.gender || 'unisex',
          material: p.material || '',
          weight: p.weight || '',
          size: p.size || '',
          stone: p.stone || '',
          status: p.status || 'active',
          featured: !!p.featured,
        })
        setImages(
          (p.images || []).map((img) => ({
            id: img.id,
            url: img.image_url,
            alt: img.alt_text || '',
            is_primary: !!img.is_primary,
          }))
        )
        setState('ready')
      } catch (err) {
        console.error('[ProductForm] load error:', err)
        if (!cancelled) setState('notfound')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [mode, productId])

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  /* ─── Upload ─── */
  const handleFiles = async (files) => {
    const fileList = Array.from(files)
    if (!fileList.length) return

    if (images.length + fileList.length > MAX_FILES) {
      setFeedback({
        type: 'error',
        message: `You can upload up to ${MAX_FILES} images`,
      })
      return
    }

    for (const f of fileList) {
      if (f.size > MAX_FILE_SIZE) {
        setFeedback({ type: 'error', message: `"${f.name}" exceeds 5 MB` })
        return
      }
      if (!f.type.startsWith('image/')) {
        setFeedback({ type: 'error', message: `"${f.name}" is not an image` })
        return
      }
    }

    setUploading(true)
    setFeedback(null)

    try {
      const fd = new FormData()
      fd.append('bucket', 'products')
      fileList.forEach((f) => fd.append('files', f))

      const res = await fetch('/api/uploads', { method: 'POST', body: fd })
      const data = await res.json()

      if (!data.success) {
        setFeedback({ type: 'error', message: data.message || 'Upload failed' })
        return
      }

      const newImages = data.data.map((u, i) => ({
        url: u.url,
        alt: form.name || '',
        is_primary: images.length === 0 && i === 0,
      }))

      setImages((prev) => [...prev, ...newImages])
      setFeedback({
        type: 'success',
        message: `${newImages.length} image${newImages.length > 1 ? 's' : ''} uploaded`,
      })
    } catch (err) {
      console.error(err)
      setFeedback({ type: 'error', message: 'Upload failed' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
  }

  const removeImage = async (index) => {
    const img = images[index]
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index)
      if (img.is_primary && next.length && !next.some((i) => i.is_primary)) {
        next[0].is_primary = true
      }
      return next
    })
    if (img.url?.startsWith('/uploads/')) {
      fetch('/api/uploads/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: img.url }),
      }).catch(() => {})
    }
  }

  const setPrimary = (index) =>
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, is_primary: i === index }))
    )

  /* ─── Submit ─── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.sku.trim() || !form.price) {
      setFeedback({
        type: 'error',
        message: 'Name, SKU and price are required',
      })
      return
    }

    setSaving(true)
    setFeedback(null)

    const payload = {
      ...form,
      price: Number(form.price),
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      cost_price: form.cost_price ? Number(form.cost_price) : null,
      stock_quantity: form.stock_quantity ? Number(form.stock_quantity) : 0,
      low_stock_threshold: Number(form.low_stock_threshold || 5),
      category_id: form.category_id ? Number(form.category_id) : null,
      featured: form.featured ? 1 : 0,
      images: images.map((img, i) => ({
        url: img.url,
        alt: img.alt || form.name,
        is_primary: img.is_primary ? 1 : 0,
        sort_order: i + 1,
      })),
    }

    try {
      const url =
        mode === 'edit' ? `/api/products/${productId}` : '/api/products'
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
        message: mode === 'edit' ? 'Product updated' : 'Product created',
      })

      setTimeout(() => router.push('/dashboard/products'), 700)
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
        <p className="text-sm text-stone-500">Loading product…</p>
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
            Product not found
          </h1>
          <p className="text-stone-500 mb-6">
            We couldn't load this product. It may have been removed, or you may
            not have permission to view it.
          </p>
          <Link href="/dashboard/products">
            <Button className="bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white border-0 rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  /* ─── Main form ─── */
  return (
    <div className="min-h-screen bg-[#fffdf7] p-4 sm:p-6 lg:p-8">
      <Link
        href="/dashboard/products"
        className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 mb-5 font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl  font-bold text-stone-900 mb-1">
          {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-sm text-stone-500">
          {mode === 'edit'
            ? 'Update product details and images'
            : 'Fill in the details to add a new piece to your catalogue'}
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
            <Field label="Product Name" required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="e.g. 22K Gold Bridal Necklace"
                className={inputCls}
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="SKU" required>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => setField('sku', e.target.value)}
                  placeholder="SJ-NECK-001"
                  className={inputCls}
                />
              </Field>
              <Field label="Category">
                <select
                  value={form.category_id}
                  onChange={(e) => setField('category_id', e.target.value)}
                  className={inputCls}
                >
                  <option value="">— Select category —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Short Description">
              <input
                type="text"
                value={form.short_description}
                onChange={(e) =>
                  setField('short_description', e.target.value)
                }
                placeholder="One-line summary shown in listings"
                maxLength={500}
                className={inputCls}
              />
            </Field>

            <Field label="Full Description">
              <textarea
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                rows={5}
                placeholder="Detailed description of the piece..."
                className={cn(inputCls, 'resize-none')}
              />
            </Field>
          </Section>

          <Section title="Pricing">
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Price (PKR)" required>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setField('price', e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={inputCls}
                />
              </Field>
              <Field label="Sale Price (PKR)">
                <input
                  type="number"
                  value={form.sale_price}
                  onChange={(e) => setField('sale_price', e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="Optional"
                  className={inputCls}
                />
              </Field>
              <Field label="Cost Price (PKR)">
                <input
                  type="number"
                  value={form.cost_price}
                  onChange={(e) => setField('cost_price', e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="Internal"
                  className={inputCls}
                />
              </Field>
            </div>
          </Section>

          <Section title="Inventory">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Stock Quantity">
                <input
                  type="number"
                  value={form.stock_quantity}
                  onChange={(e) =>
                    setField('stock_quantity', e.target.value)
                  }
                  min="0"
                  placeholder="0"
                  className={inputCls}
                />
              </Field>
              <Field label="Low Stock Threshold">
                <input
                  type="number"
                  value={form.low_stock_threshold}
                  onChange={(e) =>
                    setField('low_stock_threshold', e.target.value)
                  }
                  min="0"
                  className={inputCls}
                />
              </Field>
            </div>
          </Section>

          <Section title="Jewellery Attributes">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Material">
                <input
                  type="text"
                  value={form.material}
                  onChange={(e) => setField('material', e.target.value)}
                  placeholder="e.g. 22K Gold, Silver 925"
                  className={inputCls}
                />
              </Field>
              <Field label="Weight">
                <input
                  type="text"
                  value={form.weight}
                  onChange={(e) => setField('weight', e.target.value)}
                  placeholder="e.g. 12.5g"
                  className={inputCls}
                />
              </Field>
              <Field label="Size / Dimensions">
                <input
                  type="text"
                  value={form.size}
                  onChange={(e) => setField('size', e.target.value)}
                  placeholder="e.g. 18 inch, size 7"
                  className={inputCls}
                />
              </Field>
              <Field label="Stone / Gemstone">
                <input
                  type="text"
                  value={form.stone}
                  onChange={(e) => setField('stone', e.target.value)}
                  placeholder="e.g. Diamond, Ruby"
                  className={inputCls}
                />
              </Field>
            </div>
          </Section>

          <Section title="Images">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'relative rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/50 hover:bg-amber-50/50 hover:border-amber-400 transition-colors cursor-pointer p-8 text-center',
                uploading && 'opacity-60 pointer-events-none'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => handleFiles(e.target.files)}
              />
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
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-stone-500">
                    PNG, JPG, WEBP, GIF · max 5 MB each · up to {MAX_FILES} files
                  </p>
                </>
              )}
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-5">
                <AnimatePresence>
                  {images.map((img, i) => (
                    <motion.div
                      key={img.url + i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={cn(
                        'group relative aspect-square rounded-2xl overflow-hidden border-2 transition-colors',
                        img.is_primary
                          ? 'border-amber-500 shadow-md shadow-amber-500/25'
                          : 'border-stone-200'
                      )}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt || 'Product image'}
                        fill
                        sizes="(max-width: 768px) 50vw, 200px"
                        className="object-cover"
                      />
                      {img.is_primary && (
                        <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                          <Star className="h-2.5 w-2.5 fill-white" />
                          Primary
                        </span>
                      )}
                      <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {!img.is_primary && (
                          <button
                            type="button"
                            onClick={() => setPrimary(i)}
                            title="Set as primary"
                            className="w-9 h-9 rounded-full bg-white text-amber-700 hover:bg-amber-50 flex items-center justify-center shadow"
                          >
                            <Star className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          title="Remove"
                          className="w-9 h-9 rounded-full bg-white text-red-600 hover:bg-red-50 flex items-center justify-center shadow"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
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

            <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer hover:bg-amber-50 hover:border-amber-300 transition-colors">
              <div className="flex items-center gap-2">
                <Star
                  className={cn(
                    'h-4 w-4',
                    form.featured
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-stone-400'
                  )}
                />
                <div>
                  <p className="text-sm font-semibold text-stone-800">
                    Featured
                  </p>
                  <p className="text-xs text-stone-500">
                    Highlight on homepage
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setField('featured', e.target.checked)}
                className="w-4 h-4 accent-amber-600 cursor-pointer"
              />
            </label>
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
                  {mode === 'edit' ? 'Update Product' : 'Create Product'}
                </>
              )}
            </Button>
            <Link href="/dashboard/products">
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
              <li>• Use clean, well-lit photos on white or neutral backgrounds</li>
              <li>• First image becomes the primary thumbnail</li>
              <li>• Aim for 1200×1200px or larger, square is best</li>
              <li>• Include multiple angles for fine jewellery</li>
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
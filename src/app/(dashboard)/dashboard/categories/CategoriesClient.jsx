'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Search,
  X,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Tag,
  Layers,
  Gem,
  Users,
  RefreshCw,
  FolderTree,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/helpers'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const GENDER_OPTIONS = [
  { value: '', label: 'All Genders' },
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'kids', label: 'Kids' },
]

const STATUS_STYLES = {
  active: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  inactive: 'bg-stone-100 text-stone-700 border-stone-200',
}

const GENDER_STYLES = {
  women: 'bg-pink-50 text-pink-700 border-pink-200',
  men: 'bg-blue-50 text-blue-700 border-blue-200',
  unisex: 'bg-purple-50 text-purple-700 border-purple-200',
  kids: 'bg-amber-50 text-amber-800 border-amber-200',
}

export function CategoriesClient() {
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [gender, setGender] = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ status })
      if (gender) params.set('gender', gender)
      if (debouncedSearch) params.set('search', debouncedSearch)

      const res = await fetch(`/api/categories/admin?${params}`)
      const data = await res.json()

      if (data.success) {
        // Support both { items, stats } and plain array
        const payload = data.data
        if (Array.isArray(payload)) {
          setCategories(payload)
          setStats({})
        } else {
          setCategories(payload?.items || [])
          setStats(payload?.stats || {})
        }
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    } finally {
      setLoading(false)
    }
  }, [status, gender, debouncedSearch])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleDelete = async (id, name) => {
    if (
      !confirm(
        `Delete "${name}"?\n\nProducts in this category will become uncategorised.`
      )
    )
      return
    setDeleting(id)
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchCategories()
      } else {
        alert(data.message || 'Failed to delete category')
      }
    } catch {
      alert('Something went wrong')
    } finally {
      setDeleting(null)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setStatus('all')
    setGender('')
  }

  const hasActiveFilters = search || status !== 'all' || gender

  return (
    <div className="min-h-screen bg-[#fffdf7] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/25">
            <FolderTree className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl  font-bold text-stone-900">
              Categories
            </h1>
            <p className="text-sm text-stone-500">
              Organise your jewellery collections
            </p>
          </div>
        </div>

        <Link href="/dashboard/categories/new">
          <Button className="bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white border-0 rounded-xl shadow-md shadow-amber-600/25">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Tag}
          label="Total"
          value={stats.total || 0}
          tone="amber"
        />
        <StatCard
          icon={Layers}
          label="Active"
          value={stats.active || 0}
          tone="emerald"
        />
        <StatCard
          icon={Gem}
          label="Women"
          value={stats.women || 0}
          tone="pink"
        />
        <StatCard
          icon={Users}
          label="Men"
          value={stats.men || 0}
          tone="blue"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 md:p-5 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 focus:bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none w-full lg:w-44 pl-4 pr-9 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 focus:bg-white cursor-pointer"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="appearance-none w-full lg:w-44 pl-4 pr-9 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 focus:bg-white cursor-pointer"
            >
              {GENDER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
          </div>

          <Button
            variant="outline"
            onClick={fetchCategories}
            className="rounded-xl border-stone-200 text-stone-700 hover:bg-amber-50 hover:border-amber-300"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1 font-medium px-3"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState hasFilters={hasActiveFilters} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="group"
            >
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-amber-900/10 hover:border-amber-200 transition-all duration-300">
                {/* Cover image */}
                <div className="relative aspect-[16/10] bg-gradient-to-br from-amber-50 to-stone-100 overflow-hidden">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Gem
                        className="h-14 w-14 text-amber-300/70"
                        strokeWidth={1}
                      />
                    </div>
                  )}

                  {/* Top badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm',
                        STATUS_STYLES[cat.status] ||
                          'bg-stone-100 text-stone-700 border-stone-200'
                      )}
                    >
                      {cat.status}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm',
                        GENDER_STYLES[cat.gender] ||
                          'bg-stone-100 text-stone-700 border-stone-200'
                      )}
                    >
                      {cat.gender}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className=" font-bold text-lg text-stone-900 leading-snug truncate">
                      {cat.name}
                    </h3>
                    <span className="text-xs font-mono text-stone-400 flex-shrink-0">
                      #{cat.id}
                    </span>
                  </div>

                  {cat.parent_name && (
                    <p className="text-xs text-amber-700 mb-2">
                      ↳ under {cat.parent_name}
                    </p>
                  )}

                  {cat.description && (
                    <p className="text-sm text-stone-500 line-clamp-2 mb-4">
                      {cat.description}
                    </p>
                  )}

                  {/* Meta row */}
                  <div className="flex items-center gap-4 pt-3 border-t border-stone-100 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-stone-600 font-medium">
                      <Tag className="h-3.5 w-3.5 text-amber-600" />
                      {cat.product_count}{' '}
                      {Number(cat.product_count) === 1
                        ? 'product'
                        : 'products'}
                    </span>
                    <span className="text-stone-400 font-mono truncate">
                      /{cat.slug}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <Link
                      href={`/dashboard/categories/${cat.id}/edit`}
                      className="flex-1"
                    >
                      <button className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      disabled={deleting === cat.id}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Sub-components ─── */

function StatCard({ icon: Icon, label, value, tone = 'amber' }) {
  const tones = {
    amber: 'from-amber-500 to-amber-400 shadow-amber-500/25',
    emerald: 'from-emerald-500 to-emerald-400 shadow-emerald-500/25',
    pink: 'from-pink-500 to-pink-400 shadow-pink-500/25',
    blue: 'from-blue-500 to-blue-400 shadow-blue-500/25',
  }
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 md:p-5 shadow-sm">
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br mb-3',
          tones[tone] || tones.amber
        )}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p className="text-xs text-stone-500 uppercase tracking-wider font-medium mb-1">
        {label}
      </p>
      <p className="text-xl md:text-2xl  font-bold text-stone-900">
        {value}
      </p>
    </div>
  )
}

function CategorySkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      <div className="aspect-[16/10] bg-stone-100 animate-pulse" />
      <div className="p-5">
        <div className="w-3/4 h-6 bg-stone-100 rounded-lg animate-pulse mb-3" />
        <div className="w-full h-3 bg-stone-100 rounded-full animate-pulse mb-2" />
        <div className="w-2/3 h-3 bg-stone-100 rounded-full animate-pulse mb-4" />
        <div className="flex gap-2 pt-3 border-t border-stone-100">
          <div className="w-24 h-4 bg-stone-100 rounded-full animate-pulse" />
          <div className="w-16 h-4 bg-stone-100 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ hasFilters }) {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border border-amber-100 mb-4">
        <FolderTree className="h-7 w-7 text-amber-600" />
      </div>
      <h3 className="text-xl  font-bold text-stone-900 mb-2">
        No categories found
      </h3>
      <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
        {hasFilters
          ? 'Try adjusting your filters or search terms.'
          : 'Start by creating your first category.'}
      </p>
      {!hasFilters && (
        <Link href="/dashboard/categories/new">
          <Button className="bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white border-0 rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </Link>
      )}
    </div>
  )
}
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
  Gem,
  Package,
  AlertTriangle,
  Star,
  TrendingUp,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/helpers'

const LIMIT = 15

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name_asc', label: 'Name: A → Z' },
  { value: 'stock_asc', label: 'Stock: Low → High' },
  { value: 'popular', label: 'Most Popular' },
]

const STATUS_STYLES = {
  active: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  draft: 'bg-amber-50 text-amber-800 border-amber-200',
  archived: 'bg-stone-100 text-stone-700 border-stone-200',
}

export function ProductsClient() {
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('newest')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        status,
        sort,
      })
      if (debouncedSearch) params.set('search', debouncedSearch)

      const res = await fetch(`/api/products/admin?${params}`)
      const data = await res.json()

      if (data.success) {
        setProducts(data.data || [])
        setStats(data.stats || {})
        setTotal(data.pagination?.total || 0)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }, [page, status, sort, debouncedSearch])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    setPage(1)
  }, [status, sort, debouncedSearch])

  const handleDelete = async (id, name) => {
    if (!confirm(`Archive "${name}"? It will be hidden from the storefront.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchProducts()
      } else {
        alert(data.message || 'Failed to archive product')
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
    setSort('newest')
    setPage(1)
  }

  const hasActiveFilters = search || status !== 'all' || sort !== 'newest'

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '—'

  const formatCurrency = (n) =>
    `PKR ${Number(n || 0).toLocaleString('en-PK')}`

  return (
    <div className="min-h-screen bg-[#fffdf7] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/25">
            <Gem className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl  font-bold text-stone-900">
              Products
            </h1>
            <p className="text-sm text-stone-500">
              Manage your jewellery catalogue
            </p>
          </div>
        </div>

        <Link href="/dashboard/products/new">
          <Button className="bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white border-0 rounded-xl shadow-md shadow-amber-600/25">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.total || 0}
          tone="amber"
        />
        <StatCard
          icon={Star}
          label="Featured"
          value={stats.featured || 0}
          tone="purple"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={stats.low_stock || 0}
          tone="red"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Stock"
          value={stats.total_stock || 0}
          tone="emerald"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 md:p-5 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name, SKU..."
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
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none w-full lg:w-48 pl-4 pr-9 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 focus:bg-white cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
          </div>

          <Button
            variant="outline"
            onClick={fetchProducts}
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-stone-100">
          <p className="text-sm text-stone-500 font-medium">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Loading products...
              </span>
            ) : (
              <>
                <span className="text-stone-900 font-bold">{total}</span>{' '}
                {total === 1 ? 'product' : 'products'}
              </>
            )}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Product
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500 hidden lg:table-cell">
                  Category
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Price
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Stock
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Status
                </th>
                <th className="text-right px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-stone-100">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-stone-100 rounded-full animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border border-amber-100 mb-4">
                      <Gem className="h-7 w-7 text-amber-600" />
                    </div>
                    <p className="text-stone-900 font-semibold mb-1">
                      No products found
                    </p>
                    <p className="text-stone-500 text-sm mb-6">
                      {hasActiveFilters
                        ? 'Try adjusting your filters.'
                        : 'Start by adding your first product.'}
                    </p>
                    {!hasActiveFilters && (
                      <Link href="/dashboard/products/new">
                        <Button className="bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white border-0 rounded-xl">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product
                        </Button>
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                products.map((p, i) => {
                  const isLowStock = Number(p.stock_quantity) <= 5
                  return (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.25 }}
                      className="border-b border-stone-100 last:border-0 hover:bg-amber-50/40 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-stone-100 flex-shrink-0 border border-stone-200">
                            {p.primary_image ? (
                              <Image
                                src={p.primary_image}
                                alt={p.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Gem className="h-5 w-5 text-amber-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-stone-900 truncate max-w-[260px]">
                              {p.name}
                            </p>
                            <p className="text-xs text-stone-500 font-mono">
                              {p.sku}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell text-stone-600">
                        {p.category_name || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-stone-900">
                            {formatCurrency(p.sale_price || p.price)}
                          </p>
                          {p.sale_price && Number(p.sale_price) < Number(p.price) && (
                            <p className="text-xs text-stone-400 line-through">
                              {formatCurrency(p.price)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
                            isLowStock
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-stone-50 text-stone-700 border-stone-200'
                          )}
                        >
                          {isLowStock && (
                            <AlertTriangle className="h-3 w-3" />
                          )}
                          {p.stock_quantity}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span
                            className={cn(
                              'inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide border',
                              STATUS_STYLES[p.status] ||
                                'bg-stone-100 text-stone-700 border-stone-200'
                            )}
                          >
                            {p.status}
                          </span>
                          {p.featured ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                              Featured
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/products/${p.id}/edit`}>
                            <button
                              title="Edit"
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={deleting === p.id}
                            title="Archive"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-5 py-4 border-t border-stone-100 flex items-center justify-between gap-4">
            <p className="text-xs text-stone-500">
              Page <span className="font-semibold text-stone-900">{page}</span>{' '}
              of <span className="font-semibold text-stone-900">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border-stone-200 text-stone-700 hover:bg-amber-50 hover:border-amber-300 disabled:opacity-40"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border-stone-200 text-stone-700 hover:bg-amber-50 hover:border-amber-300 disabled:opacity-40"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, tone = 'amber' }) {
  const tones = {
    amber: 'from-amber-500 to-amber-400 shadow-amber-500/25',
    emerald: 'from-emerald-500 to-emerald-400 shadow-emerald-500/25',
    red: 'from-red-500 to-red-400 shadow-red-500/25',
    purple: 'from-purple-500 to-purple-400 shadow-purple-500/25',
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
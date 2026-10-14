// src/app/(dashboard)/dashboard/orders/OrdersClient.jsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  ChevronDown,
  Eye,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/helpers'

const LIMIT = 15

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
]

const PAYMENT_OPTIONS = [
  { value: 'all', label: 'All Payments' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
]

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-800 border-blue-200',
  processing: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  shipped: 'bg-purple-50 text-purple-800 border-purple-200',
  delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-50 text-red-800 border-red-200',
  returned: 'bg-stone-100 text-stone-700 border-stone-200',
}

const PAYMENT_STYLES = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  paid: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  failed: 'bg-red-50 text-red-800 border-red-200',
  refunded: 'bg-stone-100 text-stone-700 border-stone-200',
}

export function OrdersClient() {
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [payment, setPayment] = useState('all')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        status,
        payment,
      })
      if (debouncedSearch) params.set('search', debouncedSearch)

      const res = await fetch(`/api/orders/admin?${params}`)
      const data = await res.json()

      if (data.success) {
        setOrders(data.data || [])
        setStats(data.stats || {})
        setTotal(data.pagination?.total || 0)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }, [page, status, payment, debouncedSearch])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  useEffect(() => {
    setPage(1)
  }, [status, payment, debouncedSearch])

  const clearFilters = () => {
    setSearch('')
    setStatus('all')
    setPayment('all')
    setPage(1)
  }

  const hasActiveFilters =
    search || status !== 'all' || payment !== 'all'

  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatCurrency = (n) =>
    `PKR ${Number(n || 0).toLocaleString('en-PK')}`

  return (
    <div className="min-h-screen bg-[#fffdf7] p-4 sm:p-6 lg:p-8">
      {/* ═══ HEADER ═══ */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/25">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl  font-bold text-stone-900">
              Orders
            </h1>
            <p className="text-sm text-stone-500">
              Manage customer orders and track fulfilment
            </p>
          </div>
        </div>
      </div>

      {/* ═══ STATS ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={stats.total_orders || 0}
          tone="amber"
        />
        <StatCard
          icon={TrendingUp}
          label="Revenue"
          value={formatCurrency(stats.revenue)}
          tone="emerald"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={(stats.pending || 0) + (stats.confirmed || 0)}
          tone="blue"
        />
        <StatCard
          icon={Truck}
          label="Shipped"
          value={stats.shipped || 0}
          tone="purple"
        />
      </div>

      {/* ═══ FILTERS ═══ */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 md:p-5 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by order #, name, email, phone..."
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

          {/* Status */}
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

          {/* Payment */}
          <div className="relative">
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="appearance-none w-full lg:w-44 pl-4 pr-9 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 focus:bg-white cursor-pointer"
            >
              {PAYMENT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
          </div>

          {/* Refresh / Clear */}
          <Button
            variant="outline"
            onClick={fetchOrders}
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

      {/* ═══ TABLE ═══ */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        {/* Results count bar */}
        <div className="px-5 py-3 border-b border-stone-100 flex items-center justify-between">
          <p className="text-sm text-stone-500 font-medium">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Loading orders...
              </span>
            ) : (
              <>
                <span className="text-stone-900 font-bold">{total}</span>{' '}
                {total === 1 ? 'order' : 'orders'}
              </>
            )}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Order
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Customer
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500 hidden md:table-cell">
                  Date
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500 hidden lg:table-cell">
                  Items
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Total
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Status
                </th>
                <th className="text-right px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-stone-100">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-stone-100 rounded-full animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border border-amber-100 mb-4">
                      <Package className="h-7 w-7 text-amber-600" />
                    </div>
                    <p className="text-stone-900 font-semibold mb-1">
                      No orders found
                    </p>
                    <p className="text-stone-500 text-sm">
                      {hasActiveFilters
                        ? 'Try adjusting your filters or search terms.'
                        : 'Orders will appear here once customers start placing them.'}
                    </p>
                  </td>
                </tr>
              ) : (
                orders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.25 }}
                    className="border-b border-stone-100 last:border-0 hover:bg-amber-50/40 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                        {order.order_number}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-stone-900">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-stone-500 truncate max-w-[200px]">
                        {order.customer_email}
                      </p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-stone-600">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="inline-flex items-center gap-1.5 text-stone-600">
                        <Package className="h-3.5 w-3.5" />
                        {order.item_count}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-stone-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <StatusBadge
                          status={order.order_status}
                          styles={STATUS_STYLES}
                        />
                        <StatusBadge
                          status={order.payment_status}
                          styles={PAYMENT_STYLES}
                          small
                          prefix="Pay"
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors">
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                      </Link>
                    </td>
                  </motion.tr>
                ))
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

/* ─── Sub-components ─── */

function StatCard({ icon: Icon, label, value, tone = 'amber' }) {
  const tones = {
    amber: 'from-amber-500 to-amber-400 shadow-amber-500/25',
    emerald: 'from-emerald-500 to-emerald-400 shadow-emerald-500/25',
    blue: 'from-blue-500 to-blue-400 shadow-blue-500/25',
    purple: 'from-purple-500 to-purple-400 shadow-purple-500/25',
  }
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 md:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br',
            tones[tone] || tones.amber
          )}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
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

function StatusBadge({ status, styles, small = false, prefix = '' }) {
  const cls = styles[status] || 'bg-stone-100 text-stone-700 border-stone-200'
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold border rounded-full',
        small ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]',
        'uppercase tracking-wide',
        cls
      )}
    >
      {prefix && <span className="mr-1 opacity-70">{prefix}:</span>}
      {status}
    </span>
  )
}
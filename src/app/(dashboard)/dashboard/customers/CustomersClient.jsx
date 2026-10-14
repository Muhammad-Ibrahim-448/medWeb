'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Search,
  X,
  ChevronDown,
  Eye,
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  RefreshCw,
  Crown,
  Mail,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/helpers'

const LIMIT = 15

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name_asc', label: 'Name: A → Z' },
  { value: 'orders_desc', label: 'Most Orders' },
  { value: 'spent_desc', label: 'Highest Spent' },
]

const STATUS_STYLES = {
  active: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  inactive: 'bg-stone-100 text-stone-700 border-stone-200',
  suspended: 'bg-red-50 text-red-800 border-red-200',
}

export function CustomersClient() {
  const [customers, setCustomers] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        status,
        sort,
      })
      if (debouncedSearch) params.set('search', debouncedSearch)

      const res = await fetch(`/api/users/admin?${params}`)
      const data = await res.json()

      if (data.success) {
        setCustomers(data.data || [])
        setStats(data.stats || {})
        setTotal(data.pagination?.total || 0)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err)
    } finally {
      setLoading(false)
    }
  }, [page, status, sort, debouncedSearch])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  useEffect(() => {
    setPage(1)
  }, [status, sort, debouncedSearch])

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

  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  const isVip = (c) => Number(c.total_spent) >= 100000

  return (
    <div className="min-h-screen bg-[#fffdf7] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/25">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl  font-bold text-stone-900">
              Customers
            </h1>
            <p className="text-sm text-stone-500">
              Manage your customer relationships
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Total Customers"
          value={stats.customers || 0}
          tone="amber"
        />
        <StatCard
          icon={UserCheck}
          label="Active"
          value={stats.active || 0}
          tone="emerald"
        />
        <StatCard
          icon={UserX}
          label="Suspended"
          value={stats.suspended || 0}
          tone="red"
        />
        <StatCard
          icon={TrendingUp}
          label="New (30d)"
          value={stats.new_last_30d || 0}
          tone="purple"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 md:p-5 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
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
            onClick={fetchCustomers}
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
                Loading customers...
              </span>
            ) : (
              <>
                <span className="text-stone-900 font-bold">{total}</span>{' '}
                {total === 1 ? 'customer' : 'customers'}
              </>
            )}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Customer
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500 hidden md:table-cell">
                  Contact
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500 hidden lg:table-cell">
                  Joined
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Orders
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Total Spent
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
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border border-amber-100 mb-4">
                      <Users className="h-7 w-7 text-amber-600" />
                    </div>
                    <p className="text-stone-900 font-semibold mb-1">
                      No customers found
                    </p>
                    <p className="text-stone-500 text-sm">
                      {hasActiveFilters
                        ? 'Try adjusting your filters.'
                        : 'Customers will appear here once they register.'}
                    </p>
                  </td>
                </tr>
              ) : (
                customers.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.25 }}
                    className="border-b border-stone-100 last:border-0 hover:bg-amber-50/40 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-md shadow-amber-500/25">
                            {getInitials(c.name)}
                          </div>
                          {isVip(c) && (
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 border-2 border-white flex items-center justify-center shadow">
                              <Crown className="h-2.5 w-2.5 text-white fill-white" />
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-900 truncate max-w-[220px]">
                            {c.name}
                          </p>
                          <p className="text-xs text-stone-500 truncate max-w-[220px]">
                            #{c.id}
                            {isVip(c) && (
                              <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                                VIP
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <p className="flex items-center gap-1.5 text-stone-700 text-xs truncate max-w-[200px]">
                          <Mail className="h-3 w-3 text-stone-400 flex-shrink-0" />
                          <span className="truncate">{c.email}</span>
                        </p>
                        {c.phone && (
                          <p className="flex items-center gap-1.5 text-stone-500 text-xs">
                            <Phone className="h-3 w-3 text-stone-400 flex-shrink-0" />
                            {c.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-stone-600 text-xs">
                      {formatDate(c.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-stone-50 text-stone-700 border-stone-200">
                        {c.order_count}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-stone-900">
                      {formatCurrency(c.total_spent)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide border',
                          STATUS_STYLES[c.status] ||
                            'bg-stone-100 text-stone-700 border-stone-200'
                        )}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/dashboard/customers/${c.id}`}>
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
              of{' '}
              <span className="font-semibold text-stone-900">{totalPages}</span>
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
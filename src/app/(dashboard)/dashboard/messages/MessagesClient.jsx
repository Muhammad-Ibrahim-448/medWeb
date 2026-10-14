'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Search,
  X,
  ChevronDown,
  Eye,
  Mail,
  MailOpen,
  Reply,
  Archive,
  AlertOctagon,
  Inbox,
  RefreshCw,
  Clock,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/helpers'

const LIMIT = 15

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Messages' },
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
  { value: 'archived', label: 'Archived' },
  { value: 'spam', label: 'Spam' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name_asc', label: 'Name: A → Z' },
  { value: 'status_asc', label: 'By Status' },
]

const STATUS_STYLES = {
  new: 'bg-amber-100 text-amber-800 border-amber-200',
  read: 'bg-blue-50 text-blue-700 border-blue-200',
  replied: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  archived: 'bg-stone-100 text-stone-700 border-stone-200',
  spam: 'bg-red-50 text-red-800 border-red-200',
}

const STATUS_ICONS = {
  new: Mail,
  read: MailOpen,
  replied: Reply,
  archived: Archive,
  spam: AlertOctagon,
}

export function MessagesClient() {
  const [messages, setMessages] = useState([])
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

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        status,
        sort,
      })
      if (debouncedSearch) params.set('search', debouncedSearch)

      const res = await fetch(`/api/contact/admin?${params}`)
      const data = await res.json()

      if (data.success) {
        setMessages(data.data || [])
        setStats(data.stats || {})
        setTotal(data.pagination?.total || 0)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    } finally {
      setLoading(false)
    }
  }, [page, status, sort, debouncedSearch])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  useEffect(() => {
    setPage(1)
  }, [status, sort, debouncedSearch])

  const clearFilters = () => {
    setSearch('')
    setStatus('all')
    setSort('newest')
    setPage(1)
  }

  const hasActiveFilters =
    search || status !== 'all' || sort !== 'newest'

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '—'

  const formatTime = (d) => {
    if (!d) return ''
    const diff = (Date.now() - new Date(d)) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return formatDate(d)
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-[#fffdf7] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/25">
            <Inbox className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl  font-bold text-stone-900">
              Messages
            </h1>
            <p className="text-sm text-stone-500">
              Customer enquiries from your contact form
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={MessageSquare}
          label="Total"
          value={stats.total || 0}
          tone="amber"
        />
        <StatCard
          icon={Mail}
          label="New"
          value={stats.new_count || 0}
          tone="blue"
        />
        <StatCard
          icon={Reply}
          label="Replied"
          value={stats.replied || 0}
          tone="emerald"
        />
        <StatCard
          icon={Clock}
          label="Last 7 Days"
          value={stats.last_7d || 0}
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
              placeholder="Search by name, email, subject, or message..."
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
            onClick={fetchMessages}
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

      {/* List */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-stone-100">
          <p className="text-sm text-stone-500 font-medium">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Loading messages...
              </span>
            ) : (
              <>
                <span className="text-stone-900 font-bold">{total}</span>{' '}
                {total === 1 ? 'message' : 'messages'}
              </>
            )}
          </p>
        </div>

        {loading ? (
          <div className="divide-y divide-stone-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <MessageSkeleton key={i} />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <EmptyState hasFilters={hasActiveFilters} />
        ) : (
          <div className="divide-y divide-stone-100">
            {messages.map((msg, i) => {
              const StatusIcon = STATUS_ICONS[msg.status] || Mail
              const isUnread = msg.status === 'new'

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                >
                  <Link
                    href={`/dashboard/messages/${msg.id}`}
                    className={cn(
                      'flex items-start gap-4 px-5 py-4 hover:bg-amber-50/40 transition-colors',
                      isUnread && 'bg-amber-50/30'
                    )}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-amber-500/25">
                        {getInitials(msg.name)}
                      </div>
                      {isUnread && (
                        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p
                              className={cn(
                                'font-semibold truncate max-w-full',
                                isUnread
                                  ? 'text-stone-900'
                                  : 'text-stone-800'
                              )}
                            >
                              {msg.name}
                            </p>
                            <span className="text-xs text-stone-400 hidden sm:inline">
                              &lt;{msg.email}&gt;
                            </span>
                          </div>
                          {msg.subject && (
                            <p
                              className={cn(
                                'text-sm truncate mt-0.5',
                                isUnread
                                  ? 'font-semibold text-stone-900'
                                  : 'text-stone-700'
                              )}
                            >
                              {msg.subject}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-[11px] text-stone-400 whitespace-nowrap">
                            {formatTime(msg.created_at)}
                          </span>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border',
                              STATUS_STYLES[msg.status] ||
                                'bg-stone-100 text-stone-700 border-stone-200'
                            )}
                          >
                            <StatusIcon className="h-2.5 w-2.5" />
                            {msg.status}
                          </span>
                        </div>
                      </div>

                      <p
                        className={cn(
                          'text-sm line-clamp-1 mt-1',
                          isUnread
                            ? 'text-stone-700'
                            : 'text-stone-500'
                        )}
                      >
                        {msg.message}
                      </p>
                    </div>

                    {/* Action arrow */}
                    <div className="self-center hidden sm:block">
                      <div className="w-8 h-8 rounded-full hover:bg-amber-100 flex items-center justify-center transition-colors">
                        <Eye className="h-4 w-4 text-amber-700" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-5 py-4 border-t border-stone-100 flex items-center justify-between gap-4">
            <p className="text-xs text-stone-500">
              Page{' '}
              <span className="font-semibold text-stone-900">{page}</span> of{' '}
              <span className="font-semibold text-stone-900">
                {totalPages}
              </span>
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
    blue: 'from-blue-500 to-blue-400 shadow-blue-500/25',
    purple: 'from-purple-500 to-purple-400 shadow-purple-500/25',
    red: 'from-red-500 to-red-400 shadow-red-500/25',
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

function MessageSkeleton() {
  return (
    <div className="flex items-start gap-4 px-5 py-4">
      <div className="w-11 h-11 rounded-full bg-stone-100 animate-pulse flex-shrink-0" />
      <div className="flex-1">
        <div className="w-40 h-4 bg-stone-100 rounded-full animate-pulse mb-2" />
        <div className="w-3/4 h-3 bg-stone-100 rounded-full animate-pulse mb-2" />
        <div className="w-2/3 h-3 bg-stone-100 rounded-full animate-pulse" />
      </div>
      <div className="w-20 h-4 bg-stone-100 rounded-full animate-pulse flex-shrink-0" />
    </div>
  )
}

function EmptyState({ hasFilters }) {
  return (
    <div className="text-center py-20 px-5">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border border-amber-100 mb-4">
        <Inbox className="h-7 w-7 text-amber-600" />
      </div>
      <h3 className="text-xl  font-bold text-stone-900 mb-2">
        {hasFilters ? 'No messages found' : 'Inbox is empty'}
      </h3>
      <p className="text-sm text-stone-500 max-w-md mx-auto">
        {hasFilters
          ? 'Try adjusting your filters or search terms.'
          : 'Messages from your contact form will appear here.'}
      </p>
    </div>
  )
}
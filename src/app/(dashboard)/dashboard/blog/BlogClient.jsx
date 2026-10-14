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
  BookOpen,
  FileText,
  CheckCircle2,
  Calendar,
  Gem,
  RefreshCw,
  User,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/helpers'

const LIMIT = 12

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title_asc', label: 'Title: A → Z' },
  { value: 'published_desc', label: 'Recently Published' },
]

const STATUS_STYLES = {
  published: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  draft: 'bg-amber-50 text-amber-800 border-amber-200',
}

export function BlogClient() {
  const [posts, setPosts] = useState([])
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

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        status,
        sort,
      })
      if (debouncedSearch) params.set('search', debouncedSearch)

      const res = await fetch(`/api/blog/admin?${params}`)
      const data = await res.json()

      if (data.success) {
        setPosts(data.data || [])
        setStats(data.stats || {})
        setTotal(data.pagination?.total || 0)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (err) {
      console.error('Failed to fetch blog posts:', err)
    } finally {
      setLoading(false)
    }
  }, [page, status, sort, debouncedSearch])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    setPage(1)
  }, [status, sort, debouncedSearch])

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?\n\nThis action cannot be undone.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchPosts()
      } else {
        alert(data.message || 'Failed to delete post')
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

  return (
    <div className="min-h-screen bg-[#fffdf7] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/25">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl  font-bold text-stone-900">
              Journal
            </h1>
            <p className="text-sm text-stone-500">
              Stories, guides and inspiration for your readers
            </p>
          </div>
        </div>

        <Link href="/dashboard/blog/new">
          <Button className="bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white border-0 rounded-xl shadow-md shadow-amber-600/25">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={FileText}
          label="Total Posts"
          value={stats.total || 0}
          tone="amber"
        />
        <StatCard
          icon={CheckCircle2}
          label="Published"
          value={stats.published || 0}
          tone="emerald"
        />
        <StatCard
          icon={BookOpen}
          label="Drafts"
          value={stats.draft || 0}
          tone="amber2"
        />
        <StatCard
          icon={Calendar}
          label="Last 30 Days"
          value={stats.published_last_30d || 0}
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
              placeholder="Search by title, excerpt, or slug..."
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
            onClick={fetchPosts}
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
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState hasFilters={hasActiveFilters} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="group"
            >
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-amber-900/10 hover:border-amber-200 transition-all duration-300 flex flex-col h-full">
                {/* Cover */}
                <div className="relative aspect-[16/10] bg-gradient-to-br from-amber-50 to-stone-100 overflow-hidden">
                  {post.cover_image ? (
                    <Image
                      src={post.cover_image}
                      alt={post.title}
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

                  <div className="absolute top-3 left-3">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm',
                        STATUS_STYLES[post.status] ||
                          'bg-stone-100 text-stone-700 border-stone-200'
                      )}
                    >
                      {post.status}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className=" font-bold text-lg text-stone-900 leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                  </div>

                  {post.excerpt && (
                    <p className="text-sm text-stone-500 line-clamp-2 mb-4 flex-1">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 pt-3 border-t border-stone-100">
                    {post.author_name && (
                      <span className="inline-flex items-center gap-1.5">
                        <User className="h-3 w-3 text-amber-600" />
                        {post.author_name}
                      </span>
                    )}
                    {post.published_at && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-amber-600" />
                        {formatDate(post.published_at)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <Link
                      href={`/dashboard/blog/${post.id}/edit`}
                      className="flex-1"
                    >
                      <button className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={deleting === post.id}
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

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => {
              setPage((p) => Math.max(1, p - 1))
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="rounded-xl border-stone-200 text-stone-700 hover:bg-amber-50 hover:border-amber-300 disabled:opacity-40"
          >
            Previous
          </Button>
          <p className="text-xs text-stone-500 px-3">
            Page <span className="font-semibold text-stone-900">{page}</span>{' '}
            of <span className="font-semibold text-stone-900">{totalPages}</span>
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1))
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="rounded-xl border-stone-200 text-stone-700 hover:bg-amber-50 hover:border-amber-300 disabled:opacity-40"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, tone = 'amber' }) {
  const tones = {
    amber: 'from-amber-500 to-amber-400 shadow-amber-500/25',
    amber2: 'from-yellow-500 to-amber-400 shadow-amber-500/25',
    emerald: 'from-emerald-500 to-emerald-400 shadow-emerald-500/25',
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

function PostSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      <div className="aspect-[16/10] bg-stone-100 animate-pulse" />
      <div className="p-5">
        <div className="w-full h-6 bg-stone-100 rounded-lg animate-pulse mb-2" />
        <div className="w-3/4 h-6 bg-stone-100 rounded-lg animate-pulse mb-4" />
        <div className="w-full h-3 bg-stone-100 rounded-full animate-pulse mb-2" />
        <div className="w-2/3 h-3 bg-stone-100 rounded-full animate-pulse mb-4" />
        <div className="flex gap-2 pt-3 border-t border-stone-100">
          <div className="w-24 h-3 bg-stone-100 rounded-full animate-pulse" />
          <div className="w-20 h-3 bg-stone-100 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ hasFilters }) {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border border-amber-100 mb-4">
        <BookOpen className="h-7 w-7 text-amber-600" />
      </div>
      <h3 className="text-xl  font-bold text-stone-900 mb-2">
        No posts found
      </h3>
      <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
        {hasFilters
          ? 'Try adjusting your filters or search terms.'
          : 'Start by writing your first journal entry.'}
      </p>
      {!hasFilters && (
        <Link href="/dashboard/blog/new">
          <Button className="bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white border-0 rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      )}
    </div>
  )
}
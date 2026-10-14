'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  Reply,
  Archive,
  AlertOctagon,
  MailOpen,
  Trash2,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Globe,
  Save,
  Send,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/helpers'

const STATUS_STYLES = {
  new: 'bg-amber-100 text-amber-800 border-amber-200',
  read: 'bg-blue-50 text-blue-700 border-blue-200',
  replied: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  archived: 'bg-stone-100 text-stone-700 border-stone-200',
  spam: 'bg-red-50 text-red-800 border-red-200',
}

const STATUSES = [
  { value: 'new', label: 'New', icon: Mail },
  { value: 'read', label: 'Read', icon: MailOpen },
  { value: 'replied', label: 'Replied', icon: Reply },
  { value: 'archived', label: 'Archived', icon: Archive },
  { value: 'spam', label: 'Spam', icon: AlertOctagon },
]

export function MessageDetailClient() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id

  const [message, setMessage] = useState(null)
  const [state, setState] = useState('loading')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [status, setStatus] = useState('')
  const [adminNotes, setAdminNotes] = useState('')

  useEffect(() => {
    if (!id) {
      setState('notfound')
      return
    }
    let cancelled = false

    ;(async () => {
      setState('loading')
      try {
        const res = await fetch(`/api/contact/admin/${id}`)
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

        setMessage(data.data)
        setStatus(data.data.status)
        setAdminNotes(data.data.admin_notes || '')
        setState('ready')
      } catch (err) {
        console.error(err)
        if (!cancelled) setState('notfound')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setFeedback(null)
    try {
      const res = await fetch(`/api/contact/admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_notes: adminNotes }),
      })
      const data = await res.json()
      if (data.success) {
        setFeedback({ type: 'success', message: 'Message updated' })
        setMessage((m) => ({
          ...m,
          status,
          admin_notes: adminNotes,
        }))
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'Update failed',
        })
      }
    } catch {
      setFeedback({ type: 'error', message: 'Something went wrong' })
    } finally {
      setSaving(false)
      setTimeout(() => setFeedback(null), 3500)
    }
  }

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus)
    // Auto-save status change for quick actions
    try {
      const res = await fetch(`/api/contact/admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage((m) => ({ ...m, status: newStatus }))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this message?\n\nThis action cannot be undone.')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/contact/admin/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        router.push('/dashboard/messages')
      } else {
        alert(data.message || 'Failed to delete')
        setDeleting(false)
      }
    } catch {
      alert('Something went wrong')
      setDeleting(false)
    }
  }

  const handleReplyByEmail = () => {
    if (!message?.email) return
    const subject = message.subject
      ? `Re: ${message.subject}`
      : 'Re: Your enquiry'
    const url = `mailto:${message.email}?subject=${encodeURIComponent(
      subject
    )}`
    window.location.href = url
    // Auto-mark as replied
    setTimeout(() => handleStatusChange('replied'), 500)
  }

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—'

  const formatDateShort = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '—'

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-[#fffdf7] p-8 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
        <p className="text-sm text-stone-500">Loading message…</p>
      </div>
    )
  }

  if (state === 'notfound' || !message) {
    return (
      <div className="min-h-screen bg-[#fffdf7] p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border border-amber-100 mb-4">
            <AlertCircle className="h-7 w-7 text-amber-600" />
          </div>
          <h1 className="text-2xl  font-bold text-stone-900 mb-2">
            Message not found
          </h1>
          <p className="text-stone-500 mb-6">
            This message may have been deleted.
          </p>
          <Link href="/dashboard/messages">
            <Button className="bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white border-0 rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inbox
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffdf7] p-4 sm:p-6 lg:p-8">
      <Link
        href="/dashboard/messages"
        className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 mb-5 font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Inbox
      </Link>

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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT — message content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start gap-4 pb-6 border-b border-stone-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-amber-500/25 flex-shrink-0">
                {message.name
                  ?.split(' ')
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() || '?'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl  font-bold text-stone-900">
                    {message.name}
                  </h1>
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                      STATUS_STYLES[message.status]
                    )}
                  >
                    {message.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-600">
                  <a
                    href={`mailto:${message.email}`}
                    className="inline-flex items-center gap-2 hover:text-amber-700 transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 text-amber-600" />
                    {message.email}
                  </a>
                  {message.phone && (
                    <a
                      href={`tel:${message.phone}`}
                      className="inline-flex items-center gap-2 hover:text-amber-700 transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5 text-amber-600" />
                      {message.phone}
                    </a>
                  )}
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-amber-600" />
                    {formatDate(message.created_at)}
                  </span>
                </div>
              </div>

              {/* Reply button */}
              <Button
                onClick={handleReplyByEmail}
                className="bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white border-0 rounded-xl shadow-md shadow-amber-600/25"
              >
                <Send className="h-4 w-4 mr-2" />
                Reply
              </Button>
            </div>

            {/* Subject */}
            {message.subject && (
              <div className="pt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Subject
                </p>
                <p className="text-lg  font-semibold text-stone-900">
                  {message.subject}
                </p>
              </div>
            )}

            {/* Message body */}
            <div className="pt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Message
              </p>
              <div className="rounded-2xl bg-stone-50 border border-stone-200 p-5">
                <p className="text-stone-800 whitespace-pre-wrap leading-relaxed">
                  {message.message}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="pt-6 mt-6 border-t border-stone-100 flex flex-wrap gap-x-6 gap-y-3 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Received {formatDateShort(message.created_at)}
              </span>
              {message.ip_address && (
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="h-3 w-3" />
                  {message.ip_address}
                </span>
              )}
              {message.replied_at && (
                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
                  Replied {formatDateShort(message.replied_at)}
                  {message.replied_by_name
                    ? ` by ${message.replied_by_name}`
                    : ''}
                </span>
              )}
            </div>
          </motion.div>

          {/* Admin Notes */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <h2 className=" font-bold text-stone-900 text-lg mb-4 pb-3 border-b border-stone-100">
              Internal Notes
            </h2>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              placeholder="Add private notes about this enquiry..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 focus:bg-white transition-all resize-none"
            />
            <Button
              onClick={handleSave}
              disabled={saving}
              className="mt-3 bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white border-0 rounded-xl shadow-md shadow-amber-600/25 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Notes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* RIGHT — sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <h2 className=" font-bold text-stone-900 text-lg mb-4 pb-3 border-b border-stone-100">
              Status
            </h2>
            <div className="space-y-2">
              {STATUSES.map((s) => {
                const Icon = s.icon
                const isActive = message.status === s.value
                return (
                  <button
                    key={s.value}
                    onClick={() => handleStatusChange(s.value)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
                      isActive
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'text-stone-600 hover:bg-stone-50 border border-transparent'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {s.label}
                    {isActive && (
                      <CheckCircle2 className="h-3.5 w-3.5 ml-auto text-amber-600" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <h2 className=" font-bold text-stone-900 text-lg mb-4 pb-3 border-b border-stone-100">
              Actions
            </h2>
            <div className="space-y-2">
              <a
                href={`mailto:${message.email}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-50 border border-amber-200 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Send Email
              </a>
              {message.phone && (
                <a
                  href={`tel:${message.phone}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-50 border border-amber-200 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
              )}
              <button
                onClick={() => handleStatusChange('archived')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100 border border-stone-200 transition-colors"
              >
                <Archive className="h-4 w-4" />
                Archive
              </button>
              <button
                onClick={() => handleStatusChange('spam')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-50 border border-amber-200 transition-colors"
              >
                <AlertOctagon className="h-4 w-4" />
                Mark as Spam
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3">
              Handling Tips
            </p>
            <ul className="space-y-2 text-xs text-amber-900/80">
              <li>• Reply within 24 hours for best customer experience</li>
              <li>• The message is auto-marked as read when opened</li>
              <li>• Marking as replied stamps the timestamp automatically</li>
              <li>• Use internal notes for context between team members</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
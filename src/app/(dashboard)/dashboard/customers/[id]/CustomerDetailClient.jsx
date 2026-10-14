'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  TrendingUp,
  MapPin,
  Crown,
  UserCheck,
  UserX,
  Loader2,
  AlertCircle,
  Save,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/helpers'

const STATUS_STYLES = {
  active: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  inactive: 'bg-stone-100 text-stone-700 border-stone-200',
  suspended: 'bg-red-50 text-red-800 border-red-200',
}

const ORDER_STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-800 border-blue-200',
  processing: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  shipped: 'bg-purple-50 text-purple-800 border-purple-200',
  delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-50 text-red-800 border-red-200',
  returned: 'bg-stone-100 text-stone-700 border-stone-200',
}

export function CustomerDetailClient() {
  const params = useParams()
  const id = params?.id

  const [customer, setCustomer] = useState(null)
  const [state, setState] = useState('loading')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const [status, setStatus] = useState('active')
  const [role, setRole] = useState('customer')

  useEffect(() => {
    if (!id) {
      setState('notfound')
      return
    }
    let cancelled = false

    ;(async () => {
      setState('loading')
      try {
        const res = await fetch(`/api/users/admin/${id}`)
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
        setCustomer(data.data)
        setStatus(data.data.status)
        setRole(data.data.role)
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
      const res = await fetch(`/api/users/admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, role }),
      })
      const data = await res.json()
      if (data.success) {
        setFeedback({ type: 'success', message: 'Customer updated' })
        setCustomer((c) => ({ ...c, status, role }))
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

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
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

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-[#fffdf7] p-8 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
        <p className="text-sm text-stone-500">Loading customer…</p>
      </div>
    )
  }

  if (state === 'notfound' || !customer) {
    return (
      <div className="min-h-screen bg-[#fffdf7] p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border border-amber-100 mb-4">
            <AlertCircle className="h-7 w-7 text-amber-600" />
          </div>
          <h1 className="text-2xl  font-bold text-stone-900 mb-2">
            Customer not found
          </h1>
          <p className="text-stone-500 mb-6">
            We couldn't load this customer. They may have been removed.
          </p>
          <Link href="/dashboard/customers">
            <Button className="bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white border-0 rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isVip = Number(customer.stats?.total_spent || 0) >= 100000

  return (
    <div className="min-h-screen bg-[#fffdf7] p-4 sm:p-6 lg:p-8">
      <Link
        href="/dashboard/customers"
        className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 mb-5 font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Customers
      </Link>

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center text-white font-bold text-2xl md:text-3xl shadow-lg shadow-amber-500/30">
              {getInitials(customer.name)}
            </div>
            {isVip && (
              <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 border-4 border-white flex items-center justify-center shadow-md">
                <Crown className="h-4 w-4 text-white fill-white" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl  font-bold text-stone-900 truncate">
                {customer.name}
              </h1>
              {isVip && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 border border-amber-200 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  <Crown className="h-3 w-3" />
                  VIP Customer
                </span>
              )}
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                  STATUS_STYLES[customer.status]
                )}
              >
                {customer.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600">
              <span className="inline-flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-amber-600" />
                {customer.email}
              </span>
              {customer.phone && (
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-amber-600" />
                  {customer.phone}
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-amber-600" />
                Joined {formatDate(customer.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-100">
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-wider font-medium mb-1">
              Orders
            </p>
            <p className="text-2xl  font-bold text-stone-900">
              {customer.stats?.order_count || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-wider font-medium mb-1">
              Total Spent
            </p>
            <p className="text-2xl  font-bold text-stone-900">
              {formatCurrency(customer.stats?.total_spent)}
            </p>
          </div>
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-wider font-medium mb-1">
              Avg Order
            </p>
            <p className="text-2xl  font-bold text-stone-900">
              {formatCurrency(customer.stats?.avg_order_value)}
            </p>
          </div>
        </div>
      </motion.div>

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
        {/* LEFT — orders + addresses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Orders */}
          <Section
            title={`Order History (${customer.orders?.length || 0})`}
            icon={ShoppingBag}
          >
            {!customer.orders?.length ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 border border-amber-100 mb-3">
                  <ShoppingBag className="h-6 w-6 text-amber-600" />
                </div>
                <p className="text-sm text-stone-500">
                  No orders yet from this customer.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-100">
                      <th className="text-left px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                        Order
                      </th>
                      <th className="text-left px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                        Date
                      </th>
                      <th className="text-left px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                        Total
                      </th>
                      <th className="text-left px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.orders.map((o) => (
                      <tr
                        key={o.id}
                        className="border-b border-stone-100 last:border-0 hover:bg-amber-50/40 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <Link
                            href={`/dashboard/orders/${o.id}`}
                            className="font-mono text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 hover:bg-amber-100 transition-colors inline-block"
                          >
                            {o.order_number}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-stone-600 text-xs">
                          {formatDate(o.created_at)}
                        </td>
                        <td className="px-5 py-3 font-semibold text-stone-900">
                          {formatCurrency(o.total)}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={cn(
                              'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border',
                              ORDER_STATUS_STYLES[o.order_status] ||
                                'bg-stone-100 text-stone-700 border-stone-200'
                            )}
                          >
                            {o.order_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* Addresses */}
          <Section title={`Addresses (${customer.addresses?.length || 0})`} icon={MapPin}>
            {!customer.addresses?.length ? (
              <p className="text-sm text-stone-500 py-4">
                No saved addresses.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {customer.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="rounded-xl border border-stone-200 bg-stone-50/50 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
                        <MapPin className="h-3 w-3" />
                        {addr.label || 'Address'}
                      </span>
                      {addr.is_default ? (
                        <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-2 py-0.5">
                          Default
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm font-semibold text-stone-900">
                      {addr.full_name}
                    </p>
                    <p className="text-xs text-stone-600 mt-1">
                      {addr.address_line1}
                      {addr.address_line2 ? `, ${addr.address_line2}` : ''}
                    </p>
                    <p className="text-xs text-stone-600">
                      {addr.city}
                      {addr.state ? `, ${addr.state}` : ''}
                      {addr.postal_code ? ` - ${addr.postal_code}` : ''}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      {addr.country}
                    </p>
                    <p className="text-xs text-stone-500 mt-2 pt-2 border-t border-stone-200 inline-flex items-center gap-1.5">
                      <Phone className="h-3 w-3" />
                      {addr.phone}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>

        {/* RIGHT — actions */}
        <div className="space-y-6">
          <Section title="Account Settings" icon={UserCheck}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputCls}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={inputCls}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <Button
              onClick={handleSave}
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
                  Save Changes
                </>
              )}
            </Button>
          </Section>

          <Section title="Quick Info" icon={TrendingUp}>
            <div className="space-y-3 text-sm">
              <InfoRow label="Customer ID" value={`#${customer.id}`} />
              <InfoRow
                label="Email Verified"
                value={customer.email_verified ? 'Yes' : 'No'}
              />
              <InfoRow
                label="Last Login"
                value={formatDate(customer.last_login_at)}
              />
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 focus:bg-white transition-all'

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
      <h2 className=" font-bold text-stone-900 text-lg mb-4 pb-3 border-b border-stone-100 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-amber-600" />}
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-stone-500">{label}</span>
      <span className="font-medium text-stone-900 text-right">{value}</span>
    </div>
  )
}
// src/app/(dashboard)/dashboard/orders/[id]/OrderDetailClient.jsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  Gem,
  Save,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/helpers'

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
]
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded']

export function OrderDetailClient() {
  const params = useParams()
  const id = params?.id

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [orderStatus, setOrderStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    ;(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/orders/admin/${id}`)
        const data = await res.json()
        if (cancelled) return
        if (!data.success) {
          setNotFound(true)
        } else {
          setOrder(data.data)
          setOrderStatus(data.data.order_status)
          setPaymentStatus(data.data.payment_status)
          setAdminNotes(data.data.admin_notes || '')
        }
      } catch {
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
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
      const res = await fetch(`/api/orders/admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_status: orderStatus,
          payment_status: paymentStatus,
          admin_notes: adminNotes,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setFeedback({ type: 'success', message: 'Order updated successfully' })
        // Refresh
        const r2 = await fetch(`/api/orders/admin/${id}`)
        const d2 = await r2.json()
        if (d2.success) setOrder(d2.data)
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'Failed to update order',
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

  if (loading) return <OrderDetailSkeleton />

  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-[#fffdf7] p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border border-amber-100 mb-4">
            <AlertCircle className="h-7 w-7 text-amber-600" />
          </div>
          <h1 className="text-2xl  font-bold text-stone-900 mb-2">
            Order not found
          </h1>
          <p className="text-stone-500 mb-6">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/dashboard/orders">
            <Button className="bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white border-0 rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffdf7] p-4 sm:p-6 lg:p-8">
      {/* Back link */}
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 mb-5 font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/25">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl  font-bold text-stone-900">
                Order {order.order_number}
              </h1>
              <p className="text-sm text-stone-500">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-stone-500 uppercase tracking-wider font-medium">
            Order Total
          </p>
          <p className="text-2xl  font-bold text-stone-900">
            {formatCurrency(order.total)}
          </p>
        </div>
      </div>

      {/* Feedback toast */}
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
          {feedback.message}
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT — Items & totals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100">
              <h2 className=" font-bold text-stone-900 text-lg">
                Items ({order.items?.length || 0})
              </h2>
            </div>
            <div className="divide-y divide-stone-100">
              {order.items?.map((item) => (
                <div key={item.id} className="p-4 flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-stone-100 flex-shrink-0 border border-stone-200">
                    {item.product_image ? (
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Gem className="h-6 w-6 text-amber-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 truncate">
                      {item.product_name}
                    </p>
                    {item.product_sku && (
                      <p className="text-xs text-stone-500 font-mono">
                        SKU: {item.product_sku}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-stone-900">
                      {formatCurrency(item.subtotal)}
                    </p>
                    <p className="text-xs text-stone-500">
                      {item.quantity} × {formatCurrency(item.product_price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="px-5 py-4 bg-stone-50 border-t border-stone-100 space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-medium">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span className="font-medium">
                  {formatCurrency(order.shipping_fee)}
                </span>
              </div>
              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-medium">
                    − {formatCurrency(order.discount_amount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-stone-200 text-base font-bold text-stone-900">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes (customer) */}
          {order.notes && (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
              <h2 className=" font-bold text-stone-900 mb-2">
                Customer Note
              </h2>
              <p className="text-sm text-stone-600 whitespace-pre-wrap">
                {order.notes}
              </p>
            </div>
          )}

          {/* Admin notes + controls */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
            <h2 className=" font-bold text-stone-900 mb-4">
              Update Order
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Order Status
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                placeholder="Internal notes about this order..."
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 resize-none"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white border-0 rounded-xl disabled:opacity-60"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* RIGHT — Customer / Shipping / Payment */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
            <h2 className=" font-bold text-stone-900 mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-amber-600" /> Customer
            </h2>
            <p className="font-semibold text-stone-900">
              {order.customer_name}
            </p>
            <div className="mt-3 space-y-2 text-sm text-stone-600">
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-stone-400" />
                <span className="truncate">{order.customer_email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-stone-400" />
                {order.customer_phone}
              </p>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
            <h2 className=" font-bold text-stone-900 mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-600" /> Shipping Address
            </h2>
            <div className="text-sm text-stone-600 space-y-1">
              <p className="font-semibold text-stone-900">
                {order.shipping_full_name}
              </p>
              <p>{order.shipping_address1}</p>
              {order.shipping_address2 && <p>{order.shipping_address2}</p>}
              <p>
                {order.shipping_city}
                {order.shipping_state ? `, ${order.shipping_state}` : ''}
                {order.shipping_postal_code
                  ? ` - ${order.shipping_postal_code}`
                  : ''}
              </p>
              <p>{order.shipping_country}</p>
              <p className="flex items-center gap-2 pt-2 border-t border-stone-100 mt-3">
                <Phone className="h-3.5 w-3.5 text-stone-400" />
                {order.shipping_phone}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
            <h2 className=" font-bold text-stone-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-amber-600" /> Payment
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Method</span>
                <span className="font-semibold text-stone-900 uppercase">
                  {order.payment_method}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Status</span>
                <span className="font-semibold text-stone-900 capitalize">
                  {order.payment_status}
                </span>
              </div>
              {order.transaction_id && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Transaction</span>
                  <span className="font-mono text-xs text-stone-900 truncate max-w-[140px]">
                    {order.transaction_id}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
            <h2 className=" font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-600" /> Timeline
            </h2>
            <div className="space-y-3 text-sm">
              <TimelineRow label="Placed" value={formatDate(order.created_at)} />
              {order.shipped_at && (
                <TimelineRow
                  label="Shipped"
                  value={formatDate(order.shipped_at)}
                />
              )}
              {order.delivered_at && (
                <TimelineRow
                  label="Delivered"
                  value={formatDate(order.delivered_at)}
                />
              )}
              {order.cancelled_at && (
                <TimelineRow
                  label="Cancelled"
                  value={formatDate(order.cancelled_at)}
                  tone="red"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TimelineRow({ label, value, tone = 'stone' }) {
  return (
    <div className="flex justify-between">
      <span className="text-stone-500">{label}</span>
      <span
        className={cn(
          'font-medium',
          tone === 'red' ? 'text-red-700' : 'text-stone-900'
        )}
      >
        {value}
      </span>
    </div>
  )
}

function OrderDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#fffdf7] p-8">
      <div className="w-40 h-4 bg-stone-100 rounded-full animate-pulse mb-6" />
      <div className="w-64 h-8 bg-stone-100 rounded-lg animate-pulse mb-8" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 h-96 animate-pulse" />
        <div className="bg-white rounded-2xl border border-stone-200 h-96 animate-pulse" />
      </div>
    </div>
  )
}
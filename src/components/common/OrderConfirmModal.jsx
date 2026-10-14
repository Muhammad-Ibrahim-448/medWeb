// src/components/common/OrderConfirmModal.jsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Phone,
  User,
  Home,
  Building2,
  Truck,
  Banknote,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/helpers';

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="block text-[10px] xs:text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 mb-1 xs:mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 xs:h-4 xs:w-4 text-slate-400"
            strokeWidth={1.75}
          />
        )}
        {children}
      </div>
    </div>
  );
}

export default function OrderConfirmModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  total,
  itemCount,
  subtotal,
  shipping,
  formatPrice,
  initialValues = {},
}) {
  const [form, setForm] = useState({
    fullName: initialValues.fullName || '',
    phone: initialValues.phone || '',
    address1: initialValues.address1 || '',
    address2: initialValues.address2 || '',
    city: initialValues.city || '',
    state: initialValues.state || '',
    postalCode: initialValues.postalCode || '',
    country: initialValues.country || 'Pakistan',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setErrors({});
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === 'Escape' && !loading && onClose?.();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, loading, onClose]);

  // Lock scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (typeof window === 'undefined') return null;

  const update = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.address1.trim()) errs.address1 = 'Address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onConfirm({
      shipping: {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        address1: form.address1.trim(),
        address2: form.address2.trim() || null,
        city: form.city.trim(),
        state: form.state.trim() || null,
        postalCode: form.postalCode.trim() || null,
        country: form.country.trim() || 'Pakistan',
      },
      notes: form.notes.trim() || null,
    });
  };

  const inputCls = (hasIcon) =>
    cn(
      'w-full rounded-lg xs:rounded-xl border bg-[#FDFBF7] py-2 xs:py-2.5 sm:py-3 pr-2.5 xs:pr-3 text-xs xs:text-sm text-slate-900 placeholder:text-slate-400',
      'focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 transition-all',
      hasIcon ? 'pl-8 xs:pl-9 sm:pl-10' : 'pl-2.5 xs:pl-3',
      'border-amber-100/80'
    );

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] bg-slate-900/55 backdrop-blur-sm"
            onClick={() => !loading && onClose?.()}
          />

          <motion.div
            key="dialog"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className={cn(
              'fixed z-[9999] flex flex-col',
              // Mobile: full screen with small inset
              'inset-0 xs:inset-2 sm:inset-auto',
              // Desktop: centered with max constraints
              'sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2',
              'sm:w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl',
              'sm:max-h-[92vh] md:max-h-[90vh]',
              // Prevent overflow on very short screens
              'max-h-[100dvh]'
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-confirm-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={cn(
                'relative flex flex-col overflow-hidden bg-white',
                // Mobile: full screen no rounding
                'h-full w-full',
                // Small screens: rounded
                'xs:rounded-2xl sm:rounded-3xl',
                'shadow-[0_24px_70px_-24px_rgba(15,23,42,0.4)]',
                'border border-amber-100/80'
              )}
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 xs:h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 z-10" />

              {/* Header */}
              <div className="relative shrink-0 px-4 xs:px-5 sm:px-6 md:px-8 pt-5 xs:pt-6 sm:pt-7 md:pt-8 pb-4 xs:pb-5 border-b border-amber-100/70">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  aria-label="Close"
                  className="absolute top-3 xs:top-3.5 right-3 xs:right-3.5 p-1.5 xs:p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 touch-manipulation"
                >
                  <X className="h-3.5 w-3.5 xs:h-4 xs:w-4" strokeWidth={2.25} />
                </button>

                <div className="inline-flex items-center gap-1.5 xs:gap-2 px-2 xs:px-3 py-0.5 xs:py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-[8px] xs:text-[10px] font-semibold uppercase tracking-[0.2em] xs:tracking-[0.25em] mb-2 xs:mb-3">
                  <Banknote className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
                  Cash on Delivery
                </div>

                <h2
                  id="order-confirm-title"
                  className=" text-lg xs:text-xl sm:text-2xl md:text-3xl font-medium text-slate-900 tracking-wide pr-8"
                >
                  Confirm Your Order
                </h2>

                <div className="flex items-center gap-1.5 xs:gap-2.5 mt-1.5 xs:mt-2">
                  <div className="w-4 xs:w-6 h-px bg-gradient-to-r from-amber-400/70 to-transparent" />
                  <div className="w-0.5 h-0.5 xs:w-1 xs:h-1 rotate-45 bg-amber-400/80" />
                  <div className="w-4 xs:w-6 h-px bg-gradient-to-l from-amber-400/70 to-transparent" />
                </div>

                <p className="text-xs xs:text-sm text-slate-500 font-light mt-1.5 xs:mt-2 leading-relaxed">
                  Enter your delivery details. Pay in cash when your order
                  arrives.
                </p>
              </div>

              {/* Scrollable body */}
              <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto overscroll-contain px-4 xs:px-5 sm:px-6 md:px-8 py-4 xs:py-5 sm:py-6 md:py-7 space-y-4 xs:space-y-5"
              >
                {/* Contact */}
                <div className="space-y-3 xs:space-y-4">
                  <h3 className="text-[9px] xs:text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Contact
                  </h3>

                  <Field label="Full Name" icon={User}>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={update('fullName')}
                      placeholder="Ayesha Khan"
                      className={inputCls(true)}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-[10px] xs:text-xs text-rose-600 flex items-center gap-1">
                        <AlertCircle className="h-2.5 w-2.5 xs:h-3 xs:w-3" /> {errors.fullName}
                      </p>
                    )}
                  </Field>

                  <Field label="Phone Number" icon={Phone}>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={update('phone')}
                      placeholder="+92-300-1234567"
                      className={inputCls(true)}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-[10px] xs:text-xs text-rose-600 flex items-center gap-1">
                        <AlertCircle className="h-2.5 w-2.5 xs:h-3 xs:w-3" /> {errors.phone}
                      </p>
                    )}
                  </Field>
                </div>

                {/* Address */}
                <div className="space-y-3 xs:space-y-4 pt-1 xs:pt-2">
                  <h3 className="text-[9px] xs:text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Shipping Address
                  </h3>

                  <Field label="Address Line 1" icon={Home}>
                    <input
                      type="text"
                      value={form.address1}
                      onChange={update('address1')}
                      placeholder="House / Flat, Street"
                      className={inputCls(true)}
                    />
                    {errors.address1 && (
                      <p className="mt-1 text-[10px] xs:text-xs text-rose-600 flex items-center gap-1">
                        <AlertCircle className="h-2.5 w-2.5 xs:h-3 xs:w-3" /> {errors.address1}
                      </p>
                    )}
                  </Field>

                  <Field label="Address Line 2 (optional)" icon={Home}>
                    <input
                      type="text"
                      value={form.address2}
                      onChange={update('address2')}
                      placeholder="Area, Landmark"
                      className={inputCls(true)}
                    />
                  </Field>

                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                    <Field label="City" icon={Building2}>
                      <input
                        type="text"
                        value={form.city}
                        onChange={update('city')}
                        placeholder="Karachi"
                        className={inputCls(true)}
                      />
                      {errors.city && (
                        <p className="mt-1 text-[10px] xs:text-xs text-rose-600 flex items-center gap-1">
                          <AlertCircle className="h-2.5 w-2.5 xs:h-3 xs:w-3" /> {errors.city}
                        </p>
                      )}
                    </Field>

                    <Field label="State / Province" icon={MapPin}>
                      <input
                        type="text"
                        value={form.state}
                        onChange={update('state')}
                        placeholder="Sindh"
                        className={inputCls(true)}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                    <Field label="Postal Code" icon={MapPin}>
                      <input
                        type="text"
                        value={form.postalCode}
                        onChange={update('postalCode')}
                        placeholder="74200"
                        className={inputCls(true)}
                      />
                    </Field>

                    <Field label="Country" icon={MapPin}>
                      <input
                        type="text"
                        value={form.country}
                        onChange={update('country')}
                        className={inputCls(true)}
                      />
                    </Field>
                  </div>
                </div>

                {/* Notes */}
                <div className="pt-1 xs:pt-2">
                  <label className="block text-[10px] xs:text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 mb-1 xs:mb-1.5">
                    Order Notes (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={update('notes')}
                    placeholder="Delivery instructions, gift message, etc."
                    className="w-full rounded-lg xs:rounded-xl border border-amber-100/80 bg-[#FDFBF7] px-2.5 xs:px-3 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 transition-all resize-none"
                  />
                </div>
              </form>

              {/* Sticky footer summary + confirm */}
              <div className="shrink-0 border-t border-amber-100/70 bg-gradient-to-b from-white to-amber-50/40 px-4 xs:px-5 sm:px-6 md:px-8 py-3 xs:py-4 sm:py-5">
                <div className="space-y-1.5 xs:space-y-2 mb-3 xs:mb-4 text-xs xs:text-sm">
                  <div className="flex justify-between text-slate-500 font-light">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-medium text-slate-900 tabular-nums">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-light">
                    <span className="flex items-center gap-1 xs:gap-1.5">
                      <Truck className="h-3 w-3 xs:h-3.5 xs:w-3.5 text-amber-500" />
                      Shipping
                    </span>
                    <span className="font-medium text-slate-900 tabular-nums">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1.5 xs:pt-2 border-t border-amber-100">
                    <span className=" text-sm xs:text-base text-slate-900">
                      Total (COD)
                    </span>
                    <span className=" text-base xs:text-lg sm:text-xl font-semibold text-slate-900 tabular-nums">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col-reverse xs:flex-row gap-2 xs:gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 rounded-xl xs:rounded-2xl border border-slate-200 bg-white px-3 xs:px-5 py-2.5 xs:py-3 text-xs xs:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 touch-manipulation"
                  >
                    Back to cart
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 rounded-xl xs:rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white px-3 xs:px-5 py-2.5 xs:py-3 text-xs xs:text-sm font-semibold shadow-lg shadow-amber-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5 xs:gap-2 touch-manipulation"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 xs:w-4 xs:h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span className="hidden xs:inline">Placing order…</span>
                        <span className="xs:hidden">Placing…</span>
                      </>
                    ) : (
                      <>
                        <Banknote className="h-3.5 w-3.5 xs:h-4 xs:w-4" strokeWidth={2.25} />
                        <span className="hidden xs:inline">Place Order (COD)</span>
                        <span className="xs:hidden">Place Order</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-2 xs:mt-3 flex items-center justify-center gap-1 xs:gap-1.5 text-[8px] xs:text-[10px] uppercase tracking-[0.15em] xs:tracking-[0.2em] text-slate-400">
                  <ShieldCheck className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
                  No payment required now
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
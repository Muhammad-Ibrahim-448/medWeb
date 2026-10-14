"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Gem,
  Banknote,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { Button } from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
import OrderConfirmModal from "@/components/common/OrderConfirmModal";
import { cn } from "@/lib/helpers";

const SHIPPING_FLAT = 250;
const FREE_SHIPPING_THRESHOLD = 5000;

function formatPrice(n) {
  const v = Number(n);

  if (Number.isNaN(v)) return "—";

  return `PKR ${v.toLocaleString("en-PK")}`;
}

function productImageSrc(item) {
  const src = item?.primary_image;

  if (!src) return "/images/placeholder.png";
  if (src.startsWith("http") || src.startsWith("/")) return src;

  return `/${src}`;
}

/* ────────────────────────────────────────────────────────────
   Quantity stepper
   ──────────────────────────────────────────────────────────── */

function QuantityStepper({ value, min = 1, max = 10, onChange, disabled }) {
  return (
    <div
      className={cn(
        "inline-flex items-center border border-[#d9d5cf] bg-white",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(
          "flex h-9 w-9 items-center justify-center",
          "text-[#77716a] transition-colors duration-200",
          "hover:bg-[#ebe9e5] hover:text-[#171717]",
          "disabled:cursor-not-allowed disabled:opacity-35",
        )}
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={1.4} />
      </button>

      <span className="w-8 text-center text-xs font-medium tabular-nums text-[#171717]">
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(
          "flex h-9 w-9 items-center justify-center",
          "text-[#77716a] transition-colors duration-200",
          "hover:bg-[#ebe9e5] hover:text-[#171717]",
          "disabled:cursor-not-allowed disabled:opacity-35",
        )}
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={1.4} />
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Skeleton
   ──────────────────────────────────────────────────────────── */

function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-5 border border-[#d9d5cf] bg-white p-4 sm:p-5"
          >
            <div className="h-28 w-24 shrink-0 animate-pulse bg-[#e5e2dc] sm:h-32 sm:w-28" />

            <div className="flex-1 space-y-3 py-1">
              <div className="h-2.5 w-1/4 animate-pulse bg-[#e5e2dc]" />
              <div className="h-4 w-2/3 animate-pulse bg-[#e5e2dc]" />
              <div className="h-3 w-1/4 animate-pulse bg-[#e5e2dc]" />
              <div className="mt-5 h-9 w-28 animate-pulse bg-[#e5e2dc]" />
            </div>
          </div>
        ))}
      </div>

      <div className="h-fit space-y-5 border border-[#d9d5cf] bg-white p-6">
        <div className="h-5 w-1/2 animate-pulse bg-[#e5e2dc]" />
        <div className="h-3 w-full animate-pulse bg-[#e5e2dc]" />
        <div className="h-3 w-full animate-pulse bg-[#e5e2dc]" />
        <div className="h-px w-full bg-[#e5e2dc]" />
        <div className="h-5 w-2/3 animate-pulse bg-[#e5e2dc]" />
        <div className="h-12 w-full animate-pulse bg-[#e5e2dc]" />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Empty cart
   ──────────────────────────────────────────────────────────── */

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="border border-[#d9d5cf] bg-white px-6 py-20 text-center sm:px-10 sm:py-24"
    >
      <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center border border-[#d9d5cf] bg-[#f6f5f2]">
        <ShoppingBag className="h-8 w-8 text-[#866b42]" strokeWidth={1.2} />
      </div>

      <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#866b42]">
        Shoaib Jewellers
      </p>

      <h2 className="mt-3 font-serif text-4xl leading-none tracking-[-0.025em] text-[#171717] sm:text-5xl">
        Your cart awaits.
      </h2>

      <div className="mt-7 flex items-center justify-center gap-3">
        <div className="h-px w-10 bg-[#b9b4ad]" />
        <div className="h-1.5 w-1.5 rotate-45 bg-[#866b42]" />
        <div className="h-px w-10 bg-[#b9b4ad]" />
      </div>

      <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[#66615b]">
        Discover timeless jewellery crafted with care for the moments worth
        remembering.
      </p>

      <Link
        href="/products"
        className="group mt-9 inline-flex items-center gap-3 bg-[#181716] px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.17em] text-white transition-colors duration-300 hover:bg-[#302d29]"
      >
        Explore Collections
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={1.4}
        />
      </Link>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Cart item
   ──────────────────────────────────────────────────────────── */

function CartItemRow({ item, onQtyChange, onRemove, updating, removing }) {
  const maxQty = Math.min(10, Math.max(1, Number(item.stock_quantity) || 1));

  const outOfStock = !item.in_stock;

  const hasSale =
    item.sale_price && Number(item.sale_price) < Number(item.price);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        x: -20,
        transition: { duration: 0.15 },
      }}
      className={cn(
        "group border border-[#d9d5cf] bg-white",
        "transition-colors duration-300",
        "hover:border-[#b9b4ad]",
      )}
    >
      <div className="flex gap-4 p-4 sm:gap-6 sm:p-5">
        {/* Product image */}
        <Link
          href={`/products/${item.slug}`}
          className="relative h-28 w-24 shrink-0 overflow-hidden bg-[#ebe9e5] sm:h-32 sm:w-28"
        >
          <Image
            src={productImageSrc(item)}
            alt={item.name}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
          />

          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#171717]/65">
              <span className="border border-white/30 bg-[#171717]/50 px-2 py-1 text-[8px] font-medium uppercase tracking-[0.18em] text-white">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* Product details */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div>
            {item.category_name && (
              <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.24em] text-[#866b42]">
                {item.category_name}
              </p>
            )}

            <Link
              href={`/products/${item.slug}`}
              className="line-clamp-2 text-sm font-medium leading-5 text-[#171717] transition-colors duration-200 hover:text-[#866b42] sm:text-base"
            >
              {item.name}
            </Link>

            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-sm font-medium tabular-nums text-[#171717]">
                {formatPrice(item.unit_price)}
              </span>

              {hasSale && (
                <span className="text-xs tabular-nums text-[#99938b] line-through">
                  {formatPrice(item.price)}
                </span>
              )}

              <span className="text-xs text-[#99938b]">× {item.quantity}</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <QuantityStepper
              value={Number(item.quantity)}
              max={maxQty}
              disabled={updating || removing || outOfStock}
              onChange={(q) => onQtyChange(item.product_id, q)}
            />

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium tabular-nums text-[#171717] sm:text-base">
                {formatPrice(item.line_total)}
              </span>

              <button
                type="button"
                onClick={() => onRemove(item.product_id)}
                disabled={removing}
                aria-label={`Remove ${item.name}`}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center",
                  "border border-[#d9d5cf] bg-white",
                  "text-[#8b857d]",
                  "transition-all duration-200",
                  "hover:border-[#d0b8b4] hover:bg-[#faf5f4] hover:text-[#8d4b45]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                {removing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.4} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ────────────────────────────────────────────────────────────
   Notice
   ──────────────────────────────────────────────────────────── */

function Notice({ notice, onDismiss }) {
  if (!notice) return null;

  const isSuccess = notice.type === "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn(
        "mb-8 flex items-start gap-3 border px-5 py-4 text-sm",
        isSuccess
          ? "border-[#cddbd1] bg-[#f5f9f6] text-[#496653]"
          : "border-[#e0c8c4] bg-[#faf5f4] text-[#8d4b45]",
      )}
      role="alert"
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
      )}

      <span className="flex-1 text-sm leading-5">{notice.text}</span>

      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 text-[9px] font-medium uppercase tracking-[0.16em] text-[#77716a] transition-colors hover:text-[#171717]"
      >
        Dismiss
      </button>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Order success
   ──────────────────────────────────────────────────────────── */

function OrderSuccess({ order, onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="border border-[#d9d5cf] bg-white p-8 text-center sm:p-14"
    >
      <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center border border-[#cddbd1] bg-[#f5f9f6]">
        <CheckCircle2 className="h-9 w-9 text-[#54705d]" strokeWidth={1.3} />
      </div>

      <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#54705d]">
        Order Confirmed
      </p>

      <h2 className="mt-3 font-serif text-4xl leading-none tracking-[-0.025em] text-[#171717] sm:text-5xl">
        Thank you for your order.
      </h2>

      <div className="mt-7 flex items-center justify-center gap-3">
        <div className="h-px w-9 bg-[#b9b4ad]" />
        <div className="h-1.5 w-1.5 rotate-45 bg-[#866b42]" />
        <div className="h-px w-9 bg-[#b9b4ad]" />
      </div>

      <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[#66615b]">
        Your order has been received. We&apos;ll contact you shortly to confirm
        delivery. Payment will be collected in cash when your order arrives.
      </p>

      <div className="mx-auto mt-7 inline-flex items-center gap-3 border border-[#d9d5cf] bg-[#f6f5f2] px-5 py-3">
        <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#866b42]">
          Order Number
        </span>

        <span className="font-mono text-sm font-medium text-[#171717]">
          {order?.orderNumber}
        </span>
      </div>

      <div className="mt-6 text-sm text-[#66615b]">
        Total:{" "}
        <span className="font-medium text-[#171717]">
          {formatPrice(order?.total)}
        </span>
        <span className="mx-2 text-[#b9b4ad]">·</span>
        Cash on Delivery
      </div>

      <div className="mt-9 flex flex-col justify-center gap-2.5 sm:flex-row">
        <Link
          href="/products"
          className="group inline-flex h-12 items-center justify-center gap-3 bg-[#181716] px-7 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-[#302d29]"
        >
          Continue Shopping
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.4}
          />
        </Link>

        <button
          type="button"
          onClick={onContinue}
          className="h-12 border border-[#d9d5cf] bg-white px-7 text-[10px] font-medium uppercase tracking-[0.16em] text-[#66615b] transition-colors duration-300 hover:border-[#b9b4ad] hover:bg-[#f6f5f2] hover:text-[#171717]"
        >
          Back to Cart
        </button>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Main
   ──────────────────────────────────────────────────────────── */

export default function CartClient() {
  const toast = useToast();
  const { user } = useAuth();

  const {
    items,
    subtotal,
    totalItems,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
    refresh: refreshCart,
  } = useCart();

  const [notice, setNotice] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;

    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  }, [subtotal]);

  const total = subtotal + shipping;

  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const hasUnavailable = items.some((i) => !i.in_stock);

  const handleQtyChange = async (productId, qty) => {
    setUpdatingId(productId);

    try {
      await updateQuantity(productId, qty);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update quantity.";

      setNotice({
        type: "error",
        text: msg,
      });

      toast?.error?.(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId) => {
    setRemovingId(productId);

    try {
      await removeFromCart(productId);

      setNotice({
        type: "success",
        text: "Item removed from cart.",
      });

      toast?.success?.("Removed from cart");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to remove item.";

      setNotice({
        type: "error",
        text: msg,
      });

      toast?.error?.(msg);
    } finally {
      setRemovingId(null);
    }
  };

  const handleClearClick = () => {
    if (items.length === 0) return;

    setShowClearConfirm(true);
  };

  const handleClearConfirm = async () => {
    setClearing(true);

    try {
      await clearCart();

      setShowClearConfirm(false);

      setNotice({
        type: "success",
        text: "Your cart has been cleared.",
      });

      toast?.success?.("Cart cleared successfully");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to clear cart.";

      setNotice({
        type: "error",
        text: msg,
      });

      toast?.error?.(msg);
    } finally {
      setClearing(false);
    }
  };

  const handlePlaceOrderClick = () => {
    if (hasUnavailable) {
      const msg = "Please remove out-of-stock items before placing your order.";

      setNotice({
        type: "error",
        text: msg,
      });

      toast?.error?.(msg);

      return;
    }

    setShowOrderModal(true);
  };

  const handleOrderConfirm = async ({ shipping: shipInfo, notes }) => {
    setPlacingOrder(true);

    try {
      const { data } = await api.post("/orders", {
        shipping: shipInfo,
        notes,
      });

      setShowOrderModal(false);
      setPlacedOrder(data.data);

      setNotice({
        type: "success",
        text: "Order placed successfully!",
      });

      toast?.success?.(`Order ${data.data.orderNumber} placed`);

      await refreshCart();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to place order.";

      setNotice({
        type: "error",
        text: msg,
      });

      toast?.error?.(msg);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="min-h-screen bg-[#f6f5f2] pb-20 pt-32">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
          <OrderSuccess
            order={placedOrder}
            onContinue={() => setPlacedOrder(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f5f2] pb-20 pt-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-10">
        {/* ─────────────────────────────────────────────────────
            Header
        ───────────────────────────────────────────────────── */}

        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-10 flex flex-col gap-6 border-b border-[#d9d5cf] pb-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.3em] text-[#866b42]">
              <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.3} />
              Shopping Cart
            </div>

            <h1 className="mt-4 font-serif text-5xl leading-none tracking-[-0.035em] text-[#171717] sm:text-6xl lg:text-7xl">
              Your cart.
            </h1>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px w-9 bg-[#b9b4ad]" />
              <div className="h-1.5 w-1.5 rotate-45 bg-[#866b42]" />
              <div className="h-px w-9 bg-[#b9b4ad]" />
            </div>

            <p className="mt-5 text-sm leading-6 text-[#66615b]">
              {loading
                ? "Curating your selection…"
                : items.length === 0
                  ? "No pieces in your cart yet."
                  : `${totalItems} treasured piece${
                      totalItems === 1 ? "" : "s"
                    } in your cart.`}
            </p>
          </div>

          {!loading && items.length > 0 && (
            <button
              type="button"
              onClick={handleClearClick}
              disabled={clearing}
              className={cn(
                "inline-flex h-11 items-center justify-center gap-2",
                "border border-[#d9d5cf] bg-white px-5",
                "text-[9px] font-medium uppercase tracking-[0.16em] text-[#66615b]",
                "transition-all duration-300",
                "hover:border-[#cdbdb9] hover:bg-[#faf5f4] hover:text-[#8d4b45]",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "self-start sm:self-auto",
              )}
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.4} />
              Clear Cart
            </button>
          )}
        </motion.header>

        {/* ─────────────────────────────────────────────────────
            Notice
        ───────────────────────────────────────────────────── */}

        <AnimatePresence>
          <Notice notice={notice} onDismiss={() => setNotice(null)} />
        </AnimatePresence>

        {/* ─────────────────────────────────────────────────────
            Body
        ───────────────────────────────────────────────────── */}

        {loading ? (
          <CartSkeleton />
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
            {/* ───────────────────────────────────────────────
                Cart items
            ─────────────────────────────────────────────── */}

            <div className="min-w-0">
              {amountToFreeShipping > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex items-start gap-3 border border-[#d9d5cf] bg-white px-5 py-4"
                >
                  <Truck
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#866b42]"
                    strokeWidth={1.4}
                  />

                  <span className="text-xs leading-5 text-[#66615b]">
                    Add{" "}
                    <strong className="font-medium text-[#171717]">
                      {formatPrice(amountToFreeShipping)}
                    </strong>{" "}
                    more to unlock{" "}
                    <strong className="font-medium text-[#171717]">
                      free shipping
                    </strong>
                    .
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex items-start gap-3 border border-[#cddbd1] bg-[#f5f9f6] px-5 py-4"
                >
                  <Truck
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#54705d]"
                    strokeWidth={1.4}
                  />

                  <span className="text-xs leading-5 text-[#496653]">
                    You&apos;ve unlocked{" "}
                    <strong className="font-medium">free shipping</strong>.
                  </span>
                </motion.div>
              )}

              <div className="mb-4 flex items-center justify-between border-b border-[#d9d5cf] pb-3">
                <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#99938b]">
                  Your selection
                </p>

                <p className="text-[10px] tabular-nums text-[#99938b]">
                  {totalItems} {totalItems === 1 ? "piece" : "pieces"}
                </p>
              </div>

              <motion.div layout className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.product_id}
                      item={item}
                      onQtyChange={handleQtyChange}
                      onRemove={handleRemove}
                      updating={updatingId === item.product_id}
                      removing={removingId === item.product_id}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              <div className="mt-8">
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.17em] text-[#66615b] transition-colors duration-300 hover:text-[#171717]"
                >
                  <ChevronRight
                    className="h-3.5 w-3.5 rotate-180 transition-transform duration-300 group-hover:-translate-x-0.5"
                    strokeWidth={1.4}
                  />
                  Continue shopping
                </Link>
              </div>
            </div>

            {/* ───────────────────────────────────────────────
                Order summary
            ─────────────────────────────────────────────── */}

            <motion.aside
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-fit lg:sticky lg:top-28"
            >
              <div className="border border-[#d9d5cf] bg-white">
                <div className="border-b border-[#d9d5cf] px-6 py-5">
                  <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#866b42]">
                    Your order
                  </p>

                  <h2 className="mt-2 font-serif text-2xl tracking-[-0.02em] text-[#171717]">
                    Order Summary
                  </h2>
                </div>

                <div className="px-6 py-6">
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center justify-between gap-5">
                      <span className="text-[#66615b]">
                        Subtotal{" "}
                        <span className="text-[#99938b]">({totalItems})</span>
                      </span>

                      <span className="font-medium tabular-nums text-[#171717]">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-5">
                      <span className="text-[#66615b]">Shipping</span>

                      <span className="font-medium tabular-nums text-[#171717]">
                        {shipping === 0 ? "Free" : formatPrice(shipping)}
                      </span>
                    </div>
                  </div>

                  <div className="my-6 h-px bg-[#d9d5cf]" />

                  <div className="flex items-baseline justify-between gap-5">
                    <span className="text-sm font-medium text-[#171717]">
                      Total
                    </span>

                    <span className="font-serif text-2xl tabular-nums text-[#171717]">
                      {formatPrice(total)}
                    </span>
                  </div>

                  {/* COD */}
                  <div className="mt-6 border border-[#d9d5cf] bg-[#f6f5f2] px-4 py-3.5">
                    <div className="flex items-start gap-3">
                      <Banknote
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#866b42]"
                        strokeWidth={1.4}
                      />

                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#171717]">
                          Cash on Delivery
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#77716a]">
                          Pay in cash when your order arrives.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePlaceOrderClick}
                    disabled={hasUnavailable || placingOrder}
                    className={cn(
                      "group mt-5 flex h-13 w-full items-center justify-center gap-3",
                      "bg-[#181716] px-5 text-white",
                      "text-[10px] font-medium uppercase tracking-[0.17em]",
                      "transition-colors duration-300",
                      "hover:bg-[#302d29]",
                      "disabled:cursor-not-allowed disabled:opacity-45",
                    )}
                  >
                    {placingOrder ? (
                      <>
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          strokeWidth={1.4}
                        />
                        Processing
                      </>
                    ) : (
                      <>
                        Place Order
                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                          strokeWidth={1.4}
                        />
                      </>
                    )}
                  </button>

                  {hasUnavailable && (
                    <p className="mt-3 text-center text-[10px] leading-5 text-[#8d4b45]">
                      Remove out-of-stock items to continue.
                    </p>
                  )}

                  {/* Service promises */}
                  <div className="mt-7 border-t border-[#d9d5cf] pt-6">
                    <div className="space-y-4">
                      {[
                        {
                          icon: ShieldCheck,
                          text: "Secure checkout",
                        },
                        {
                          icon: Truck,
                          text: "Fast nationwide delivery",
                        },
                        {
                          icon: RotateCcw,
                          text: "7-day easy returns",
                        },
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-3">
                          <Icon
                            className="h-4 w-4 shrink-0 text-[#866b42]"
                            strokeWidth={1.35}
                          />

                          <span className="text-xs text-[#66615b]">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Authenticity */}
                  <div className="mt-6 border-t border-[#d9d5cf] pt-5">
                    <div className="flex items-center justify-center gap-2 text-[8px] font-medium uppercase tracking-[0.24em] text-[#866b42]">
                      <Gem className="h-3 w-3" strokeWidth={1.5} />
                      Certified Authentic
                      <Sparkles className="h-3 w-3" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────
          Clear Cart Confirmation
      ───────────────────────────────────────────────────────── */}

      <ConfirmModal
        open={showClearConfirm}
        title="Clear your cart?"
        description={`This will remove all ${totalItems} item${
          totalItems === 1 ? "" : "s"
        } from your cart. This action cannot be undone.`}
        confirmLabel={clearing ? "Clearing…" : "Yes, clear cart"}
        cancelLabel="Keep items"
        onConfirm={handleClearConfirm}
        onCancel={() => !clearing && setShowClearConfirm(false)}
        loading={clearing}
        tone="danger"
      />

      {/* ─────────────────────────────────────────────────────────
          Order Confirmation
      ───────────────────────────────────────────────────────── */}

      <OrderConfirmModal
        open={showOrderModal}
        onClose={() => !placingOrder && setShowOrderModal(false)}
        onConfirm={handleOrderConfirm}
        loading={placingOrder}
        total={total}
        subtotal={subtotal}
        shipping={shipping}
        itemCount={totalItems}
        formatPrice={formatPrice}
        initialValues={{
          fullName: user?.name || "",
          phone: user?.phone || "",
        }}
      />
    </div>
  );
}

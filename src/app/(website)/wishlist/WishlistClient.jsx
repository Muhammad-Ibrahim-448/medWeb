"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Trash2,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import api from "@/lib/axios";
import { cn } from "@/lib/helpers";
import ConfirmModal from "@/components/common/ConfirmModal";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatPrice(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return `PKR ${n.toLocaleString("en-PK")}`;
}

function productImageSrc(product) {
  const src = product?.primary_image;

  if (!src) return "/images/placeholder.png";
  if (src.startsWith("http") || src.startsWith("/")) return src;

  return `/${src}`;
}

/* ------------------------------------------------------------------ */
/* Skeleton                                                           */
/* ------------------------------------------------------------------ */

function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden border border-[#d9d5cf] bg-white"
        >
          <div className="aspect-[4/5] animate-pulse bg-[#ebe9e5]" />

          <div className="space-y-3 p-6">
            <div className="h-2.5 w-1/3 animate-pulse bg-[#e5e2dc]" />
            <div className="h-4 w-3/4 animate-pulse bg-[#e5e2dc]" />
            <div className="h-3 w-1/2 animate-pulse bg-[#e5e2dc]" />

            <div className="mt-5 h-11 w-full animate-pulse bg-[#e5e2dc]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                        */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="border border-[#d9d5cf] bg-white px-6 py-20 text-center sm:px-10"
    >
      <div className="mx-auto flex max-w-xl flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-7 flex h-20 w-20 items-center justify-center border border-[#d9d5cf] bg-[#f6f5f2]"
        >
          <Heart className="h-8 w-8 text-[#866b42]" strokeWidth={1.2} />
        </motion.div>

        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#866b42]">
          My Collection
        </p>

        <h2 className="mt-4 font-serif text-4xl tracking-[-0.025em] text-[#171717] sm:text-5xl">
          Your wishlist awaits.
        </h2>

        <div className="mt-7 flex items-center justify-center gap-3">
          <div className="h-px w-10 bg-[#b9b4ad]" />
          <div className="h-1.5 w-1.5 rotate-45 bg-[#866b42]" />
          <div className="h-px w-10 bg-[#b9b4ad]" />
        </div>

        <p className="mt-6 max-w-md text-sm leading-7 text-[#66615b]">
          Save the pieces you love and return to them whenever the moment feels
          right.
        </p>

        <Link
          href="/products"
          className="group mt-9 inline-flex items-center gap-3 bg-[#181716] px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[#302d29]"
        >
          Discover Collections
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.4}
          />
        </Link>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Wishlist item card                                                 */
/* ------------------------------------------------------------------ */

function WishlistItem({ item, onRemove, onAddToCart, removing, adding }) {
  const price = item.sale_price ?? item.price;

  const hasSale =
    item.sale_price && Number(item.sale_price) < Number(item.price);

  const inStock = Number(item.stock_quantity) > 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: 0.97,
        transition: { duration: 0.18 },
      }}
      className="group flex flex-col overflow-hidden border border-[#d9d5cf] bg-white transition-all duration-500 hover:border-[#b9b4ad] hover:shadow-[0_18px_45px_-28px_rgba(23,23,23,0.35)]"
    >
      {/* Image */}
      <Link
        href={`/products/${item.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-[#ebe9e5]"
      >
        <Image
          src={productImageSrc(item)}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        />

        {/* Minimal hover overlay */}
        <div className="absolute inset-0 bg-[#171717]/[0.04] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Sale */}
        {hasSale && (
          <span className="absolute left-4 top-4 border border-white/70 bg-white/95 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#171717]">
            Sale
          </span>
        )}

        {/* Featured */}
        {item.featured ? (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 border border-white/70 bg-[#181716]/90 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-white">
            <Sparkles
              className="h-2.5 w-2.5 text-[#c6ad84]"
              strokeWidth={1.4}
            />
            Featured
          </span>
        ) : null}

        {/* Out of stock */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#171717]/60">
            <span className="border border-white/30 bg-[#171717]/80 px-4 py-2 text-[9px] font-medium uppercase tracking-[0.22em] text-white">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {item.category_name && (
          <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.25em] text-[#866b42]">
            {item.category_name}
          </p>
        )}

        <Link
          href={`/products/${item.slug}`}
          className="line-clamp-2 font-serif text-xl leading-tight tracking-[-0.015em] text-[#171717] transition-colors duration-300 hover:text-[#866b42]"
        >
          {item.name}
        </Link>

        {item.short_description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#66615b]">
            {item.short_description}
          </p>
        )}

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2 pt-6">
          <span className="text-lg font-medium tracking-[-0.01em] text-[#171717]">
            {formatPrice(price)}
          </span>

          {hasSale && (
            <span className="text-sm text-[#9a958e] line-through">
              {formatPrice(item.price)}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="my-5 h-px bg-[#e2ded8]" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!inStock || adding}
            onClick={() => onAddToCart(item)}
            className={cn(
              "inline-flex h-11 flex-1 items-center justify-center gap-2",
              "bg-[#181716] px-4",
              "text-[10px] font-medium uppercase tracking-[0.15em] text-white",
              "transition-colors duration-300 hover:bg-[#302d29]",
              "disabled:cursor-not-allowed disabled:bg-[#d9d5cf] disabled:text-[#88827a]",
            )}
          >
            {adding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.4} />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onRemove(item)}
            disabled={removing}
            aria-label={`Remove ${item.name} from wishlist`}
            className={cn(
              "inline-flex h-11 w-11 shrink-0 items-center justify-center",
              "border border-[#d9d5cf] bg-white",
              "text-[#77716a]",
              "transition-all duration-300",
              "hover:border-[#b9b4ad] hover:bg-[#f6f5f2] hover:text-[#8d4b45]",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {removing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" strokeWidth={1.4} />
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                     */
/* ------------------------------------------------------------------ */

export default function WishlistClient() {
  const cart = useCart();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  /* ------------------------------ Fetch ---------------------------- */

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/wishlist");
      setItems(data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ------------------------------ Remove --------------------------- */

  const handleRemove = async (item) => {
    setRemovingId(item.id);

    const previous = items;

    setItems((prev) => prev.filter((product) => product.id !== item.id));

    try {
      await api.delete(`/wishlist/${item.id}`);
    } catch (err) {
      setItems(previous);

      setError(err?.response?.data?.message || "Failed to remove item.");
    } finally {
      setRemovingId(null);
    }
  };

  /* ------------------------------ Clear all ------------------------ */

  const handleClearAll = () => {
    setConfirmClearOpen(true);
  };
  
  const handleConfirmClearAll = async () => {
    setClearing(true);
  
    const previous = items;
    setItems([]);
  
    try {
      await api.delete("/wishlist");
      setConfirmClearOpen(false);
    } catch (err) {
      setItems(previous);
  
      setError(
        err?.response?.data?.message || "Failed to clear wishlist."
      );
    } finally {
      setClearing(false);
    }
  };

  /* ------------------------------ Add to cart ---------------------- */

  const handleAddToCart = async (item) => {
    if (!cart?.addToCart) {
      setAddingId(item.id);

      try {
        await api.post("/cart", {
          productId: item.id,
          quantity: 1,
        });
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to add to cart.");
      } finally {
        setAddingId(null);
      }

      return;
    }

    setAddingId(item.id);

    try {
      await cart.addToCart(item.id, 1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add to cart.");
    } finally {
      setAddingId(null);
    }
  };

  /* ------------------------------ Render --------------------------- */

  return (
    <main className="min-h-screen bg-[#f6f5f2] pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-12 border-b border-[#d9d5cf] pb-8"
        >
          <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="h-px w-8 bg-[#866b42]" />

                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#866b42]">
                  My Collection
                </span>

                <Heart
                  className="h-3.5 w-3.5 fill-[#866b42] text-[#866b42]"
                  strokeWidth={1.2}
                />
              </div>

              <h1 className="font-serif text-4xl leading-none tracking-[-0.035em] text-[#171717] sm:text-5xl lg:text-6xl">
                Wishlist
              </h1>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-px w-10 bg-[#b9b4ad]" />
                <div className="h-1.5 w-1.5 rotate-45 bg-[#866b42]" />
                <div className="h-px w-10 bg-[#b9b4ad]" />
              </div>

              <p className="mt-5 text-sm leading-6 text-[#66615b]">
                {loading
                  ? "Curating your saved pieces…"
                  : items.length === 0
                    ? "No pieces saved yet"
                    : `${items.length} treasured piece${
                        items.length === 1 ? "" : "s"
                      } saved`}
              </p>
            </div>

            {!loading && items.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                disabled={clearing}
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2",
                  "border border-[#d9d5cf] bg-white px-5",
                  "text-[10px] font-medium uppercase tracking-[0.16em] text-[#66615b]",
                  "transition-all duration-300",
                  "hover:border-[#b9b4ad] hover:bg-[#f6f5f2] hover:text-[#171717]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "self-start sm:self-auto",
                )}
              >
                {clearing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Clearing…
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.4} />
                    Clear All
                  </>
                )}
              </button>
            )}
          </div>
        </motion.header>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-8 flex items-start gap-3 border border-[#e6c7c4] bg-[#fbf2f1] px-5 py-4 text-sm text-[#8d4b45]"
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <span className="flex-1 leading-6">{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                className="shrink-0 text-[9px] font-medium uppercase tracking-[0.15em] text-[#8d4b45] transition-colors hover:text-[#65332f]"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {loading ? (
          <WishlistSkeleton />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <WishlistItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                  removing={removingId === item.id}
                  adding={addingId === item.id}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Bottom CTA */}
        {!loading && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.5,
            }}
            className="mt-16 flex justify-center border-t border-[#d9d5cf] pt-10"
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 border border-[#b9b4ad] bg-white px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.17em] text-[#171717] transition-all duration-300 hover:border-[#181716] hover:bg-[#181716] hover:text-white"
            >
              Continue Shopping
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.4}
              />
            </Link>
          </motion.div>
        )}
        <ConfirmModal
          open={confirmClearOpen}
          title="Clear your wishlist?"
          description="This will remove all saved pieces from your wishlist. This action cannot be undone."
          confirmLabel="Clear Wishlist"
          cancelLabel="Keep My Pieces"
          tone="danger"
          loading={clearing}
          onConfirm={handleConfirmClearAll}
          onCancel={() => {
            if (!clearing) setConfirmClearOpen(false);
          }}
        />
      </div>
    </main>
  );
}

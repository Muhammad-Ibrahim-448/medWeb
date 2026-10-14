'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  ShoppingBag,
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Loader2,
  Minus,
  Plus,
  Sparkles,
  Gem,
  Package,
  Weight,
  Ruler,
  Layers,
} from 'lucide-react'

import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { cn } from '@/lib/helpers'

const FREE_SHIPPING_THRESHOLD = 5000

function formatPrice(n) {
  const v = Number(n)

  if (Number.isNaN(v)) return '—'

  return `PKR ${v.toLocaleString('en-PK')}`
}

function productImageSrc(
  item,
  fallback = '/images/placeholder.png'
) {
  const src = item?.image_url || item?.primary_image

  if (!src) return fallback
  if (src.startsWith('http') || src.startsWith('/')) return src

  return `/${src}`
}

/* ============================================================
   IMAGE GALLERY
============================================================ */

function ImageGallery({ images, productName }) {
  const [activeIdx, setActiveIdx] = useState(0)

  const hasImages = images.length > 0

  const activeImage = hasImages
    ? productImageSrc(images[activeIdx])
    : '/images/placeholder.png'

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        key={activeIdx}
        initial={{ opacity: 0.45 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="relative aspect-[4/5] overflow-hidden bg-[#ebe9e5]"
      >
        <Image
          src={activeImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-black/[0.02]" />

        <div className="pointer-events-none absolute left-0 top-0 h-16 w-16 border-l border-t border-white/40" />

        <div className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 border-b border-r border-white/40" />
      </motion.div>

      {hasImages && images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id || i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={cn(
                'relative h-20 w-16 shrink-0 overflow-hidden bg-[#ebe9e5]',
                'border transition-all duration-300',
                i === activeIdx
                  ? 'border-[#181716] opacity-100'
                  : 'border-[#d9d5cf] opacity-60 hover:border-[#b9b4ad] hover:opacity-100'
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={productImageSrc(img)}
                alt={
                  img.alt_text ||
                  `${productName} ${i + 1}`
                }
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ============================================================
   QUANTITY STEPPER
============================================================ */

function QuantityStepper({
  value,
  min = 1,
  max = 10,
  onChange,
  disabled,
}) {
  return (
    <div
      className={cn(
        'inline-flex h-12 items-center border border-[#d9d5cf] bg-white',
        disabled && 'pointer-events-none opacity-50'
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="flex h-full w-11 items-center justify-center text-[#66615b] transition-colors hover:text-[#181716] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus
          className="h-4 w-4"
          strokeWidth={1.5}
        />
      </button>

      <span className="w-10 text-center text-sm font-medium tabular-nums text-[#181716]">
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex h-full w-11 items-center justify-center text-[#66615b] transition-colors hover:text-[#181716] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Plus
          className="h-4 w-4"
          strokeWidth={1.5}
        />
      </button>
    </div>
  )
}

/* ============================================================
   SPEC ROW
============================================================ */

function SpecRow({ icon: Icon, label, value }) {
  if (!value) return null

  return (
    <div className="flex items-center gap-4 border-b border-[#d9d5cf] py-4 last:border-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#f6f5f2] text-[#866b42]">
        <Icon
          className="h-4 w-4"
          strokeWidth={1.35}
        />
      </div>

      <span className="flex-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#99938c]">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-[#282522]">
        {value}
      </span>
    </div>
  )
}

/* ============================================================
   RELATED PRODUCT
============================================================ */

function RelatedCard({ product }) {
  const price = Number(
    product.sale_price || product.price
  )

  const hasSale =
    product.sale_price &&
    Number(product.sale_price) <
      Number(product.price)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block min-w-0"
    >
      <article>
        <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe9e5]">
          <Image
            src={productImageSrc(product)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />

          <div className="pointer-events-none absolute inset-0 bg-black/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {hasSale && (
            <span className="absolute left-3 top-3 bg-[#181716] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-white">
              Sale
            </span>
          )}
        </div>

        <div className="pt-4">
          {product.category_name && (
            <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#866b42]">
              {product.category_name}
            </p>
          )}

          <h3 className="line-clamp-2 min-h-[40px] text-[13px] font-medium leading-5 text-[#282522] transition-colors duration-300 group-hover:text-[#866b42]">
            {product.name}
          </h3>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm font-semibold tabular-nums text-[#181716]">
              {formatPrice(price)}
            </span>

            {hasSale && (
              <span className="text-[11px] font-light tabular-nums text-[#99938c] line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="mt-4 h-px w-full bg-[#d9d5cf] transition-colors duration-300 group-hover:bg-[#b9b4ad]" />
        </div>
      </article>
    </Link>
  )
}

/* ============================================================
   MAIN
============================================================ */

export default function ProductDetailClient({
  product,
  images,
  related,
}) {
  const router = useRouter()
  const toast = useToast()

  const { user } = useAuth()
  const { addToCart } = useCart()
  const {
    isWishlisted,
    toggle: toggleWishlist,
  } = useWishlist()

  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] =
    useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [wishlistLoading, setWishlistLoading] =
    useState(false)

  const wishlisted = isWishlisted(product.id)

  const price = Number(
    product.sale_price ?? product.price
  )

  const originalPrice = product.sale_price
    ? Number(product.price)
    : null

  const discount = originalPrice
    ? Math.round(
        ((originalPrice - price) /
          originalPrice) *
          100
      )
    : null

  const inStock =
    Number(product.stock_quantity) > 0

  const maxQty = Math.min(
    10,
    Math.max(
      1,
      Number(product.stock_quantity) || 1
    )
  )

  const lowStock =
    inStock &&
    Number(product.stock_quantity) <= 5

  /* ==========================================================
     ACTIONS
  ========================================================== */

  const handleAddToCart = async () => {
    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          `/products/${product.slug}`
        )}`
      )
      return
    }

    if (!inStock || addingToCart) return

    setAddingToCart(true)

    try {
      await addToCart(product.id, quantity)

      setJustAdded(true)

      toast?.success?.(
        `Added ${quantity} to cart`
      )

      setTimeout(
        () => setJustAdded(false),
        1500
      )
    } catch (err) {
      toast?.error?.(
        err?.response?.data?.message ||
          'Failed to add to cart'
      )
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          `/products/${product.slug}`
        )}`
      )
      return
    }

    if (!inStock) return

    try {
      await addToCart(product.id, quantity)

      router.push('/cart')
    } catch (err) {
      toast?.error?.(
        err?.response?.data?.message ||
          'Failed to add to cart'
      )
    }
  }

  const handleWishlistToggle = async () => {
    if (wishlistLoading) return

    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          `/products/${product.slug}`
        )}`
      )
      return
    }

    setWishlistLoading(true)

    try {
      await toggleWishlist(product.id)

      toast?.success?.(
        wishlisted
          ? 'Removed from wishlist'
          : 'Added to wishlist'
      )
    } catch (err) {
      toast?.error?.(
        'Failed to update wishlist'
      )
    } finally {
      setWishlistLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f5f2] pt-28 pb-20 sm:pt-32 sm:pb-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">

        {/* =====================================================
            BREADCRUMB
        ====================================================== */}

        <nav className="mb-8 flex flex-wrap items-center gap-2 text-[9px] font-medium uppercase tracking-[0.16em] text-[#99938c]">
          <Link
            href="/"
            className="transition-colors hover:text-[#282522]"
          >
            Home
          </Link>

          <ChevronRight
            className="h-3 w-3 text-[#b9b4ad]"
            strokeWidth={1.3}
          />

          <Link
            href="/products"
            className="transition-colors hover:text-[#282522]"
          >
            Jewellery
          </Link>

          {product.category_name && (
            <>
              <ChevronRight
                className="h-3 w-3 text-[#b9b4ad]"
                strokeWidth={1.3}
              />

              <Link
                href={`/collections/${
                  product.category_slug || ''
                }`}
                className="transition-colors hover:text-[#282522]"
              >
                {product.category_name}
              </Link>
            </>
          )}

          <ChevronRight
            className="h-3 w-3 text-[#b9b4ad]"
            strokeWidth={1.3}
          />

          <span className="max-w-[220px] truncate text-[#66615b]">
            {product.name}
          </span>
        </nav>

        {/* =====================================================
            PRODUCT
        ====================================================== */}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:gap-16 xl:gap-24">

          {/* GALLERY */}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <ImageGallery
              images={images}
              productName={product.name}
            />
          </motion.div>

          {/* ===================================================
              PRODUCT INFORMATION
          ================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col lg:pt-2"
          >

            {/* Brand / category */}

            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#866b42]">
                Shoaib Jewellers
              </span>

              {product.featured === 1 && (
                <span className="inline-flex items-center gap-1.5 border border-[#d9d5cf] bg-white px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#5f513d]">
                  <Sparkles
                    className="h-2.5 w-2.5"
                    strokeWidth={1.4}
                  />
                  Featured
                </span>
              )}

              {discount && (
                <span className="bg-[#181716] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-white">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Title */}

            <h1 className="max-w-2xl font-serif text-4xl leading-[1.02] tracking-[-0.025em] text-[#171717] sm:text-5xl lg:text-[54px]">
              {product.name}
            </h1>

            {/* SKU / rating */}

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#d9d5cf] pb-6">
              {product.sku && (
                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#99938c]">
                  SKU:{' '}
                  <span className="text-[#66615b]">
                    {product.sku}
                  </span>
                </span>
              )}

              <span className="flex items-center gap-1 text-[#866b42]">
                {Array.from({
                  length: 5,
                }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-3 w-3 fill-current"
                    strokeWidth={1.2}
                  />
                ))}

                <span className="ml-1 text-[10px] text-[#66615b]">
                  4.9
                </span>
              </span>
            </div>

            {/* Price */}

            <div className="mt-7 flex flex-wrap items-baseline gap-3">
              <span className="text-2xl font-semibold tracking-tight text-[#181716] sm:text-3xl">
                {formatPrice(price)}
              </span>

              {originalPrice && (
                <span className="text-sm font-light tabular-nums text-[#99938c] line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}

            {product.short_description && (
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#66615b]">
                {product.short_description}
              </p>
            )}

            {/* Stock */}

            <div className="mt-6">
              {inStock ? (
                lowStock ? (
                  <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#866b42]">
                    <span className="h-1.5 w-1.5 animate-pulse bg-[#866b42]" />
                    Only {product.stock_quantity}{' '}
                    left in stock
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#5d705f]">
                    <span className="h-1.5 w-1.5 bg-[#5d705f]" />
                    In stock
                  </div>
                )
              ) : (
                <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#8a625c]">
                  <span className="h-1.5 w-1.5 bg-[#8a625c]" />
                  Out of stock
                </div>
              )}
            </div>

            {/* =================================================
                PURCHASE AREA
            ================================================== */}

            {inStock && (
              <div className="mt-7 border-y border-[#d9d5cf] py-7">

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#66615b]">
                    Quantity
                  </span>

                  <QuantityStepper
                    value={quantity}
                    max={maxQty}
                    onChange={setQuantity}
                    disabled={addingToCart}
                  />
                </div>

                <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className={cn(
                      'flex h-14 items-center justify-center gap-2',
                      'text-[10px] font-semibold uppercase tracking-[0.17em]',
                      'transition-colors duration-300',
                      'disabled:cursor-wait disabled:opacity-70',
                      justAdded
                        ? 'bg-[#5f513d] text-white'
                        : 'bg-[#181716] text-white hover:bg-[#302d29]'
                    )}
                  >
                    {addingToCart ? (
                      <>
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          strokeWidth={1.4}
                        />
                        Adding
                      </>
                    ) : justAdded ? (
                      <>
                        <Check
                          className="h-4 w-4"
                          strokeWidth={1.5}
                        />
                        Added to cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag
                          className="h-4 w-4"
                          strokeWidth={1.4}
                        />
                        Add to cart
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                    aria-label={
                      wishlisted
                        ? 'Remove from wishlist'
                        : 'Add to wishlist'
                    }
                    className={cn(
                      'flex h-14 w-14 items-center justify-center',
                      'border transition-all duration-300',
                      wishlisted
                        ? 'border-[#181716] bg-[#181716] text-white'
                        : 'border-[#b9b4ad] bg-white text-[#5f5a54] hover:border-[#181716] hover:text-[#181716]',
                      'disabled:cursor-wait disabled:opacity-60'
                    )}
                  >
                    {wishlistLoading ? (
                      <Loader2
                        className="h-5 w-5 animate-spin"
                        strokeWidth={1.4}
                      />
                    ) : (
                      <Heart
                        className={cn(
                          'h-5 w-5',
                          wishlisted && 'fill-current'
                        )}
                        strokeWidth={1.4}
                      />
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={addingToCart}
                  className="mt-3 flex h-14 w-full items-center justify-center border border-[#181716] bg-transparent text-[10px] font-semibold uppercase tracking-[0.17em] text-[#181716] transition-colors duration-300 hover:bg-[#181716] hover:text-white disabled:cursor-wait disabled:opacity-60"
                >
                  Buy now
                </button>
              </div>
            )}

            {/* =================================================
                SERVICE PROMISES
            ================================================== */}

            <div className="grid grid-cols-3 border-b border-[#d9d5cf] py-6">
              {[
                {
                  icon: ShieldCheck,
                  label: 'Certified',
                },
                {
                  icon: Truck,
                  label: 'Fast Delivery',
                },
                {
                  icon: RotateCcw,
                  label: '7-Day Returns',
                },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 border-r border-[#d9d5cf] px-2 text-center last:border-r-0"
                >
                  <Icon
                    className="h-4 w-4 text-[#866b42]"
                    strokeWidth={1.35}
                  />

                  <span className="text-[8px] font-medium uppercase tracking-[0.13em] text-[#66615b]">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Free shipping */}

            {price >= FREE_SHIPPING_THRESHOLD && (
              <div className="mt-5 flex items-center gap-3 border border-[#d9d5cf] bg-white px-4 py-3.5">
                <Truck
                  className="h-4 w-4 shrink-0 text-[#866b42]"
                  strokeWidth={1.35}
                />

                <span className="text-[9px] font-medium uppercase tracking-[0.13em] text-[#66615b]">
                  Free nationwide shipping on this order
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* =====================================================
            DETAILS
        ====================================================== */}

        <div className="mt-20 grid grid-cols-1 gap-10 border-t border-[#d9d5cf] pt-14 lg:grid-cols-[1.45fr_0.75fr] lg:gap-20">

          {/* Description */}

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#866b42]">
              The details
            </p>

            <h2 className="mt-3 font-serif text-3xl tracking-[-0.02em] text-[#171717] sm:text-4xl">
              About this piece
            </h2>

            <div className="mt-7 max-w-3xl whitespace-pre-line text-sm leading-7 text-[#66615b]">
              {product.description ||
                product.short_description ||
                'No description available.'}
            </div>
          </motion.section>

          {/* Specs */}

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.55,
              delay: 0.08,
            }}
          >
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#866b42]">
              Product information
            </p>

            <h2 className="mt-3 font-serif text-3xl tracking-[-0.02em] text-[#171717] sm:text-4xl">
              Details
            </h2>

            <div className="mt-6">
              <SpecRow
                icon={Layers}
                label="Material"
                value={product.material}
              />

              <SpecRow
                icon={Weight}
                label="Weight"
                value={product.weight}
              />

              <SpecRow
                icon={Ruler}
                label="Size"
                value={product.size}
              />

              <SpecRow
                icon={Gem}
                label="Stone"
                value={product.stone}
              />

              <SpecRow
                icon={Package}
                label="Gender"
                value={
                  product.gender
                    ? product.gender
                        .charAt(0)
                        .toUpperCase() +
                      product.gender.slice(1)
                    : null
                }
              />
            </div>
          </motion.section>
        </div>

        {/* =====================================================
            RELATED PRODUCTS
        ====================================================== */}

        {related.length > 0 && (
          <motion.section
            initial={{
              opacity: 0,
              y: 18,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mt-24 border-t border-[#d9d5cf] pt-14"
          >
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#866b42]">
                  Complete the collection
                </p>

                <h2 className="mt-3 font-serif text-3xl tracking-[-0.02em] text-[#171717] sm:text-4xl">
                  You may also love
                </h2>
              </div>

              <Link
                href="/products"
                className="group inline-flex items-center gap-2 self-start border-b border-[#b9b4ad] pb-1.5 text-[9px] font-medium uppercase tracking-[0.17em] text-[#282522] transition-colors hover:border-[#181716]"
              >
                View all jewellery

                <ChevronRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.4}
                />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-4">
              {related.map((item) => (
                <RelatedCard
                  key={item.id}
                  product={item}
                />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </main>
  )
}
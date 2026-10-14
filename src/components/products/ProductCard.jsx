'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ShoppingBag,
  Heart,
  Eye,
  Check,
  Loader2,
} from 'lucide-react'

import { cn } from '@/lib/helpers'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

export function ProductCard({ product, index = 0 }) {
  const router = useRouter()

  const { user } = useAuth()
  const { isWishlisted, toggle } = useWishlist()
  const { addToCart, isInCart, items } = useCart()

  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [cartLoading, setCartLoading] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const wishlisted = isWishlisted(product.id)
  const inCart = isInCart(product.id)

  const cartQty =
    items.find((item) => item.product_id === product.id)?.quantity || 0

  const price = Number(product.sale_price || product.price)

  const originalPrice = product.sale_price
    ? Number(product.price)
    : null

  const discount = originalPrice
    ? Math.round(
        ((originalPrice - price) / originalPrice) * 100
      )
    : null

  const inStock = product.stock_quantity > 0

  /* Wishlist */
  const handleWishlistToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (wishlistLoading) return

    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          window.location.pathname
        )}`
      )
      return
    }

    setWishlistLoading(true)

    try {
      await toggle(product.id)
    } catch (err) {
      if (err?.message === 'UNAUTHORIZED') {
        router.push('/login')
      } else {
        console.error('Wishlist toggle failed:', err)
      }
    } finally {
      setWishlistLoading(false)
    }
  }

  /* Add to cart */
  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (cartLoading) return

    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          window.location.pathname
        )}`
      )
      return
    }

    if (!inStock) return

    setCartLoading(true)

    try {
      await addToCart(product.id, 1)

      setJustAdded(true)

      setTimeout(() => {
        setJustAdded(false)
      }, 1200)
    } catch (err) {
      console.error('Add to cart failed:', err)
    } finally {
      setCartLoading(false)
    }
  }

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative min-w-0"
    >
      <Link
        href={`/products/${product.slug || product.id}`}
        className="block"
      >

        {/* ====================================================== */}
        {/* IMAGE                                                   */}
        {/* ====================================================== */}

        <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe9e5]">

          {product.primary_image ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-[#e5e2dc]" />
              )}

              <Image
                src={product.primary_image}
                alt={product.name}
                fill
                onLoad={() => setImageLoaded(true)}
                className={cn(
                  'object-cover transition duration-700 ease-out',
                  'group-hover:scale-[1.035]',
                  imageLoaded
                    ? 'opacity-100'
                    : 'opacity-0'
                )}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 320px"
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingBag
                className="h-10 w-10 text-[#aaa39a]"
                strokeWidth={1}
              />
            </div>
          )}

          {/* Subtle image overlay */}
          <div className="pointer-events-none absolute inset-0 bg-black/[0.025] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* ====================================================== */}
          {/* LABELS                                                  */}
          {/* ====================================================== */}

          <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5 sm:left-4 sm:top-4">

            {product.featured === 1 && (
              <span className="bg-white/95 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#866b42] shadow-sm backdrop-blur-sm">
                Featured
              </span>
            )}

            {discount && (
              <span className="bg-[#181716] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-white">
                Save {discount}%
              </span>
            )}

            {!inStock && (
              <span className="bg-[#3b3936] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-white">
                Sold out
              </span>
            )}

            {inCart && (
              <span className="flex items-center gap-1 bg-white/95 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#5f513d] shadow-sm backdrop-blur-sm">
                <Check className="h-2.5 w-2.5" />

                In cart

                {cartQty > 1 && ` (${cartQty})`}
              </span>
            )}

          </div>

          {/* ====================================================== */}
          {/* WISHLIST                                                */}
          {/* ====================================================== */}

          <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">

            <motion.button
              type="button"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.94,
              }}
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className={cn(
                'flex h-9 w-9 items-center justify-center',
                'border border-white/80 bg-white/95',
                'text-[#5f5a54] shadow-sm backdrop-blur-sm',
                'transition-all duration-300',
                'hover:border-[#866b42] hover:text-[#866b42]',
                'disabled:cursor-wait disabled:opacity-60',
                wishlisted &&
                  'border-[#181716] bg-[#181716] text-white hover:text-white'
              )}
              aria-label={
                wishlisted
                  ? 'Remove from wishlist'
                  : 'Add to wishlist'
              }
              aria-pressed={wishlisted}
            >
              <Heart
                className={cn(
                  'h-4 w-4',
                  wishlisted && 'fill-current'
                )}
                strokeWidth={1.5}
              />
            </motion.button>

          </div>

          {/* ====================================================== */}
          {/* QUICK VIEW                                              */}
          {/* ====================================================== */}

          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 translate-y-3 opacity-0 transition-all duration-400 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 sm:inset-x-4 sm:bottom-4">

            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="flex w-full items-center justify-center gap-2 border border-white/80 bg-white/95 py-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#282522] shadow-sm backdrop-blur-sm transition-colors hover:bg-[#181716] hover:text-white"
              aria-label="Quick view"
            >
              <Eye
                className="h-3.5 w-3.5"
                strokeWidth={1.5}
              />

              Quick view
            </button>

          </div>

          {/* ====================================================== */}
          {/* ADD TO CART                                             */}
          {/* ====================================================== */}

          {inStock && (
            <div className="absolute inset-x-3 bottom-3 z-20 translate-y-3 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100 sm:inset-x-4 sm:bottom-4">

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={cartLoading}
                className={cn(
                  'flex w-full items-center justify-center gap-2',
                  'py-2.5 text-[9px] font-semibold uppercase tracking-[0.16em]',
                  'shadow-sm transition-all duration-300',
                  'disabled:cursor-wait disabled:opacity-80',
                  justAdded
                    ? 'bg-[#5f513d] text-white'
                    : 'bg-[#181716] text-white hover:bg-[#302d29]'
                )}
              >

                {cartLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Adding
                  </>
                ) : justAdded ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-3.5 w-3.5" />

                    {inCart
                      ? 'Add another'
                      : 'Add to cart'}
                  </>
                )}

              </button>

            </div>
          )}

        </div>

        {/* ====================================================== */}
        {/* PRODUCT INFORMATION                                     */}
        {/* ====================================================== */}

        <div className="pt-4 sm:pt-5">

          {/* Category */}
          {product.category_name && (
            <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#866b42]">
              {product.category_name}
            </p>
          )}

          {/* Product Name */}
          <h3 className="line-clamp-2 min-h-[40px] text-[13px] font-medium leading-5 text-[#282522] transition-colors duration-300 group-hover:text-[#866b42] sm:text-sm">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2 flex flex-wrap items-baseline gap-2">

            <span className="text-sm font-semibold tracking-tight text-[#181716] sm:text-[15px]">
              PKR {price.toLocaleString()}
            </span>

            {originalPrice && (
              <span className="text-[11px] text-[#99938c] line-through">
                PKR {originalPrice.toLocaleString()}
              </span>
            )}

          </div>

          {/* Stone */}
          {product.stone && (
            <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-[#99938c]">
              {product.stone}
            </p>
          )}

          {/* Divider */}
          <div className="mt-4 h-px w-full bg-[#d9d5cf] transition-colors duration-300 group-hover:bg-[#b9b4ad]" />

        </div>

      </Link>
    </motion.article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="min-w-0">

      {/* Image */}
      <div className="aspect-[4/5] animate-pulse bg-[#e5e2dc]" />

      {/* Details */}
      <div className="space-y-3 pt-4 sm:pt-5">

        <div className="h-2.5 w-20 animate-pulse bg-[#ddd9d2]" />

        <div className="h-3.5 w-11/12 animate-pulse bg-[#ddd9d2]" />

        <div className="h-3.5 w-3/4 animate-pulse bg-[#ddd9d2]" />

        <div className="h-3.5 w-24 animate-pulse bg-[#ddd9d2]" />

      </div>
    </div>
  )
}
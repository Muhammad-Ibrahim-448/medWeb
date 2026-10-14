'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gem,
  Diamond,
  CircleDot,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  Loader2,
  PackageX,
  Sparkles,
} from 'lucide-react'

import api from '@/lib/axios'
import { COLLECTIONS } from '@/lib/collections'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/helpers'

const ICONS = {
  gold: Gem,
  silver: CircleDot,
  diamond: Diamond,
}

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'name_asc', label: 'Name A–Z' },
]

const GENDER_FILTERS = [
  { value: '', label: 'All' },
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
]

function formatPrice(n) {
  const v = Number(n)

  if (Number.isNaN(v)) {
    return '—'
  }

  return `PKR ${v.toLocaleString('en-PK')}`
}

function productImageSrc(product) {
  const src = product?.primary_image

  if (!src) {
    return '/images/placeholder.png'
  }

  if (src.startsWith('http') || src.startsWith('/')) {
    return src
  }

  return `/${src}`
}

/* ============================================================
   PRODUCT CARD
============================================================ */

function ProductCard({ product }) {
  const hasSale =
    product.sale_price &&
    Number(product.sale_price) < Number(product.price)

  const outOfStock = !product.in_stock

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group min-w-0"
    >
      <Link
        href={`/products/${product.slug}`}
        className="block"
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe9e5]">
          <Image
            src={productImageSrc(product)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />

          {/* Subtle hover overlay */}
          <div className="absolute inset-0 bg-black/[0.025] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Sale */}
          {hasSale && (
            <div className="absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
              <span className="bg-[#181716] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-white">
                Sale
              </span>
            </div>
          )}

          {/* Featured */}
          {product.featured === 1 && (
            <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
              <span className="flex items-center gap-1.5 border border-white/70 bg-white/95 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#866b42] shadow-sm backdrop-blur-sm">
                <Sparkles
                  className="h-2.5 w-2.5"
                  strokeWidth={1.5}
                />
                Featured
              </span>
            </div>
          )}

          {/* Out of stock */}
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#181716]/45 backdrop-blur-[1px]">
              <span className="border border-white/50 bg-black/10 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product information */}
        <div className="pt-4 sm:pt-5">
          {product.category_name && (
            <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#866b42]">
              {product.category_name}
            </p>
          )}

          <h3 className="line-clamp-2 min-h-[40px] text-[13px] font-medium leading-5 text-[#282522] transition-colors duration-300 group-hover:text-[#866b42] sm:text-sm">
            {product.name}
          </h3>

          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-semibold tracking-tight text-[#181716] sm:text-[15px]">
              {formatPrice(product.unit_price)}
            </span>

            {hasSale && (
              <span className="text-[11px] text-[#99938c] line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="mt-4 h-px w-full bg-[#d9d5cf] transition-colors duration-300 group-hover:bg-[#b9b4ad]" />
        </div>
      </Link>
    </motion.article>
  )
}

/* ============================================================
   SKELETON
============================================================ */

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="min-w-0"
        >
          <div className="aspect-[4/5] animate-pulse bg-[#e5e2dc]" />

          <div className="space-y-3 pt-4 sm:pt-5">
            <div className="h-2.5 w-20 animate-pulse bg-[#ddd9d2]" />
            <div className="h-3.5 w-11/12 animate-pulse bg-[#ddd9d2]" />
            <div className="h-3.5 w-3/4 animate-pulse bg-[#ddd9d2]" />
            <div className="h-3.5 w-24 animate-pulse bg-[#ddd9d2]" />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({ collectionName }) {
  return (
    <div className="border border-dashed border-[#d9d5cf] bg-white px-6 py-20 text-center sm:px-10">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-[#d9d5cf] bg-[#f6f5f2]">
        <PackageX
          className="h-7 w-7 text-[#866b42]"
          strokeWidth={1.2}
        />
      </div>

      <h3 className="font-serif text-3xl tracking-[-0.02em] text-[#171717]">
        No pieces to show yet
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#66615b]">
        Our {collectionName} is being refreshed. Check back soon for
        new pieces.
      </p>

      <Link
        href="/collections"
        className="mt-7 inline-flex items-center gap-3 bg-[#181716] px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.17em] text-white transition-colors duration-300 hover:bg-[#302d29]"
      >
        Browse other collections

        <ArrowRight
          className="h-4 w-4"
          strokeWidth={1.4}
        />
      </Link>
    </div>
  )
}

/* ============================================================
   MAIN
============================================================ */

export default function CollectionClient({ slug }) {
  const col = COLLECTIONS[slug]
  const Icon = ICONS[slug] || Gem

  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [sort, setSort] = useState('newest')
  const [gender, setGender] = useState('')
  const [sortOpen, setSortOpen] = useState(false)

  const fetchCollection = async ({
    page = 1,
    append = false,
  } = {}) => {
    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    try {
      const { data } = await api.get(`/collections/${slug}`, {
        params: {
          sort,
          gender: gender || undefined,
          page,
          limit: 12,
        },
      })

      const items = data?.data?.products || []

      setProducts((prev) =>
        append ? [...prev, ...items] : items
      )

      setPagination(data?.data?.pagination || null)
    } catch (err) {
      console.error('Failed to fetch collection:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchCollection({ page: 1 })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, sort, gender])

  const canLoadMore = useMemo(
    () =>
      pagination &&
      pagination.page < pagination.totalPages,
    [pagination]
  )

  return (
    <main className="min-h-screen bg-[#f6f5f2] pt-28 pb-20 sm:pt-32 sm:pb-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">

        {/* ================================================== */}
        {/* BREADCRUMB                                         */}
        {/* ================================================== */}

        <nav className="mb-8 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.15em] text-[#99938c]">
          <Link
            href="/"
            className="transition-colors hover:text-[#866b42]"
          >
            Home
          </Link>

          <span className="text-[#c4c0ba]">/</span>

          <Link
            href="/collections"
            className="transition-colors hover:text-[#866b42]"
          >
            Collections
          </Link>

          <span className="text-[#c4c0ba]">/</span>

          <span className="text-[#66615b]">
            {col.name}
          </span>
        </nav>

        {/* ================================================== */}
        {/* COLLECTION HERO                                    */}
        {/* ================================================== */}

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mb-14 overflow-hidden bg-white sm:mb-16 lg:mb-20"
        >
          <div className="grid min-h-[480px] lg:grid-cols-2 lg:min-h-[560px]">

            {/* Image */}
            <div className="relative order-1 min-h-[360px] overflow-hidden lg:order-2 lg:min-h-[560px]">
              <Image
                src={col.hero}
                alt={`${col.name} - Shoaib Jewellers`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.02]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0" />

              <div className="absolute right-5 top-5 sm:right-7 sm:top-7">
                <span className="border border-white/50 bg-black/10 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                  Collection
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="order-2 flex items-center px-7 py-12 sm:px-10 sm:py-16 lg:order-1 lg:px-14 xl:px-20">
              <div className="max-w-xl">

                <div className="mb-6 flex items-center gap-3">
                  <Icon
                    className="h-4 w-4 text-[#866b42]"
                    strokeWidth={1.2}
                  />

                  <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#866b42]">
                    Shoaib Jewellers
                  </p>
                </div>

                <h1 className="font-serif text-4xl leading-[1.02] tracking-[-0.025em] text-[#171717] sm:text-5xl lg:text-6xl xl:text-[68px]">
                  {col.name}
                </h1>

                <div className="mt-7 flex items-center gap-3">
                  <div className="h-px w-10 bg-[#b9b4ad]" />

                  <Sparkles
                    className="h-3.5 w-3.5 text-[#866b42]"
                    strokeWidth={1.2}
                  />

                  <div className="h-px w-10 bg-[#b9b4ad]" />
                </div>

                <p className="mt-7 max-w-lg text-sm leading-7 text-[#66615b] sm:text-[15px]">
                  {col.description}
                </p>

                {/* Materials */}
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#d9d5cf] pt-6">
                  {col.materials.map((material) => (
                    <span
                      key={material}
                      className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#866b42]"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ================================================== */}
        {/* TOOLBAR                                            */}
        {/* ================================================== */}

        <div className="mb-8 flex flex-col gap-5 border-b border-[#d9d5cf] pb-6 sm:flex-row sm:items-center sm:justify-between">

          {/* Gender */}
          <div className="flex items-center gap-1 border-b border-[#d9d5cf]">
            {GENDER_FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setGender(item.value)}
                className={cn(
                  'relative px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] transition-colors',
                  gender === item.value
                    ? 'text-[#181716]'
                    : 'text-[#99938c] hover:text-[#282522]'
                )}
              >
                {item.label}

                {gender === item.value && (
                  <motion.span
                    layoutId="collection-gender"
                    className="absolute inset-x-0 -bottom-px h-px bg-[#181716]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSortOpen((value) => !value)}
              className="inline-flex items-center gap-2 border border-[#d9d5cf] bg-white px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#282522] transition-colors hover:border-[#b9b4ad]"
            >
              <SlidersHorizontal
                className="h-3.5 w-3.5"
                strokeWidth={1.4}
              />

              {SORTS.find((item) => item.value === sort)?.label}

              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 transition-transform duration-300',
                  sortOpen && 'rotate-180'
                )}
                strokeWidth={1.4}
              />
            </button>

            <AnimatePresence>
              {sortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setSortOpen(false)}
                  />

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 6,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: 6,
                    }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden border border-[#d9d5cf] bg-white shadow-xl"
                  >
                    <div className="p-1">
                      {SORTS.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => {
                            setSort(item.value)
                            setSortOpen(false)
                          }}
                          className={cn(
                            'block w-full px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.12em] transition-colors',
                            sort === item.value
                              ? 'bg-[#f6f5f2] text-[#866b42]'
                              : 'text-[#66615b] hover:bg-[#f6f5f2] hover:text-[#282522]'
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ================================================== */}
        {/* RESULTS                                            */}
        {/* ================================================== */}

        {loading ? (
          <GridSkeleton />
        ) : products.length === 0 ? (
          <EmptyState collectionName={col.name} />
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* ================================================== */}
            {/* LOAD MORE                                          */}
            {/* ================================================== */}

            {canLoadMore && (
              <div className="mt-14 flex justify-center sm:mt-16">
                <Button
                  variant="outlineAmber"
                  size="lg"
                  onClick={() =>
                    fetchCollection({
                      page: pagination.page + 1,
                      append: true,
                    })
                  }
                  disabled={loadingMore}
                  className="rounded-none border-[#b9b4ad] bg-transparent px-8 text-[10px] uppercase tracking-[0.16em] text-[#282522] shadow-none hover:border-[#181716] hover:bg-transparent"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading
                    </>
                  ) : (
                    <>
                      Load More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Count */}
            <p className="mt-8 text-center text-[9px] font-medium uppercase tracking-[0.18em] text-[#99938c]">
              Showing {products.length} of{' '}
              {pagination?.total ?? products.length} pieces
            </p>
          </>
        )}

        {/* ================================================== */}
        {/* BOTTOM COLLECTION NAVIGATION                       */}
        {/* ================================================== */}

        <section className="mt-20 border-t border-[#d9d5cf] pt-12 text-center sm:mt-24 sm:pt-14">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#866b42]">
            Continue exploring
          </p>

          <h2 className="mt-3 font-serif text-3xl tracking-[-0.02em] text-[#171717] sm:text-4xl">
            Discover more jewellery
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#66615b]">
            Explore our other collections or browse the complete
            Shoaib Jewellers selection.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/collections"
              className="inline-flex items-center gap-3 border border-[#b9b4ad] px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.17em] text-[#282522] transition-colors hover:border-[#181716]"
            >
              All collections
            </Link>

            <Link
              href="/products"
              className="group inline-flex items-center gap-3 bg-[#181716] px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.17em] text-white transition-colors hover:bg-[#302d29]"
            >
              Browse all products

              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.4}
              />
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
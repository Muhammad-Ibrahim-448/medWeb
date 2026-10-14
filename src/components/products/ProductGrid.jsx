'use client'

import { motion } from 'framer-motion'
import { Gem } from 'lucide-react'

import {
  ProductCard,
  ProductCardSkeleton,
} from './ProductCard'

export function ProductGrid({
  products,
  loading,
  emptyMessage = 'No products found.',
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="border border-dashed border-[#d9d5cf] bg-white px-6 py-20 text-center sm:px-10"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-[#d9d5cf] bg-[#f6f5f2]">
          <Gem
            className="h-7 w-7 text-[#866b42]"
            strokeWidth={1.2}
          />
        </div>

        <h3 className="font-serif text-3xl tracking-[-0.02em] text-[#171717]">
          No pieces found
        </h3>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#66615b]">
          {emptyMessage}
        </p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
        />
      ))}
    </div>
  )
}
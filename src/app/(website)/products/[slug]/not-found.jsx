import Link from 'next/link'
import { ArrowLeft, Gem } from 'lucide-react'

export default function ProductNotFound() {
  return (
    <main className="min-h-screen bg-[#f6f5f2] px-5 pb-24 pt-32">
      <div className="mx-auto flex min-h-[520px] max-w-2xl items-center justify-center">
        <div className="w-full text-center">

          {/* Icon */}
          <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center border border-[#d9d5cf] bg-white">
            <Gem
              className="h-8 w-8 text-[#866b42]"
              strokeWidth={1.2}
            />
          </div>

          {/* Eyebrow */}
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#866b42]">
            Shoaib Jewellers
          </p>

          {/* Heading */}
          <h1 className="mt-4 font-serif text-4xl leading-none tracking-[-0.025em] text-[#171717] sm:text-5xl">
            Piece not found.
          </h1>

          {/* Divider */}
          <div className="mx-auto mt-7 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-[#b9b4ad]" />

            <div className="h-1.5 w-1.5 rotate-45 bg-[#866b42]" />

            <div className="h-px w-10 bg-[#b9b4ad]" />
          </div>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[#66615b]">
            The piece you are looking for may have been moved, sold,
            or is no longer available.
          </p>

          {/* CTA */}
          <Link
            href="/products"
            className="group mt-8 inline-flex items-center gap-3 bg-[#181716] px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.17em] text-white transition-colors duration-300 hover:bg-[#302d29]"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              strokeWidth={1.4}
            />

            Browse all products
          </Link>
        </div>
      </div>
    </main>
  )
}
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Gem, Sparkles, Diamond, CircleDot } from 'lucide-react'

import { COLLECTION_LIST } from '@/lib/collections'

export const metadata = {
  title: 'Collections | Shoaib Jewellers',
  description:
    'Explore our curated collections of gold, silver, and diamond jewellery.',
}

const ICONS = {
  gold: Gem,
  silver: CircleDot,
  diamond: Diamond,
}

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-[#f6f5f2] pt-28 pb-20 sm:pt-32 sm:pb-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* ====================================================== */}
        {/* HEADER                                                  */}
        {/* ====================================================== */}

        <header className="mx-auto max-w-3xl pb-14 text-center sm:pb-16 lg:pb-20">
          <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.3em] text-[#866b42]">
            Shoaib Jewellers
          </p>

          <h1 className="font-serif text-4xl leading-[1.02] tracking-[-0.025em] text-[#171717] sm:text-5xl lg:text-6xl">
            Curated for every
            <br />
            <span className="italic">moment.</span>
          </h1>

          <div className="mx-auto mt-7 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#b9b4ad]" />

            <Sparkles
              className="h-3.5 w-3.5 text-[#866b42]"
              strokeWidth={1.4}
            />

            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#b9b4ad]" />
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#66615b] sm:text-[15px]">
            Three signature collections, thoughtfully crafted for celebrations,
            everyday elegance and the moments that become part of your story.
          </p>
        </header>

        {/* ====================================================== */}
        {/* COLLECTION GRID                                         */}
        {/* ====================================================== */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {COLLECTION_LIST.map((col, index) => {
            const Icon = ICONS[col.slug] || Gem

            return (
              <Link
                key={col.slug}
                href={`/collections/${col.slug}`}
                className="group block"
              >
                <article className="relative overflow-hidden bg-white">
                  {/* ================================================== */}
                  {/* COLLECTION IMAGE                                   */}
                  {/* ================================================== */}

                  <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe9e5]">
                    <Image
                      src={col.hero}
                      alt={`${col.name} - Shoaib Jewellers`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    />

                    {/* Editorial image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/0" />

                    {/* Subtle hover overlay */}
                    <div className="absolute inset-0 bg-black/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Top label */}
                    <div className="absolute left-5 top-5 z-10 sm:left-6 sm:top-6">
                      <span className="border border-white/50 bg-black/10 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                        Collection {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Center icon */}
                    <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                      <div className="flex h-20 w-20 items-center justify-center border border-white/40 bg-white/10 backdrop-blur-md transition-all duration-500 group-hover:scale-105 group-hover:bg-white/15">
                        <Icon
                          className="h-8 w-8 text-white"
                          strokeWidth={1.2}
                        />
                      </div>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7">
                      <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.2em] text-white/70">
                        {col.slug}
                      </p>

                      <h2 className="font-serif text-3xl leading-none tracking-[-0.02em] text-white sm:text-[34px]">
                        {col.name}
                      </h2>
                    </div>
                  </div>

                  {/* ================================================== */}
                  {/* COLLECTION DETAILS                                 */}
                  {/* ================================================== */}

                  <div className="p-6 sm:p-7">
                    <p className="min-h-[72px] text-sm leading-6 text-[#66615b]">
                      {col.tagline}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-[#d9d5cf] pt-5">
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {col.materials.slice(0, 2).map((material) => (
                          <span
                            key={material}
                            className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#866b42]"
                          >
                            {material}
                          </span>
                        ))}
                      </div>

                      <span className="group/link inline-flex shrink-0 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#282522]">
                        Explore
                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1"
                          strokeWidth={1.4}
                        />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>

        {/* ====================================================== */}
        {/* BOTTOM CTA                                              */}
        {/* ====================================================== */}

        <section className="mt-20 border-t border-[#d9d5cf] pt-12 text-center sm:mt-24 sm:pt-14">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#866b42]">
            Find your piece
          </p>

          <h2 className="mt-3 font-serif text-3xl tracking-[-0.02em] text-[#171717] sm:text-4xl">
            Looking for something specific?
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#66615b]">
            Explore our complete jewellery selection and discover something made
            for your next meaningful moment.
          </p>

          <Link
            href="/products"
            className="group mt-7 inline-flex items-center gap-3 bg-[#181716] px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.17em] text-white transition-colors duration-300 hover:bg-[#302d29]"
          >
            Browse all products

            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.4}
            />
          </Link>
        </section>
      </div>
    </main>
  )
}
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";

import { ProductGrid } from "@/components/products/ProductGrid";
import { cn } from "@/lib/helpers";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "name_asc", label: "Name: A to Z" },
];

export function ProductsPageLayout({
  title,
  subtitle,
  badge,
  gender,
  accentColor = "amber",
  heroGradient,
  heroImage,
  heroImageAlt = "Collection hero",
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const [showFilters, setShowFilters] = useState(false);

  const [priceRange, setPriceRange] = useState({
    min: "",
    max: "",
  });

  const limit = 12;

  /* ============================================================
     SEARCH DEBOUNCE
  ============================================================ */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* ============================================================
     FETCH PRODUCTS
  ============================================================ */

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort,
      });

      if (gender) {
        params.set("gender", gender);
      }

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      }

      if (priceRange.min) {
        params.set("minPrice", priceRange.min);
      }

      if (priceRange.max) {
        params.set("maxPrice", priceRange.max);
      }

      const res = await fetch(`/api/products?${params}`);

      const data = await res.json();

      if (data.success) {
        setProducts(data.data || []);
        setTotal(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, [page, sort, debouncedSearch, gender, priceRange.min, priceRange.max]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ============================================================
     RESET PAGE WHEN FILTERS CHANGE
  ============================================================ */

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort, priceRange.min, priceRange.max]);

  /* ============================================================
     FILTER HELPERS
  ============================================================ */

  const clearFilters = () => {
    setSearch("");
    setSort("newest");
    setPriceRange({
      min: "",
      max: "",
    });
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(priceRange.min) ||
    Boolean(priceRange.max) ||
    sort !== "newest";

  /* ============================================================
     PAGE
  ============================================================ */

  return (
    <main className="min-h-screen bg-[#f6f5f2]">
      {/* ======================================================
          HERO
      ======================================================= */}

      <section className="relative overflow-hidden border-b border-[#d9d5cf] bg-[#f6f5f2]">
        {heroImage ? (
          <div className="relative min-h-[560px] lg:min-h-[600px]">
            <Image
              src={heroImage}
              alt={heroImageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />

            {/* Editorial image overlay */}

            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-black/5" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

            <div className="absolute inset-0 bg-black/[0.04]" />

            {/* Content */}

            <div className="relative mx-auto flex min-h-[560px] max-w-[1440px] items-end px-5 pb-14 sm:px-8 sm:pb-16 lg:min-h-[600px] lg:px-12 lg:pb-20">
              <div className="max-w-2xl text-white">
                {badge && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.55,
                    }}
                    className="mb-5 flex items-center gap-3"
                  >
                    <span className="h-px w-8 bg-white/60" />

                    <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/80">
                      {badge}
                    </span>
                  </motion.div>
                )}

                <motion.h1
                  initial={{
                    opacity: 0,
                    y: 22,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-serif text-5xl leading-[0.98] tracking-[-0.03em] sm:text-6xl lg:text-[72px]"
                >
                  {title}
                </motion.h1>

                <motion.div
                  initial={{
                    opacity: 0,
                    scaleX: 0,
                  }}
                  animate={{
                    opacity: 1,
                    scaleX: 1,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: 0.18,
                  }}
                  className="mt-6 flex origin-left items-center gap-3"
                >
                  <div className="h-px w-10 bg-white/50" />

                  <Sparkles
                    className="h-3.5 w-3.5 text-white/80"
                    strokeWidth={1.2}
                  />

                  <div className="h-px w-10 bg-white/50" />
                </motion.div>

                {subtitle && (
                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: 0.25,
                    }}
                    className="mt-6 max-w-xl text-sm leading-7 text-white/80 sm:text-[15px]"
                  >
                    {subtitle}
                  </motion.p>
                )}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.35,
                  }}
                  className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-[9px] font-medium uppercase tracking-[0.18em] text-white/65"
                >
                  <span>Fine Jewellery</span>
                  <span>Gold</span>
                  <span>Diamonds</span>
                  <span>Silver</span>
                </motion.div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="mx-auto max-w-[1440px] px-5 pb-14 pt-28 text-center sm:px-8 sm:pb-16 lg:px-12 lg:pb-20 lg:pt-36">
              {badge && (
                <motion.p
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="mb-5 text-[10px] font-medium uppercase tracking-[0.3em] text-[#866b42]"
                >
                  {badge}
                </motion.p>
              )}

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                }}
                className="font-serif text-5xl leading-[0.98] tracking-[-0.03em] text-[#171717] sm:text-6xl lg:text-[72px]"
              >
                {title}
              </motion.h1>

              <div className="mx-auto mt-7 flex items-center justify-center gap-3">
                <div className="h-px w-10 bg-[#b9b4ad]" />

                <Sparkles
                  className="h-3.5 w-3.5 text-[#866b42]"
                  strokeWidth={1.2}
                />

                <div className="h-px w-10 bg-[#b9b4ad]" />
              </div>

              {subtitle && (
                <motion.p
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15,
                  }}
                  className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#66615b] sm:text-[15px]"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ======================================================
          CONTENT
      ======================================================= */}

      <div className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 lg:px-12 lg:pb-24">
        {/* ====================================================
            TOOLBAR
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.15,
          }}
          className="border-b border-[#d9d5cf] py-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}

            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#866b42]"
                strokeWidth={1.5}
              />

              <input
                type="text"
                placeholder="Search jewellery..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full border border-[#d9d5cf] bg-white pl-11 pr-11 text-sm text-[#282522] placeholder-[#aaa39a] outline-none transition-colors duration-300 focus:border-[#866b42]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-[#99938c] transition-colors hover:text-[#181716]"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" strokeWidth={1.4} />
                </button>
              )}
            </div>

            {/* Sort */}

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-12 w-full appearance-none border border-[#d9d5cf] bg-white pl-4 pr-11 text-[10px] font-medium uppercase tracking-[0.12em] text-[#282522] outline-none transition-colors duration-300 focus:border-[#866b42] lg:w-56"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#866b42]"
                strokeWidth={1.4}
              />
            </div>

            {/* Mobile filter */}

            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              className={cn(
                "flex h-12 items-center justify-center gap-2",
                "border border-[#d9d5cf] bg-white px-5",
                "text-[10px] font-medium uppercase tracking-[0.15em]",
                "text-[#282522] transition-colors",
                "hover:border-[#181716]",
                "lg:hidden",
              )}
            >
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.4} />
              Price filter
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  showFilters && "rotate-180",
                )}
                strokeWidth={1.4}
              />
            </button>
          </div>

          {/* ==================================================
              MOBILE PRICE FILTER
          ================================================== */}

          <AnimatePresence initial={false}>
            {showFilters && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                className="overflow-hidden lg:hidden"
              >
                <div className="mt-5 border-t border-[#d9d5cf] pt-5">
                  <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.2em] text-[#866b42]">
                    Price range — PKR
                  </p>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          min: e.target.value,
                        })
                      }
                      className="h-11 w-full border border-[#d9d5cf] bg-white px-4 text-sm text-[#282522] outline-none transition-colors focus:border-[#866b42]"
                    />

                    <span className="text-[#b9b4ad]">—</span>

                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          max: e.target.value,
                        })
                      }
                      className="h-11 w-full border border-[#d9d5cf] bg-white px-4 text-sm text-[#282522] outline-none transition-colors focus:border-[#866b42]"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ==================================================
              DESKTOP PRICE FILTER
          ================================================== */}

          <div className="mt-5 hidden items-center gap-3 border-t border-[#d9d5cf] pt-5 lg:flex">
            <span className="mr-2 shrink-0 text-[9px] font-medium uppercase tracking-[0.2em] text-[#866b42]">
              Price range
            </span>

            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({
                  ...priceRange,
                  min: e.target.value,
                })
              }
              className="h-10 w-32 border border-[#d9d5cf] bg-white px-3 text-sm text-[#282522] outline-none transition-colors focus:border-[#866b42]"
            />

            <span className="text-[#b9b4ad]">—</span>

            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({
                  ...priceRange,
                  max: e.target.value,
                })
              }
              className="h-10 w-32 border border-[#d9d5cf] bg-white px-3 text-sm text-[#282522] outline-none transition-colors focus:border-[#866b42]"
            />

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto inline-flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-[#66615b] transition-colors hover:text-[#181716]"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.4} />
                Clear all
              </button>
            )}
          </div>
        </motion.div>

        {/* ====================================================
            RESULTS HEADER
        ===================================================== */}

        <div className="flex items-center justify-between border-b border-[#d9d5cf] py-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#99938c]">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse bg-[#866b42]" />
                Curating jewellery...
              </span>
            ) : (
              <>
                <span className="text-[#282522]">{total}</span>{" "}
                {total === 1 ? "piece" : "pieces"}
              </>
            )}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-[#66615b] transition-colors hover:text-[#181716] lg:hidden"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.4} />
              Clear
            </button>
          )}
        </div>

        {/* ====================================================
            PRODUCT GRID
        ===================================================== */}

        <div className="pt-8">
          <ProductGrid
            products={products}
            loading={loading}
            emptyMessage="No products match your search. Try adjusting your filters or search terms."
          />
        </div>

        {/* ====================================================
            PAGINATION
        ===================================================== */}

        {!loading && totalPages > 1 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-20 flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              disabled={page === 1}
              onClick={() => {
                setPage((current) => Math.max(1, current - 1));

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="flex h-10 items-center border border-[#d9d5cf] bg-white px-4 text-[9px] font-medium uppercase tracking-[0.15em] text-[#282522] transition-colors hover:border-[#181716] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Previous
            </button>

            <div className="mx-2 flex items-center gap-1">
              {Array.from(
                {
                  length: Math.min(5, totalPages),
                },
                (_, i) => {
                  let pageNum;

                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => {
                        setPage(pageNum);

                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center border text-[10px] font-medium transition-all duration-300",
                        page === pageNum
                          ? "border-[#181716] bg-[#181716] text-white"
                          : "border-[#d9d5cf] bg-white text-[#66615b] hover:border-[#181716] hover:text-[#181716]",
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                },
              )}
            </div>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => {
                setPage((current) => Math.min(totalPages, current + 1));

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="flex h-10 items-center border border-[#d9d5cf] bg-white px-4 text-[9px] font-medium uppercase tracking-[0.15em] text-[#282522] transition-colors hover:border-[#181716] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}

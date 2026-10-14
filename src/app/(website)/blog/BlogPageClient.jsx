// src/app/(website)/blog/BlogPageClient.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  X,
  Sparkles,
  Gem,
  Calendar,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/helpers";

const LIMIT = 9;

export function BlogPageClient() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
      });

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      }

      const res = await fetch(`/api/blog?${params}`);
      const data = await res.json();

      if (data.success) {
        setPosts(data.data || []);
        setTotal(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch blog posts:", err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[#f6f5f2]">
      {/* ============================================================= */}
      {/* HERO                                                         */}
      {/* ============================================================= */}
      <section className="relative overflow-hidden border-b border-[#d9d5cf] bg-[#f6f5f2]">
        <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-36 lg:px-12 lg:pb-28">
          <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Hero copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="mb-7 flex items-center gap-3"
              >
                <span className="h-px w-10 bg-[#866b42]" />

                <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#866b42]">
                  The Shoaib Journal
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08 }}
                className="max-w-4xl font-serif text-5xl leading-[0.96] tracking-[-0.035em] text-[#171717] sm:text-6xl lg:text-8xl"
              >
                Stories worth
                <br />
                <span className="italic text-[#866b42]">remembering.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="mt-8 max-w-xl text-sm leading-7 text-[#66615b] sm:text-base"
              >
                Discover stories from the atelier, thoughtful styling guides,
                gemstone knowledge, and the craftsmanship behind jewellery made
                for meaningful moments.
              </motion.p>
            </div>

            {/* Editorial mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden justify-end lg:flex"
            >
              <div className="relative flex h-64 w-64 items-center justify-center border border-[#d9d5cf] bg-white">
                <div className="absolute inset-4 border border-[#e6e2dc]" />

                <div className="relative text-center">
                  <Gem
                    className="mx-auto h-8 w-8 text-[#866b42]"
                    strokeWidth={1}
                  />

                  <div className="mt-5 h-px w-12 bg-[#b9b4ad]" />

                  <p className="mt-5 font-serif text-2xl italic text-[#171717]">
                    Fine jewellery.
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-[#8b857d]">
                    Since generations
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Decorative divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.7 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 flex items-center gap-4 sm:mt-20"
          >
            <span className="h-px flex-1 bg-[#d9d5cf]" />
            <Sparkles className="h-4 w-4 text-[#866b42]" strokeWidth={1.2} />
            <span className="h-px flex-1 bg-[#d9d5cf]" />
          </motion.div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* CONTENT                                                       */}
      {/* ============================================================= */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-10 sm:px-8 lg:px-12 lg:pb-32">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border border-[#d9d5cf] bg-white p-3 sm:p-4"
        >
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b857d]"
              strokeWidth={1.4}
            />

            <input
              type="text"
              placeholder="Search the journal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full border border-[#d9d5cf] bg-[#f6f5f2] pl-11 pr-12 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#99938b] focus:border-[#866b42] focus:bg-white"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[#8b857d] transition-colors hover:text-[#171717]"
              >
                <X className="h-4 w-4" strokeWidth={1.4} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Result header */}
        <div className="mt-12 flex items-end justify-between border-b border-[#d9d5cf] pb-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#866b42]">
              From the journal
            </p>

            <h2 className="mt-2 font-serif text-3xl tracking-[-0.025em] text-[#171717] sm:text-4xl">
              Latest stories
            </h2>
          </div>

          <p className="hidden text-xs text-[#77716a] sm:block">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse bg-[#866b42]" />
                Loading...
              </span>
            ) : (
              <>
                <span className="font-medium text-[#171717]">{total}</span>{" "}
                {total === 1 ? "story" : "stories"}
              </>
            )}
          </p>
        </div>

        {/* Mobile result count */}
        <div className="mt-5 sm:hidden">
          <p className="text-xs text-[#77716a]">
            {loading ? (
              "Loading journal..."
            ) : (
              <>
                <span className="font-medium text-[#171717]">{total}</span>{" "}
                {total === 1 ? "story" : "stories"}
              </>
            )}
          </p>
        </div>

        {/* =========================================================== */}
        {/* POSTS                                                        */}
        {/* =========================================================== */}
        <div className="mt-8">
          {loading ? (
            <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <EmptyState search={search} />
          ) : (
            <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  index={i}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>

        {/* =========================================================== */}
        {/* PAGINATION                                                   */}
        {/* =========================================================== */}
        {!loading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 flex items-center justify-center gap-2 border-t border-[#d9d5cf] pt-8"
          >
            <button
              type="button"
              disabled={page === 1}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="border border-[#d9d5cf] bg-white px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.15em] text-[#55504a] transition-colors hover:border-[#866b42] hover:text-[#866b42] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Previous
            </button>

            <div className="mx-2 flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                      "flex h-10 w-10 items-center justify-center border text-xs transition-colors",
                      page === pageNum
                        ? "border-[#181716] bg-[#181716] text-white"
                        : "border-[#d9d5cf] bg-white text-[#66615b] hover:border-[#866b42] hover:text-[#866b42]",
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="border border-[#d9d5cf] bg-white px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.15em] text-[#55504a] transition-colors hover:border-[#866b42] hover:text-[#866b42] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Next
            </button>
          </motion.div>
        )}
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Blog Card                                                           */
/* ------------------------------------------------------------------ */

function BlogCard({ post, index, formatDate }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.07, 0.35),
      }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden border border-[#d9d5cf] bg-[#ebe9e5]">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#ebe9e5]">
              <Gem className="h-14 w-14 text-[#b5aea4]" strokeWidth={1} />
            </div>
          )}

          {/* Editorial overlay */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#171717]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Journal label */}
          <div className="absolute left-4 top-4 bg-[#f6f5f2]/95 px-3 py-2">
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#866b42]">
              Journal
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="pt-5">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2.5 text-[10px] uppercase tracking-[0.13em] text-[#8b857d]">
            {post.published_at && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar
                  className="h-3 w-3 text-[#866b42]"
                  strokeWidth={1.3}
                />
                {formatDate(post.published_at)}
              </span>
            )}

            {post.author_name && (
              <>
                <span className="h-1 w-1 bg-[#b9b4ad]" />
                <span>{post.author_name}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="mt-3 line-clamp-2 font-serif text-2xl leading-[1.1] tracking-[-0.02em] text-[#171717] transition-colors duration-300 group-hover:text-[#866b42]">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#66615b]">
              {post.excerpt}
            </p>
          )}

          {/* Read more */}
          <div className="mt-5 inline-flex items-center gap-2 border-b border-[#b9b4ad] pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#171717] transition-all duration-300 group-hover:gap-3 group-hover:border-[#866b42] group-hover:text-[#866b42]">
            Read story
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.4} />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Skeleton                                                            */
/* ------------------------------------------------------------------ */

function BlogCardSkeleton() {
  return (
    <div>
      <div className="aspect-[16/10] animate-pulse border border-[#d9d5cf] bg-[#e5e2dc]" />

      <div className="pt-5">
        <div className="mb-4 flex gap-3">
          <div className="h-2.5 w-24 animate-pulse bg-[#ddd9d2]" />
          <div className="h-2.5 w-16 animate-pulse bg-[#ddd9d2]" />
        </div>

        <div className="mb-2 h-7 w-full animate-pulse bg-[#e5e2dc]" />
        <div className="mb-4 h-7 w-3/4 animate-pulse bg-[#e5e2dc]" />

        <div className="mb-2 h-3 w-full animate-pulse bg-[#ddd9d2]" />
        <div className="mb-2 h-3 w-5/6 animate-pulse bg-[#ddd9d2]" />
        <div className="h-3 w-2/3 animate-pulse bg-[#ddd9d2]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty State                                                         */
/* ------------------------------------------------------------------ */

function EmptyState({ search }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-dashed border-[#d9d5cf] bg-white px-6 py-20 text-center sm:px-10"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#d9d5cf] bg-[#f6f5f2]">
        <BookOpen className="h-7 w-7 text-[#866b42]" strokeWidth={1.2} />
      </div>

      <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.25em] text-[#866b42]">
        The Journal
      </p>

      <h3 className="mt-3 font-serif text-3xl tracking-[-0.02em] text-[#171717]">
        No stories found
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#66615b]">
        {search
          ? `We couldn't find any stories matching "${search}". Try another search term.`
          : "Our journal is being prepared. Please check back soon."}
      </p>
    </motion.div>
  );
}

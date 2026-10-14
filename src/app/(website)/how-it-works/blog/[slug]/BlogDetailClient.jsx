// src/app/(website)/blog/[slug]/BlogDetailClient.jsx
"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Share2,
  BookOpen,
  HeartHandshake,
} from "lucide-react";

import { posts } from "@/lib/posts";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatDate(dateStr) {
  if (!dateStr) return "";

  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadTime(content, fallback) {
  if (fallback) return fallback;
  if (!content) return "1 min read";

  const words = content
    .replace(/<[^>]+>/g, "")
    .split(/\s+/)
    .filter(Boolean).length;

  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export function BlogDetailClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const post = useMemo(
    () => posts.find((p) => p.slug === slug) || null,
    [slug],
  );

  const related = useMemo(
    () => posts.filter((p) => p.slug !== slug).slice(0, 3),
    [slug],
  );

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          url,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard");
      } catch {
        /* clipboard unavailable */
      }
    }
  };

  /* ---------------------------------------------------------------- */
  /* Not found                                                         */
  /* ---------------------------------------------------------------- */
  if (!post) {
    return (
      <main className="min-h-screen overflow-hidden bg-white text-[#24304f]">
        <section className="relative isolate flex min-h-[400px] items-center justify-center overflow-hidden sm:min-h-[500px] lg:min-h-[600px]">
          <Image
            src="/images/blog-header.png"
            alt="Care professional supporting an older adult"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-white/80" />

          <div className="relative z-10 mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h1 className="text-4xl font-normal tracking-tight text-[#0f1681] sm:text-5xl md:text-6xl">
                Article Not Found
              </h1>

              <div className="mt-6 flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-[#0f1681] sm:text-sm">
                <Link href="/" className="transition-colors hover:text-[#4754ff]">
                  HOME
                </Link>

                <span className="text-[#4754ff]">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                  >
                    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
                  </svg>
                </span>

                <span className="text-[#0f1681]">ARTICLES</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-white via-white to-[#eff9f7] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="mx-auto flex min-h-[320px] max-w-3xl items-center justify-center">
            <div className="w-full text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#e8ebff] bg-[#f4f6ff]">
                <BookOpen className="h-8 w-8 text-[#4754ff]" />
              </div>

              <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#e8ebff] bg-[#f4f6ff] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#4754ff]">
                  Journal
              </span>

              <h2 className="mt-6 text-3xl text-[#0f1681] sm:text-4xl">
                Article not found.
              </h2>

              <p className="mx-auto mt-6 max-w-md text-base leading-8 text-gray-600">
                The article you are looking for may have been moved or is no
                longer available.
              </p>

              <button
                type="button"
                onClick={() => router.push("/blog")}
                className="group mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0f1681] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#4754ff]"
              >
                <ArrowLeft
                  size={17}
                  className="transition group-hover:-translate-x-1"
                />
                Back to Articles
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const readTime = estimateReadTime(post.content, post.read_time);

  /* ---------------------------------------------------------------- */
  /* Article                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#24304f]">
      {/* ============================================================= */}
      {/* HERO HEADER                                                   */}
      {/* ============================================================= */}
      <section className="relative isolate flex min-h-[400px] items-center justify-center overflow-hidden sm:min-h-[500px] lg:min-h-[600px]">
        <Image
          src="/images/blog-header.png"
          alt="Care professional supporting an older adult"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-white/80" />

        <div className="relative z-10 mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-normal tracking-tight text-[#0f1681] sm:text-5xl md:text-6xl">
              Article Details
            </h1>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-[#0f1681] sm:text-sm">
              <Link href="/" className="transition-colors hover:text-[#4754ff]">
                HOME
              </Link>

              <span className="text-[#4754ff]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                >
                  <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
                </svg>
              </span>

              <Link
                href="/blog"
                className="transition-colors hover:text-[#4754ff]"
              >
                ARTICLES
              </Link>

              <span className="text-[#4754ff]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                >
                  <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
                </svg>
              </span>

              <span className="max-w-[180px] truncate text-[#0f1681] sm:max-w-[260px]">
                {post.title}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* TITLE BLOCK + COVER IMAGE                                     */}
      {/* ============================================================= */}
      <section className="bg-gradient-to-br from-white via-white to-[#eff9f7] px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e8ebff] bg-[#f4f6ff] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#4754ff]">
                <BookOpen size={15} />
                {post.category || "  Journal"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="mt-6 text-4xl font-normal leading-tight tracking-tight text-[#0f1681] sm:text-5xl lg:text-6xl"
            >
              {post.title}
            </motion.h1>

            {post.excerpt && (
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg"
              >
                {post.excerpt}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-gray-500"
            >
              {post.published_at && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} className="text-[#4754ff]" />
                  {formatDate(post.published_at)}
                </span>
              )}

              {post.author_name && (
                <span className="inline-flex items-center gap-1.5">
                  <HeartHandshake size={14} className="text-[#4754ff]" />
                  {post.author_name}
                </span>
              )}

              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} className="text-[#4754ff]" />
                {readTime}
              </span>
            </motion.div>
          </div>

          {post.cover_image && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative mx-auto mt-12 aspect-[16/8.5] max-w-5xl overflow-hidden rounded-[2rem] border border-[#e8ebff] bg-[#eff9f7] shadow-xl shadow-indigo-900/5"
            >
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 1100px"
                priority
                className="object-cover"
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* ============================================================= */}
      {/* ARTICLE BODY                                                  */}
      {/* ============================================================= */}
      <article className="px-5 pb-16 pt-4 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[80px_minmax(0,1fr)]">
            <motion.aside
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="hidden lg:block"
            >
              <div className="sticky top-32">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                  Share
                </p>

                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share this article"
                  className="mt-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#e8ebff] bg-white text-[#4754ff] transition hover:-translate-y-0.5 hover:border-[#cbd0ff] hover:bg-[#f4f6ff]"
                >
                  <Share2 size={17} />
                </button>
              </div>
            </motion.aside>

            <div className="min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.38 }}
                className="
                  prose
                  prose-lg
                  max-w-none

                  prose-headings:font-normal
                  prose-headings:tracking-tight
                  prose-headings:text-[#0f1681]

                  prose-h2:mt-14
                  prose-h2:mb-5
                  prose-h2:text-3xl
                  prose-h2:leading-tight

                  prose-h3:mt-10
                  prose-h3:mb-4
                  prose-h3:text-2xl
                  prose-h3:leading-tight

                  prose-p:mb-7
                  prose-p:leading-8
                  prose-p:text-gray-600

                  prose-a:text-[#4754ff]
                  prose-a:font-semibold
                  prose-a:no-underline
                  hover:prose-a:underline

                  prose-strong:text-[#0f1681]

                  prose-blockquote:rounded-r-2xl
                  prose-blockquote:border-l-4
                  prose-blockquote:border-[#4754ff]
                  prose-blockquote:bg-[#f4f6ff]
                  prose-blockquote:px-6
                  prose-blockquote:py-4
                  prose-blockquote:not-italic
                  prose-blockquote:text-[#0f1681]

                  prose-ul:text-gray-600
                  prose-ol:text-gray-600
                  prose-li:marker:text-[#4754ff]

                  prose-img:rounded-2xl
                  prose-img:border
                  prose-img:border-[#e8ebff]

                  prose-hr:border-[#e8ebff]
                "
                dangerouslySetInnerHTML={{
                  __html: post.content || "",
                }}
              />

              <div className="mt-14 flex items-center justify-between rounded-2xl border border-[#e8ebff] bg-[#f8f9ff] px-5 py-5 lg:hidden">
                <p className="text-sm font-medium text-[#0f1681]">
                  Enjoyed this article?
                </p>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0f1681] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#4754ff]"
                >
                  <Share2 size={14} />
                  Share
                </button>
              </div>

              <div className="mt-16 hidden items-center justify-between rounded-2xl border border-[#e8ebff] bg-[#f8f9ff] px-6 py-6 lg:flex">
                <p className="text-sm font-medium text-[#0f1681]">
                  Enjoyed this article? Share it with someone who might find it
                  helpful.
                </p>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0f1681] px-5 py-2.5 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#4754ff]"
                >
                  <Share2 size={14} />
                  Share article
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* ============================================================= */}
      {/* RELATED ARTICLES                                              */}
      {/* ============================================================= */}
      {related.length > 0 && (
        <section className="bg-[#f4f6ff] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#e0e4f5] pb-5 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#4754ff]">
                  From the journal
                </span>

                <h2 className="mt-3 text-3xl text-[#0f1681] sm:text-4xl">
                  Continue reading
                </h2>
              </div>

              <Link
                href="/blog"
                className="group hidden items-center gap-2 text-sm font-semibold text-[#4754ff] transition hover:text-[#0f1681] sm:inline-flex"
              >
                View all articles
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <motion.div
                  key={r.slug}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.06,
                  }}
                >
                  <RelatedPost post={r} />
                </motion.div>
              ))}
            </div>

            <div className="mt-10 sm:hidden">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#4754ff]"
              >
                View all articles
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================= */}
      {/* APPROACH CTA                                                  */}
      {/* ============================================================= */}
      <section className="bg-[#f4f6ff] px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-8 rounded-[2rem] bg-[#0f1681] p-7 text-white sm:p-10 lg:grid-cols-[1fr_auto] lg:p-14">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <HeartHandshake size={25} />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl">
              Looking for More Information?
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/80">
              Learn about our approach to care or contact   to discuss
              your particular enquiry.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/how-it-works/our-approach"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0f1681] transition hover:bg-[#e8ebff]"
            >
              Our Approach <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contact Us <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-7xl text-sm leading-6 text-gray-500">
          General information does not replace advice from a qualified
          healthcare professional.
        </p>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Related Post                                                        */
/* ------------------------------------------------------------------ */

function RelatedPost({ post }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[#e8ebff] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#cbd0ff] hover:shadow-xl hover:shadow-indigo-900/5">
      <Link
        href={`/blog/${post.slug}`}
        className="block"
        aria-label={`Read ${post.title}`}
      >
        <div className="relative h-[230px] overflow-hidden bg-[#eff9f7]">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen size={40} className="text-[#cbd0ff]" />
            </div>
          )}

          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#0f1681] shadow-sm">
            {post.category || "Journal"}
          </span>
        </div>

        <div className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Clock3 size={14} className="text-[#4754ff]" />
              {post.read_time || "5 min read"}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} className="text-[#4754ff]" />
                Guide
            </span>
          </div>

          <h3 className="mt-4 line-clamp-2 text-xl leading-7 text-[#0f1681] transition group-hover:text-[#4754ff]">
            {post.title}
          </h3>

          <p className="mt-3 line-clamp-2 text-sm leading-7 text-gray-600">
            {post.excerpt}
          </p>

          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#4754ff]">
            Read article
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
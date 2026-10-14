// src/app/(website)/blog/[slug]/BlogDetailClient.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Gem,
  ArrowRight,
  Clock,
} from "lucide-react";

export function BlogDetailClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    (async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/blog/${slug}`);
        const data = await res.json();

        if (cancelled) return;

        if (!data.success) {
          setNotFound(true);
        } else {
          setPost(data.data);
          setRelated(data.related || []);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setNotFound(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadTime = (content) => {
    if (!content) return "1 min read";

    const words = content
      .replace(/<[^>]+>/g, "")
      .split(/\s+/)
      .filter(Boolean).length;

    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  };

  const handleShare = async () => {
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

  if (loading) {
    return <BlogDetailSkeleton />;
  }

  if (notFound || !post) {
    return (
      <main className="min-h-screen bg-[#f6f5f2] px-5 pb-24 pt-32">
        <div className="mx-auto flex min-h-[520px] max-w-2xl items-center justify-center">
          <div className="w-full text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center border border-[#d9d5cf] bg-white">
              <Gem className="h-8 w-8 text-[#866b42]" strokeWidth={1.1} />
            </div>

            <p className="mt-7 text-[10px] font-medium uppercase tracking-[0.28em] text-[#866b42]">
              The Shoaib Journal
            </p>

            <h1 className="mt-4 font-serif text-4xl tracking-[-0.025em] text-[#171717] sm:text-5xl">
              Story not found.
            </h1>

            <div className="mx-auto mt-7 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-[#b9b4ad]" />
              <span className="h-1.5 w-1.5 rotate-45 bg-[#866b42]" />
              <span className="h-px w-10 bg-[#b9b4ad]" />
            </div>

            <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[#66615b]">
              The journal entry you are looking for may have been moved or is no
              longer available.
            </p>

            <button
              type="button"
              onClick={() => router.push("/blog")}
              className="group mt-8 inline-flex items-center gap-3 bg-[#181716] px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.17em] text-white transition-colors duration-300 hover:bg-[#302d29]"
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                strokeWidth={1.4}
              />
              Back to Journal
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f5f2]">
      {/* ============================================================= */}
      {/* ARTICLE HEADER                                                */}
      {/* ============================================================= */}
      <section className="border-b border-[#d9d5cf] bg-[#f6f5f2]">
        <div className="mx-auto max-w-[1200px] px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-36 lg:px-12">
          {/* Back */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#66615b] transition-colors hover:text-[#866b42]"
            >
              <ArrowLeft
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
                strokeWidth={1.4}
              />
              Back to Journal
            </Link>
          </motion.div>

          <div className="mx-auto mt-14 max-w-4xl text-center">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="flex items-center justify-center gap-3"
            >
              <span className="h-px w-8 bg-[#866b42]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#866b42]">
                The Shoaib Journal
              </span>

              <span className="h-px w-8 bg-[#866b42]" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="mt-7 font-serif text-4xl leading-[1.02] tracking-[-0.035em] text-[#171717] sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {post.title}
            </motion.h1>

            {/* Excerpt */}
            {post.excerpt && (
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-[#66615b] sm:text-base"
              >
                {post.excerpt}
              </motion.p>
            )}

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-[#d9d5cf] pt-6 text-[10px] uppercase tracking-[0.14em] text-[#8b857d]"
            >
              {post.published_at && (
                <span className="inline-flex items-center gap-2">
                  <Calendar
                    className="h-3.5 w-3.5 text-[#866b42]"
                    strokeWidth={1.3}
                  />
                  {formatDate(post.published_at)}
                </span>
              )}

              {post.author_name && (
                <span className="inline-flex items-center gap-2">
                  <User
                    className="h-3.5 w-3.5 text-[#866b42]"
                    strokeWidth={1.3}
                  />
                  {post.author_name}
                </span>
              )}

              <span className="inline-flex items-center gap-2">
                <Clock
                  className="h-3.5 w-3.5 text-[#866b42]"
                  strokeWidth={1.3}
                />
                {estimateReadTime(post.content)}
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* ARTICLE                                                       */}
      {/* ============================================================= */}
      <article className="mx-auto max-w-[1200px] px-5 pb-24 pt-10 sm:px-8 lg:px-12 lg:pb-32">
        {/* Cover */}
        {post.cover_image && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto aspect-[16/8.5] max-w-[1100px] overflow-hidden border border-[#d9d5cf] bg-[#ebe9e5]"
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

        {/* Article body */}
        <div className="mx-auto mt-14 grid max-w-[1050px] gap-12 lg:grid-cols-[150px_minmax(0,760px)_1fr]">
          {/* Share rail */}
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="hidden lg:block"
          >
            <div className="sticky top-32">
              <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#8b857d]">
                Share
              </p>

              <button
                type="button"
                onClick={handleShare}
                aria-label="Share this story"
                className="mt-4 flex h-10 w-10 items-center justify-center border border-[#d9d5cf] bg-white text-[#66615b] transition-colors hover:border-[#866b42] hover:text-[#866b42]"
              >
                <Share2 className="h-4 w-4" strokeWidth={1.3} />
              </button>
            </div>
          </motion.aside>

          {/* Main content */}
          <div className="min-w-0">
            {post.excerpt && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-10 border-l-2 border-[#866b42] pl-6"
              >
                <p className="font-serif text-xl leading-8 text-[#403c37] sm:text-2xl">
                  {post.excerpt}
                </p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.38 }}
              className="
                prose
                prose-lg
                max-w-none

                prose-headings:font-serif
                prose-headings:font-normal
                prose-headings:tracking-[-0.025em]
                prose-headings:text-[#171717]

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
                prose-p:text-[#55504a]

                prose-a:text-[#866b42]
                prose-a:no-underline
                hover:prose-a:underline

                prose-strong:text-[#171717]

                prose-blockquote:border-l-[#866b42]
                prose-blockquote:bg-white
                prose-blockquote:px-6
                prose-blockquote:py-4
                prose-blockquote:font-serif
                prose-blockquote:not-italic
                prose-blockquote:text-[#403c37]

                prose-ul:text-[#55504a]
                prose-ol:text-[#55504a]
                prose-li:marker:text-[#866b42]

                prose-img:border
                prose-img:border-[#d9d5cf]

                prose-hr:border-[#d9d5cf]
              "
              dangerouslySetInnerHTML={{
                __html: post.content || "",
              }}
            />

            {/* Mobile share */}
            <div className="mt-14 flex items-center justify-between border-t border-[#d9d5cf] pt-7 lg:hidden">
              <p className="font-serif text-sm italic text-[#66615b]">
                Enjoyed this story?
              </p>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 border border-[#d9d5cf] bg-white px-5 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[#55504a] transition-colors hover:border-[#866b42] hover:text-[#866b42]"
              >
                <Share2 className="h-3.5 w-3.5" strokeWidth={1.3} />
                Share
              </button>
            </div>

            {/* Desktop article footer */}
            <div className="mt-16 hidden items-center justify-between border-t border-[#d9d5cf] pt-7 lg:flex">
              <p className="font-serif text-sm italic text-[#66615b]">
                Enjoyed this story? Share it with someone who loves fine
                jewellery.
              </p>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 border border-[#d9d5cf] bg-white px-5 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[#55504a] transition-colors hover:border-[#866b42] hover:text-[#866b42]"
              >
                <Share2 className="h-3.5 w-3.5" strokeWidth={1.3} />
                Share story
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* ============================================================= */}
      {/* RELATED STORIES                                               */}
      {/* ============================================================= */}
      {related.length > 0 && (
        <section className="border-t border-[#d9d5cf] bg-white">
          <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="mb-12 flex items-end justify-between border-b border-[#d9d5cf] pb-5">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#866b42]">
                  From the journal
                </p>

                <h2 className="mt-2 font-serif text-3xl tracking-[-0.025em] text-[#171717] sm:text-4xl">
                  Continue reading
                </h2>
              </div>

              <Link
                href="/blog"
                className="group hidden items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#66615b] transition-colors hover:text-[#866b42] sm:inline-flex"
              >
                View all stories
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.3}
                />
              </Link>
            </div>

            <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
              {related.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                  }}
                >
                  <RelatedPost post={r} formatDate={formatDate} />
                </motion.div>
              ))}
            </div>

            <div className="mt-10 sm:hidden">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#66615b] transition-colors hover:text-[#866b42]"
              >
                View all stories
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.3}
                />
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Related Post                                                        */
/* ------------------------------------------------------------------ */

function RelatedPost({ post, formatDate }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden border border-[#d9d5cf] bg-[#ebe9e5]">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Gem className="h-12 w-12 text-[#b5aea4]" strokeWidth={1} />
          </div>
        )}

        <div className="absolute left-4 top-4 bg-[#f6f5f2]/95 px-3 py-2">
          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#866b42]">
            Journal
          </span>
        </div>
      </div>

      <div className="pt-5">
        <p className="text-[10px] uppercase tracking-[0.13em] text-[#8b857d]">
          {formatDate(post.published_at)}
        </p>

        <h3 className="mt-3 line-clamp-2 font-serif text-2xl leading-[1.1] tracking-[-0.02em] text-[#171717] transition-colors duration-300 group-hover:text-[#866b42]">
          {post.title}
        </h3>

        <span className="mt-5 inline-flex items-center gap-2 border-b border-[#b9b4ad] pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#171717] transition-all duration-300 group-hover:gap-3 group-hover:border-[#866b42] group-hover:text-[#866b42]">
          Read story
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.3} />
        </span>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Skeleton                                                            */
/* ------------------------------------------------------------------ */

function BlogDetailSkeleton() {
  return (
    <main className="min-h-screen bg-[#f6f5f2]">
      <section className="border-b border-[#d9d5cf] bg-[#f6f5f2]">
        <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-32 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto h-3 w-36 animate-pulse bg-[#ddd9d2]" />

            <div className="mx-auto mt-8 h-12 w-full animate-pulse bg-[#e5e2dc]" />
            <div className="mx-auto mt-3 h-12 w-4/5 animate-pulse bg-[#e5e2dc]" />

            <div className="mx-auto mt-8 h-3 w-64 animate-pulse bg-[#ddd9d2]" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-10 sm:px-8 lg:px-12">
        <div className="mx-auto aspect-[16/8.5] max-w-[1100px] animate-pulse border border-[#d9d5cf] bg-[#e5e2dc]" />

        <div className="mx-auto mt-14 max-w-[760px]">
          <div className="mb-10 border-l-2 border-[#ddd9d2] pl-6">
            <div className="h-6 w-full animate-pulse bg-[#e5e2dc]" />
            <div className="mt-3 h-6 w-4/5 animate-pulse bg-[#e5e2dc]" />
          </div>

          <div className="space-y-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-4 animate-pulse bg-[#e5e2dc]",
                  i % 4 === 3 ? "w-4/5" : "w-full",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

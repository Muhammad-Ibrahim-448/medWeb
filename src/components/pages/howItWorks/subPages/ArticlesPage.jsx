// src/components/pages/howItWorks/subPages/ArticlesPage.jsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  BookOpen,
  HeartHandshake,
  Clock3,
  CalendarDays,
} from "lucide-react";

import { posts, categories } from "@/lib/posts";

/* ------------------------------------------------------------------ */
/* Article Card                                                        */
/* ------------------------------------------------------------------ */

function ArticleCard({ article, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group overflow-hidden rounded-3xl border border-[#e8ebff] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#cbd0ff] hover:shadow-xl hover:shadow-indigo-900/5"
    >
      <Link
        href={`/how-it-works/blog/${article.slug}`}
        className="block"
        aria-label={`Read ${article.title}`}
      >
        <div className="relative h-[230px] overflow-hidden bg-[#eff9f7]">
          <Image
            src={article.cover_image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#0f1681] shadow-sm">
            {article.category}
          </span>
        </div>

        <div className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Clock3 size={14} className="text-[#4754ff]" />
              {article.read_time}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} className="text-[#4754ff]" />
                Guide
            </span>
          </div>

          <h2 className="mt-4 text-xl leading-7 text-[#0f1681] transition group-hover:text-[#4754ff]">
            {article.title}
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-600">
            {article.excerpt}
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
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Main Page                                                           */
/* ------------------------------------------------------------------ */

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [search, setSearch] = useState("");

  const filteredArticles = useMemo(() => {
    const term = search.trim().toLowerCase();

    return posts.filter((article) => {
      const categoryMatch =
        activeCategory === "All Articles" ||
        article.category === activeCategory;

      const searchMatch =
        !term ||
        article.title.toLowerCase().includes(term) ||
        article.excerpt.toLowerCase().includes(term) ||
        article.category.toLowerCase().includes(term);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  const featured = posts.find((article) => article.featured);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#24304f]">
      {/* ===================================================== */}
      {/* HERO HEADER                                            */}
      {/* ===================================================== */}
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
              Latest Articles
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

      {/* ===================================================== */}
      {/* HERO CONTENT                                          */}
      {/* ===================================================== */}
      <section className="bg-gradient-to-br from-white via-white to-[#eff9f7] px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >


              <h2 className="mt-6 text-4xl leading-tight tracking-tight text-[#0f1681] sm:text-5xl lg:text-6xl">
                Helpful Insights for{" "}
                <span className="text-[#4754ff]">Better-Informed Care.</span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
                Explore practical guides for families navigating home
                healthcare, supporting older loved ones, and preparing for
                care at home.
              </p>

              <a
                href="#all-articles"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0f1681] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#4754ff]"
              >
                Explore Articles <ArrowRight size={17} />
              </a>
            </motion.div>

            {featured && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="relative"
              >
                <div
                  className="group block overflow-hidden rounded-[2rem] border border-[#e8ebff] bg-white shadow-xl shadow-indigo-900/5"
                >
                  <div className="relative h-[280px] overflow-hidden bg-[#eff9f7] sm:h-[350px]">
                    <Image
                      src={featured.cover_image}
                      alt=""
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs text-[#0f1681]">
                      Featured Guide
                    </span>
                  </div>

                  <div className="p-6 sm:p-8">
                    <span className="text-xs uppercase tracking-[0.15em] text-[#4754ff]">
                      {featured.category}
                    </span>
                    <h2 className="mt-3 text-2xl leading-tight text-[#0f1681] sm:text-3xl">
                      {featured.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-gray-600">
                      {featured.excerpt}
                    </p>
    
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* ARTICLES                                              */}
      {/* ===================================================== */}
      <section
        id="all-articles"
        className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#4754ff]">
                Explore the journal
              </span>
              <h2 className="mt-3 text-3xl text-[#0f1681] sm:text-4xl">
                Latest Articles
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                Straightforward information to help you ask questions and
                understand your options.
              </p>
            </div>

            <label className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-[#e8ebff] bg-white px-4 focus-within:border-[#4754ff] lg:max-w-sm">
              <Search size={19} className="shrink-0 text-[#4754ff]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search articles..."
                aria-label="Search articles"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </label>
          </div>

          {/* CATEGORY FILTERS */}
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  activeCategory === category
                    ? "bg-[#0f1681] text-white"
                    : "bg-[#f4f6ff] text-gray-600 hover:bg-[#e8ebff] hover:text-[#0f1681]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article, index) => (
              <ArticleCard
                key={article.slug}
                article={article}
                index={index}
              />
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-[#cbd0ff] bg-[#f8f9ff] px-5 py-12 text-center">
              <Search className="mx-auto text-[#4754ff]" size={28} />
              <h3 className="mt-4 text-[#0f1681]">No articles found</h3>
              <p className="mt-2 text-sm text-gray-600">
                Try another search term or category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All Articles");
                }}
                className="mt-4 text-sm font-semibold text-[#4754ff]"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===================================================== */}
      {/* APPROACH CTA                                          */}
      {/* ===================================================== */}
      <section className="bg-[#f4f6ff] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
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
          These sample article listings are starting content for your website.
          Review them before publishing. General information does not replace
          advice from a qualified healthcare professional.
        </p>
      </section>
    </main>
  );
}
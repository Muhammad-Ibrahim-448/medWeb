"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { posts, categories } from "@/lib/posts";

export default function BlogSection() {
  // Show only the first 3 posts on the homepage section
  const featuredArticles = posts.slice(0, 3);

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center sm:mb-16"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#4754ff] sm:text-sm">
            Patient &amp; Family Resources
          </p>
          <h2 className="text-3xl font-light leading-tight tracking-tight text-[#0f1681] sm:text-4xl lg:text-5xl">
            Helpful Information for Your Care Decisions
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-gray-500 sm:text-base">
            Explore practical information to help you understand home
            healthcare options and prepare useful questions.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {featuredArticles.map((article, index) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col border border-gray-200 bg-white transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(15,22,129,0.1)]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={article.cover_image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#4754ff]">
                  {article.category}
                </p>

                <h3 className="mb-3 text-xl font-medium leading-snug text-[#0f1681] sm:text-2xl">
                  {article.title}
                </h3>

                <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-500 sm:text-base">
                  {article.excerpt}
                </p>

                <Link
                  href={`/how-it-works/blog/${article.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f1681] transition-colors hover:text-[#4754ff]"
                >
                  Read More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex justify-center sm:mt-16"
        >
          <Link
            href="/how-it-works/blog"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0f1681] px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#4754ff]"
          >
            View All Articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
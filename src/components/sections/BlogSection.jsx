
"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const articles = [
  {
    title: "What Is Home Healthcare?",
    excerpt:
      "Learn what home healthcare may involve, which services can be provided at home, and why the right setting depends on individual needs.",
    image: "/images/article-respite-care.jpg",
    alt: "Caregiver talking with an older adult",
    href: "/resources/what-is-home-healthcare/",
  },
  {
    title: "How to Choose Home Healthcare",
    excerpt:
      "Understand which questions to ask about service scope, professional responsibilities, availability, fees, and privacy before making an arrangement.",
    image: "/images/article-blood-pressure.jpg",
    alt: "Caregiver supporting an older adult",
    href: "/resources/choosing-home-healthcare/",
  },
  {
    title: "Arranging Support After a Hospital Stay",
    excerpt:
      "Explore practical considerations for arranging support at home after discharge and why the treating team's instructions should guide the next steps.",
    image: "/images/article-pet-therapy.jpg",
    alt: "Healthcare professional speaking with a family",
    href: "/resources/post-hospital-support/",
  },
];

export default function BlogSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
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

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {articles.map((article, index) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col border border-gray-200 bg-white transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(15,22,129,0.1)]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="mb-3 text-xl font-medium leading-snug text-[#0f1681] sm:text-2xl">
                  {article.title}
                </h3>

                <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-500 sm:text-base">
                  {article.excerpt}
                </p>

                <a
                  href={article.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f1681] transition-colors hover:text-[#4754ff]"
                >
                  Read More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

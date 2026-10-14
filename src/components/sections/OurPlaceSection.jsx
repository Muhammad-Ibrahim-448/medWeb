
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";

export function OurPlaceSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = "cF-W_wTZ1iw";

  return (
    <section className="relative overflow-hidden bg-[#f4f6ff] py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute bottom-0 right-0 z-0 h-[200px] w-[200px] lg:h-[320px] lg:w-[320px]">
        <svg viewBox="0 0 300 300" fill="none" className="h-full w-full">
          <path d="M300 0C300 165.685 165.685 300 0 300" stroke="#0f1681" strokeWidth="1.5" />
          <path d="M300 60C300 192.548 192.548 300 60 300" stroke="#0f1681" strokeWidth="1.5" />
          <path d="M300 120C300 219.411 219.411 300 120 300" stroke="#0f1681" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-[#4754ff]">
            How It Works
          </p>
          <h2 className="mx-auto max-w-3xl text-4xl leading-tight tracking-tight text-[#0f1681] sm:text-5xl lg:text-[56px]">
            Understand Your Options for Healthcare at Home
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Tell us what support you are looking for and where it is needed.
            We will explain whether a suitable service may be available and
            what the next step would involve.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-[1000px]"
        >
          <div className="group relative aspect-[16/9] w-full overflow-hidden">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="Understanding home healthcare"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 h-full w-full cursor-pointer"
                aria-label="Play home healthcare video"
              >
                <Image
                  src="/images/our-place-seniors.png"
                  alt="Older adults spending time together"
                  fill
                  sizes="(max-width: 1024px) 100vw, 1000px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-[#0f1681]/50 transition-colors duration-500 group-hover:bg-[#0f1681]/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110">
                    <Play className="ml-1 h-7 w-7 text-[#0f1681]" fill="#0f1681" />
                  </div>
                </div>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

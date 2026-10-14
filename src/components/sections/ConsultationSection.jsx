
"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ConsultationSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto w-full max-w-5xl overflow-hidden bg-[#0f1681] px-6 py-16 text-center sm:px-10 sm:py-20 lg:px-16 lg:py-24"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-[280px] w-[280px] opacity-30 sm:h-[350px] sm:w-[350px] lg:h-[420px] lg:w-[420px]">
            <svg viewBox="0 0 400 400" fill="none" className="h-full w-full">
              <path d="M400 0C400 220.914 220.914 400 0 400" stroke="#4754ff" strokeWidth="1.5" />
              <path d="M400 60C400 247.81 247.81 400 60 400" stroke="#4754ff" strokeWidth="1.5" />
              <path d="M400 120C400 274.706 274.706 400 120 400" stroke="#4754ff" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="pointer-events-none absolute -bottom-20 -left-20 h-[280px] w-[280px] opacity-30 sm:h-[350px] sm:w-[350px] lg:h-[420px] lg:w-[420px]">
            <svg viewBox="0 0 400 400" fill="none" className="h-full w-full">
              <path d="M0 400C0 179.086 179.086 0 400 0" stroke="#4754ff" strokeWidth="1.5" />
              <path d="M0 340C0 152.19 152.19 0 340 0" stroke="#4754ff" strokeWidth="1.5" />
              <path d="M0 280C0 125.294 125.294 0 280 0" stroke="#4754ff" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="relative z-10 mx-auto max-w-2xl">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white sm:text-sm">
              Need Help?
            </p>

            <h2 className="mb-6 text-2xl font-light leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[42px] lg:leading-[1.15]">
              Need Help Understanding the Available Options?
            </h2>

            <p className="mx-auto mb-8 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
              Tell us what support you are looking for and where it is needed.
              We can explain the next steps and confirm whether a suitable
              service may be available.
            </p>

            <a
              href="#contact"
              className="inline-flex items-center justify-center bg-[#4754ff] px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[#0f1681] sm:px-10 sm:py-4"
            >
              Make an Enquiry
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

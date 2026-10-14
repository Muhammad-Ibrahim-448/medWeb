
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

const principles = [
  {
    quote:
      "We aim to explain what a service includes, which professional role is involved, and any important limitations before asking a patient or family to proceed.",
    name: "Clear Service Information",
    role: "Understand what is being offered",
    image: "/images/testimonial-1.jpg",
  },
  {
    quote:
      "People should be spoken to directly and respectfully. Their preferences, consent, and privacy should be taken seriously throughout the enquiry process.",
    name: "Respect for the Individual",
    role: "Respectful communication",
    image: "/images/testimonial-2.jpg",
  },
  {
    quote:
      "Service charges may depend on the type of support, location, duration, and agreed requirements. Applicable fees should be explained before a booking is confirmed.",
    name: "Clear Expectations About Fees",
    role: "Understand charges before confirming",
    image: "/images/testimonial-3.jpg",
  },
];

const commitments = [
  "Clear service scope",
  "Respect for privacy",
  "Fees explained in advance",
  "Availability confirmed",
];

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const current = principles[index];

  const paginate = (dir) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + principles.length) % principles.length);
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <section className="w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center sm:mb-20"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#4754ff] sm:text-sm">
            Our Approach
          </p>
          <h2 className="text-3xl font-light leading-tight tracking-tight text-[#0f1681] sm:text-4xl lg:text-5xl">
            Know What to Expect Before You Decide
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-gray-500 sm:text-base">
            Arranging healthcare at home involves important decisions.
            Clear information can help patients and families understand
            their options and ask useful questions.
          </p>
        </motion.div>

        <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: "easeInOut" }}
              >
                <div className="mb-6">
                  <svg
                    width="44"
                    height="34"
                    viewBox="0 0 44 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 34V22C0 9.85 8.4 1.7 18 0L19 3.6C12.6 5.3 8.6 10.6 8 17H18V34H0ZM26 34V22C26 9.85 34.4 1.7 44 0L45 3.6C38.6 5.3 34.6 10.6 34 17H44V34H26Z"
                      fill="#4754ff"
                    />
                  </svg>
                </div>

                <p className="mb-8 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
                  {current.quote}
                </p>

                <div className="mb-6 h-px w-16 bg-gray-300" />

                <div>
                  <h4 className="text-base font-medium text-[#0f1681] sm:text-lg">
                    {current.name}
                  </h4>
                  <p className="mt-1 text-sm text-[#4754ff]">
                    {current.role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="relative h-[340px] w-full max-w-[420px] sm:h-[420px] lg:h-[480px] lg:max-w-[520px]">
              <motion.div
                initial={{ opacity: 0, x: 20, y: -20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="absolute -right-4 -top-4 h-full w-full bg-[#f4f5f7] lg:-right-6 lg:-top-6"
              />

              <div className="relative h-full w-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={current.image}
                      alt="Illustrative image of home healthcare support"
                      fill
                      sizes="(max-width: 1024px) 90vw, 520px"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4 lg:mt-6 lg:justify-end">
          <button
            type="button"
            onClick={() => paginate(-1)}
            aria-label="Previous principle"
            className="flex h-10 w-10 items-center justify-center text-[#0f1681] transition-all hover:-translate-x-0.5 hover:text-[#4754ff]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            aria-label="Next principle"
            className="flex h-10 w-10 items-center justify-center text-[#0f1681] transition-all hover:translate-x-0.5 hover:text-[#4754ff]"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 grid grid-cols-1 gap-y-8 border-t border-gray-200 pt-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 sm:pt-12 lg:mt-24 lg:grid-cols-4 lg:gap-0"
        >
          {commitments.map((item, i) => (
            <div
              key={item}
              className={`flex items-center justify-center px-4 text-center ${
                i !== commitments.length - 1
                  ? "lg:border-r lg:border-gray-200"
                  : ""
              }`}
            >
              <p className="max-w-[200px] text-base font-medium text-[#0f1681] sm:text-lg">
                {item}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

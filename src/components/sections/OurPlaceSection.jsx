"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const steps = [
  {
    badge: "TOP RATED",
    title: "Choose your country & specialty",
    description:
      "Filter by your location and select the right doctor for your needs.",
    image: "/images/doctor-1.jpg",
  },
  {
    badge: "EXPERT",
    title: "Book or request urgent care",
    description:
      "Schedule ahead or request instant care for urgent issues.",
    image: "/images/doctor-2.jpg",
  },
  {
    badge: "10+ YEARS",
    title: "See a doctor from anywhere",
    description:
      "Connect securely via video or voice. Prescriptions & notes sent digitally.",
    image: "/images/doctor-3.jpg",
  },
  {
    badge: "RECOMMENDED",
    title: "Members get more",
    description:
      "UhuruCare members enjoy free annual physicals and discounted follow-ups.",
    image: "/images/doctor-4.jpg",
  },
];

export function OurPlaceSection() {
  return (
    <section className="relative overflow-hidden bg-[#f4f6ff] py-20 sm:py-24 lg:py-28">
      {/* Background Decorative SVG */}
      <div className="pointer-events-none absolute bottom-0 right-0 z-0 h-[200px] w-[200px] lg:h-[320px] lg:w-[320px]">
        <svg viewBox="0 0 300 300" fill="none" className="h-full w-full">
          <path
            d="M300 0C300 165.685 165.685 300 0 300"
            stroke="#0f1681"
            strokeWidth="1.5"
          />
          <path
            d="M300 60C300 192.548 192.548 300 60 300"
            stroke="#0f1681"
            strokeWidth="1.5"
          />
          <path
            d="M300 120C300 219.411 219.411 300 120 300"
            stroke="#0f1681"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-[#4754ff]">
            24/7 Care - See a Doctor Anywhere In Pakistan
          </p>
          <h2 className="text-4xl leading-tight tracking-tight text-[#0f1681] sm:text-5xl lg:text-[56px]">
            Quality Care, Right When You Need It
          </h2>
        </motion.div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex flex-col items-center rounded-3xl bg-white px-6 pb-8 pt-10 text-center shadow-lg shadow-indigo-900/5 transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Plus Badge Icon */}
              <div className="absolute -top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#52b1fa] text-white shadow-md">
                <Plus className="h-5 w-5 stroke-[2.5]" />
              </div>

              {/* Top Right Badge */}
              <div className="absolute right-4 top-4 rounded-full bg-[#52b1fa] px-3 py-1 text-[10px] font-bold tracking-wider text-white">
                {step.badge}
              </div>

              {/* Title */}
              <h3 className="mt-4 flex min-h-[56px] items-center justify-center text-xl font-bold tracking-tight text-[#0f1681]">
                {step.title}
              </h3>

              {/* Doctor Avatar Image */}
              <div className="relative my-6 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-md">
                <img
                  src={step.image}
                  alt={step.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
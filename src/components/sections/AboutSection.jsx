
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const principles = [
  {
    title: "Our Mission",
    description:
      "To make appropriate home healthcare easier for patients and families to understand and arrange.",
  },
  {
    title: "Our Vision",
    description:
      "A healthcare experience in which people can make informed decisions about suitable care, with clear information and respect at every step.",
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
      className="bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* IMAGE COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative z-10 mx-auto aspect-[4/5] w-full max-w-[520px] lg:mx-0">
              <Image
                src="/images/nurse-caring-about-senior.png"
                alt="Home healthcare support for an older adult"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Floating information card */}
            <div className="absolute -bottom-6 right-0 z-20 flex items-center gap-4 bg-white p-5 shadow-[0_20px_50px_rgba(15,22,129,0.15)] lg:right-8">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-mint-100">
                <Check
                  className="h-7 w-7 text-[#0f1681]"
                  strokeWidth={2}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium text-[#0f1681]">
                  Clear Information
                </h3>
                <p className="text-sm font-medium text-gray-500">
                  Respect at Every Step
                </p>
              </div>
            </div>

            {/* Original decorative block */}
            <div className="absolute -left-6 -top-6 z-0 hidden h-full w-full max-w-[520px] bg-[#f4f6ff] lg:block" />
          </motion.div>

          {/* CONTENT COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-xl"
          >
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#4754ff]">
              About Us
            </p>

            <h2 className="mb-6 text-4xl font-medium leading-[1.15] tracking-tight text-[#0f1681] sm:text-5xl lg:text-[52px]">
              Making Home Healthcare Easier to Understand.
            </h2>

            <p className="mb-6 text-base leading-relaxed text-gray-500">
              [Brand Name] is being developed for people and families
              exploring healthcare support at home in Pakistan. We believe
              the first step should be clear information: what a service
              involves, who it may be suitable for, what it costs, and how
              to find out whether it is available in your area.
            </p>

            <p className="mb-10 text-base leading-relaxed text-gray-500">
              Arranging care for yourself or someone you love can involve
              decisions about travel, time, family responsibilities, and
              the type of professional support required. We want to make
              the enquiry process more straightforward by explaining the
              services we can provide and setting out the details before
              an arrangement is confirmed.
            </p>

            {/* Mission and vision */}
            <div className="space-y-8">
              {principles.map((item) => (
                <div key={item.title} className="flex gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#4754ff]">
                    <Check
                      className="h-5 w-5 text-white"
                      strokeWidth={3}
                    />
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-medium text-[#0f1681]">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="mt-10 inline-flex min-h-12 items-center justify-center bg-[#0f1681] px-7 py-4 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#4754ff]"
            >
              Talk to Our Team
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

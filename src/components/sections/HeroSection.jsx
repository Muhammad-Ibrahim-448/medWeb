
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock,
  UserRound,
  DollarSign,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    title: "Clear Information",
    description:
      "Understand the service, arrangements, and next steps before deciding.",
    Icon: Clock,
  },
  {
    title: "Respectful Communication",
    description:
      "Your questions, preferences, and concerns deserve to be heard.",
    Icon: UserRound,
  },
  {
    title: "Fees Explained",
    description:
      "Understand applicable charges before confirming a service.",
    Icon: DollarSign,
  },
  {
    title: "Privacy Matters",
    description:
      "Share only the information needed for your enquiry.",
    Icon: ShieldCheck,
  },
];

export default function HeroSection() {
  return (
    <main className="w-full overflow-hidden font-sans">
      {/* ================= HERO SECTION ================= */}
      <section className="relative isolate overflow-hidden bg-white">
        {/* Original background colors preserved */}
        <div className="absolute inset-y-0 right-0 -z-10 w-full bg-[#eff9f7] sm:w-[55%] lg:w-[40%]" />

        {/* Decorative curves */}
        <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-36 w-36 sm:h-52 sm:w-52 lg:h-72 lg:w-72">
          <svg
            viewBox="0 0 300 300"
            fill="none"
            className="h-full w-full"
            aria-hidden="true"
          >
            <path
              d="M300 0C300 165.685 165.685 300 0 300"
              stroke="#0f1681"
              strokeWidth="2"
            />
            <path
              d="M300 60C300 192.548 192.548 300 60 300"
              stroke="#0f1681"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 items-center gap-8 pt-24 sm:gap-10 sm:pt-28 md:pt-32 lg:min-h-[680px] lg:grid-cols-2 lg:gap-8 lg:pt-16 xl:min-h-[740px] xl:gap-12">
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-10 mx-auto w-full max-w-2xl pb-2 lg:mx-0 lg:py-12"
            >
              {/* Eyebrow */}
              <div className="mb-4 flex items-center gap-2">
                <span
                  className="text-xl leading-none text-[#0f1681] sm:text-2xl"
                  aria-hidden="true"
                >
                  ✳
                </span>

                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#0f1681] sm:text-sm sm:tracking-[0.15em]">
                  Home Healthcare
                </p>
              </div>

              {/* Heading from the document */}
              <h1 className="mb-5 text-[clamp(2.25rem,6vw,4.25rem)] font-light leading-[1.08] tracking-tight text-black lg:text-[clamp(3.25rem,4.5vw,4.75rem)] xl:text-[68px]">
                Healthcare Support at Home, With the Details Made Clear.
              </h1>

              {/* Exact homepage supporting message */}
              <p className="mb-7 max-w-lg text-sm leading-7 text-gray-500 sm:text-base sm:leading-8">
                Finding the right care for yourself or a family member can
                involve a lot of questions. [Brand Name] is being developed
                to help people explore appropriate home healthcare options,
                understand what may be available in their area, and know
                what to expect before a service is arranged.
              </p>

              {/* Buttons */}
              <div className="mb-9 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mb-11 sm:gap-x-8">
                <a
                  href="#contact"
                  className="inline-flex min-h-12 items-center justify-center bg-[#0f1681] px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#4754ff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f1681] sm:px-8 sm:py-4"
                >
                  Enquire About Care
                </a>

                <a
                  href="#services"
                  className="group inline-flex min-h-12 items-center gap-3 text-sm font-semibold text-[#0f1681] transition-colors duration-300 hover:text-[#4754ff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f1681]"
                >
                  <span
                    className="h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-[#0f1681] transition-colors group-hover:border-l-[#4754ff]"
                    aria-hidden="true"
                  />
                  Explore Services
                </a>
              </div>

              {/* Practical benefits instead of unsupported statistics */}
              <div className="flex flex-wrap items-start gap-x-10 gap-y-6 sm:gap-x-12">
                <div className="max-w-[180px]">
                  <h2 className="text-lg font-medium text-[#0f1681] sm:text-xl">
                    Understand Your Options
                  </h2>
                  <p className="mt-2 text-xs leading-6 text-gray-500 sm:text-sm">
                    Explore the support that may be appropriate for your needs.
                  </p>
                </div>

                <div className="max-w-[180px]">
                  <h2 className="text-lg font-medium text-[#0f1681] sm:text-xl">
                    Know the Details
                  </h2>
                  <p className="mt-2 text-xs leading-6 text-gray-500 sm:text-sm">
                    Ask about availability, arrangements, and applicable fees.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* RIGHT IMAGE */}
            <div className="relative mx-auto flex h-[350px] w-full max-w-[520px] items-end justify-center sm:h-[440px] md:h-[500px] lg:mt-0 lg:h-full lg:min-h-[560px] lg:max-w-none lg:justify-end xl:min-h-[680px]">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="absolute inset-0"
              >
                <Image
                  src="/images/nurse-caring-about-senior.png"
                  alt="Home healthcare support for an older adult"
                  fill
                  priority
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 80vw, 50vw"
                  className="object-contain object-bottom lg:-ml-10 lg:object-right-bottom"
                />

                {/* Floating information card */}
                <div className="absolute bottom-5 left-2 z-10 flex max-w-[calc(100%-1rem)] items-center gap-3 bg-white p-3 shadow-[0_15px_40px_rgba(15,22,129,0.15)] sm:bottom-8 sm:left-4 sm:gap-4 sm:p-5 lg:bottom-auto lg:left-auto lg:right-0 lg:top-[25%] lg:max-w-none lg:gap-5 lg:p-5 xl:right-2 xl:p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#eff9f7] sm:h-12 sm:w-12">
                    <ShieldCheck
                      className="h-6 w-6 text-[#0f1681]"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-medium text-[#0f1681] sm:text-xl">
                      Clear Expectations
                    </h3>
                    <p className="mt-0.5 max-w-[190px] text-xs leading-5 text-gray-500 sm:text-sm">
                      Know what to expect before arranging care.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURE BAR ================= */}
      <section className="relative w-full overflow-hidden bg-[#0f1681] py-12 sm:py-14 lg:py-16">
        {/* Decorative curves */}
        <div className="pointer-events-none absolute bottom-0 left-0 h-36 w-36 opacity-20 sm:h-48 sm:w-48">
          <svg
            viewBox="0 0 200 200"
            fill="none"
            className="h-full w-full rotate-180"
            aria-hidden="true"
          >
            <path
              d="M200 0C200 110.457 110.457 200 0 200"
              stroke="#4754ff"
              strokeWidth="2"
            />
            <path
              d="M200 40C200 128.366 128.366 200 40 200"
              stroke="#4754ff"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-8 xl:gap-10">
            {features.map(({ title, description, Icon }) => (
              <div key={title} className="flex items-start gap-4 sm:gap-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[#e8ebff] sm:h-12 sm:w-12">
                  <Icon
                    className="h-5 w-5 text-[#0f1681] sm:h-6 sm:w-6"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="mb-2 text-lg font-medium text-white sm:text-xl">
                    {title}
                  </h3>
                  <p className="max-w-xs text-sm leading-relaxed text-gray-300">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

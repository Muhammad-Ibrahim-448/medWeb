"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Stethoscope,
  HeartPulse,
  Activity,
  Hospital,
  HeartHandshake,
  TestTube2,
  CalendarClock,
  CheckCircle2,
  MessageCircle,
  ClipboardCheck,
  ShieldCheck,
  CircleHelp,
} from "lucide-react";

const services = [
  {
    number: "01",
    title: "Nursing Care at Home",
    description:
      "Explore nursing support for tasks that are appropriate for a home setting and within a qualified nurse's professional scope.",
    Icon: Stethoscope,
    href: "/#contact",
    tag: "Nursing support",
  },
  {
    number: "02",
    title: "Doctor Visits at Home",
    description:
      "Ask whether a doctor can assess your concern at home or whether another care setting may be more appropriate.",
    Icon: HeartPulse,
    href: "/#contact",
    tag: "Medical consultation",
  },
  {
    number: "03",
    title: "Physiotherapy at Home",
    description:
      "Explore home physiotherapy for movement, mobility, or rehabilitation needs, subject to professional assessment.",
    Icon: Activity,
    href: "/#contact",
    tag: "Mobility support",
  },
  {
    number: "04",
    title: "Post-Hospital Recovery Support",
    description:
      "Discuss support after hospital discharge and whether the available services fit the patient's discharge plan.",
    Icon: Hospital,
    href: "/#contact",
    tag: "Recovery support",
  },
  {
    number: "05",
    title: "Elderly Care at Home",
    description:
      "Discuss daily living assistance for older adults, with clear boundaries between non-clinical help and medical care.",
    Icon: HeartHandshake,
    href: "/#contact",
    tag: "Daily assistance",
  },
  {
    number: "06",
    title: "Home Sample Collection",
    description:
      "Ask whether a required test can be collected at home and confirm preparation, laboratory handling, fees, and result delivery.",
    Icon: TestTube2,
    href: "/#contact",
    tag: "Diagnostic support",
  },
  {
    number: "07",
    title: "Ongoing Home Support",
    description:
      "Discuss recurring visits or assistance, including agreed tasks, schedules, costs, and how changing needs will be handled.",
    Icon: CalendarClock,
    href: "/#contact",
    tag: "Planned support",
  },
];

const principles = [
  {
    Icon: MessageCircle,
    title: "Clear Information",
    description:
      "Understand the proposed service and what it may involve before deciding how to proceed.",
  },
  {
    Icon: ClipboardCheck,
    title: "Details Before Confirmation",
    description:
      "Ask about availability, applicable charges, preparation, and any service limitations.",
  },
  {
    Icon: ShieldCheck,
    title: "Appropriate Care",
    description:
      "Clinical tasks should be handled by appropriately qualified professionals within their authorized scope.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

function SectionEyebrow({ children }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span
        aria-hidden="true"
        className="text-xl leading-none text-[#0f1681] sm:text-2xl"
      >
        ✳
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0f1681] sm:text-sm">
        {children}
      </span>
    </div>
  );
}

function ServiceCard({ service, index }) {
  const { Icon } = service;

  return (
    <motion.article
      variants={fadeUp}
      className="group relative flex h-full flex-col border border-[#e8ebff] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#4754ff]/40 hover:shadow-[0_18px_45px_rgba(15,22,129,0.08)] sm:p-7 lg:p-8"
    >
      <div className="mb-7 flex items-start justify-between gap-3">
        <div className="flex h-14 w-14 items-center justify-center bg-[#eff9f7] text-[#0f1681] transition-colors duration-300 group-hover:bg-[#0f1681] group-hover:text-white">
          <Icon className="h-6 w-6" strokeWidth={1.7} />
        </div>

        <span className="text-sm font-medium tracking-wider text-[#b8bff0]">
          {service.number}
        </span>
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#4754ff]">
        {service.tag}
      </p>

      <h3 className="mb-3 text-xl font-medium leading-snug text-[#0f1681] sm:text-[22px]">
        {service.title}
      </h3>

      <p className="mb-7 flex-1 text-sm leading-7 text-gray-500 sm:text-[15px]">
        {service.description}
      </p>

      <a
        href={service.href}
        className="group/link inline-flex w-fit items-center gap-2 border-b border-[#0f1681]/20 pb-1.5 text-sm font-semibold text-[#0f1681] transition-colors hover:border-[#4754ff] hover:text-[#4754ff]"
        aria-label={`Ask about ${service.title}`}
      >
        Ask About This Service
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
      </a>
    </motion.article>
  );
}

export default function ServicesPageContent() {
  return (
    <main className="w-full overflow-hidden bg-white font-sans">
      {/* ===================================================== */}
      {/* HERO SECTION (UPDATED)                                */}
      {/* ===================================================== */}
      <section className="relative isolate flex min-h-[400px] items-center justify-center overflow-hidden sm:min-h-[500px] lg:min-h-[600px]">
        {/* Background Image */}
        <Image
          src="/images/supporting-an-older-adult.png"
          alt="Caregiver supporting an older adult at home"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* White Overlay */}
        <div className="absolute inset-0 bg-white/80" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-normal tracking-tight text-[#0f1681] sm:text-5xl md:text-6xl">
              Our Services
            </h1>

            {/* Breadcrumb */}
            <div className="mt-6 flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-[#0f1681] sm:text-sm">
              <Link
                href="/"
                className="transition-colors hover:text-[#4754ff]"
              >
                HOME
              </Link>

              <span className="text-[#4754ff]">
                {/* Asterisk/Star Icon */}
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

              <span className="text-[#0f1681]">SERVICES</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* INTRODUCTION                                          */}
      {/* ===================================================== */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp} className="flex justify-center">
            <SectionEyebrow>Find the Right Information</SectionEyebrow>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mb-5 text-3xl font-light leading-tight tracking-tight text-[#0f1681] sm:text-4xl lg:text-5xl"
          >
            Care Options Should Be
            <br className="hidden sm:block" /> Clear from the Start
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto max-w-2xl text-sm leading-7 text-gray-500 sm:text-base sm:leading-8"
          >
            Every person's circumstances are different. The service that suits
            one person may not suit another. Tell us what support you are
            looking for and where it is needed so that the available options,
            next steps, and relevant limitations can be explained.
          </motion.p>
        </motion.div>
      </section>

      {/* ===================================================== */}
      {/* SERVICES GRID                                         */}
      {/* ===================================================== */}
      <section
        id="services"
        className="scroll-mt-24 bg-[#f4f6ff] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-2xl">
              <motion.div variants={fadeUp}>
                <SectionEyebrow>What You Can Ask About</SectionEyebrow>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                className="text-3xl font-light leading-tight tracking-tight text-[#0f1681] sm:text-4xl lg:text-5xl"
              >
                Explore Our Proposed
                <br className="hidden sm:block" /> Care Services
              </motion.h2>
            </div>

            <motion.p
              variants={fadeUp}
              className="max-w-md text-sm leading-7 text-gray-500 sm:text-base"
            >
              Select a category to learn about the type of support it may
              involve. Actual services depend on confirmed availability and
              professional suitability.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          >
            {services.map((service) => (
              <ServiceCard key={service.number} service={service} />
            ))}
          </motion.div>

          <p className="mt-7 text-xs leading-6 text-gray-500 sm:text-sm">
            These categories are proposed service options, not a guarantee that
            every service is currently offered. Please enquire to confirm the
            approved service scope and availability in your area.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* HOW WE APPROACH CARE                                  */}
      {/* ===================================================== */}
      <section
        id="how-it-works"
        className="relative overflow-hidden bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div className="pointer-events-none absolute -right-20 top-10 h-56 w-56 rounded-full border border-[#e8ebff] sm:h-72 sm:w-72" />

        <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="relative"
          >
            <div className="relative aspect-[5/4] overflow-hidden bg-[#eff9f7]">
              <Image
                src="/images/professional-providing-support.png"
                alt="Healthcare professional providing support"
                fill
                sizes="(max-width: 1023px) 100vw, 48vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-5 -right-3 bg-[#0f1681] px-5 py-4 text-white sm:-right-5 sm:px-7 sm:py-5">
              <p className="text-xs leading-5 text-white/75 sm:text-sm">
                Understand your options
              </p>
              <p className="mt-1 text-lg font-medium sm:text-xl">
                Before confirming care
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="pt-3 lg:pt-0"
          >
            <motion.div variants={fadeUp}>
              <SectionEyebrow>Our Approach</SectionEyebrow>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="mb-5 text-3xl font-light leading-tight tracking-tight text-[#0f1681] sm:text-4xl lg:text-5xl"
            >
              Thoughtful Care Starts with Clear Communication
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mb-8 text-sm leading-7 text-gray-500 sm:text-base sm:leading-8"
            >
              Arranging care can bring questions about suitability, cost,
              scheduling, and professional responsibilities. The enquiry
              process should help you understand those details without assuming
              that one solution fits everyone.
            </motion.p>

            <div className="space-y-6">
              {principles.map(({ Icon, title, description }) => (
                <motion.div
                  variants={fadeUp}
                  key={title}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#eff9f7] text-[#0f1681]">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>

                  <div>
                    <h3 className="mb-1 text-base font-semibold text-[#0f1681] sm:text-lg">
                      {title}
                    </h3>
                    <p className="text-sm leading-6 text-gray-500">
                      {description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="mt-9">
              <a
                href="/#contact"
                className="inline-flex min-h-12 items-center gap-3 bg-[#0f1681] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#4754ff]"
              >
                Ask About Availability
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* HOW TO ENQUIRE                                        */}
      {/* ===================================================== */}
      <section className="bg-[#eff9f7] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="mx-auto mb-10 max-w-2xl text-center sm:mb-14"
          >
            <motion.div variants={fadeUp} className="flex justify-center">
              <SectionEyebrow>Getting Started</SectionEyebrow>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="mb-4 text-3xl font-light leading-tight tracking-tight text-[#0f1681] sm:text-4xl lg:text-5xl"
            >
              How to Enquire About Care
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-sm leading-7 text-gray-500 sm:text-base"
            >
              Start by sharing what support you are looking for. The next step
              is to clarify the service, location, and practical details.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
          >
            {[
              {
                number: "01",
                title: "Tell Us What You Need",
                description:
                  "Briefly explain the type of support you are looking for and the area where care is needed.",
              },
              {
                number: "02",
                title: "Discuss Suitability",
                description:
                  "Clarify the requested service, any relevant instructions, and whether the service may be appropriate.",
              },
              {
                number: "03",
                title: "Confirm the Details",
                description:
                  "Ask about availability, applicable charges, preparation, and any limitations before agreeing to an arrangement.",
              },
            ].map((step) => (
              <motion.article
                variants={fadeUp}
                key={step.number}
                className="border border-[#dcece7] bg-white p-6 sm:p-8"
              >
                <span className="mb-6 inline-flex h-11 w-11 items-center justify-center bg-[#0f1681] text-sm font-semibold text-white">
                  {step.number}
                </span>

                <h3 className="mb-3 text-xl font-medium text-[#0f1681]">
                  {step.title}
                </h3>

                <p className="text-sm leading-7 text-gray-500">
                  {step.description}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SAFETY NOTE                                           */}
      {/* ===================================================== */}
      <section className="bg-white px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1200px] items-start gap-4 border-l-4 border-[#4754ff] bg-[#f4f6ff] p-5 sm:p-6">
          <CircleHelp className="mt-0.5 h-6 w-6 shrink-0 text-[#0f1681]" />

          <div>
            <h2 className="mb-2 text-base font-semibold text-[#0f1681] sm:text-lg">
              Important Healthcare Information
            </h2>
            <p className="text-sm leading-7 text-gray-600">
              Website information does not replace medical advice, diagnosis,
              or treatment. A home visit may not be appropriate for every
              condition. For a potentially life-threatening emergency, contact
              local emergency services or go to the nearest emergency
              department. Do not wait for an online response.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FINAL CTA                                             */}
      {/* ===================================================== */}
      <section className="px-5 pb-16 pt-8 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="relative mx-auto max-w-[1400px] overflow-hidden bg-[#0f1681] px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16"
        >
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/15 sm:h-80 sm:w-80" />
          <div className="pointer-events-none absolute -right-4 -top-12 h-48 w-48 rounded-full border border-white/15 sm:h-64 sm:w-64" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#aab0ff] sm:text-sm">
                Need More Information?
              </p>

              <h2 className="mb-4 text-3xl font-light leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Need Help Understanding the Available Options?
              </h2>

              <p className="max-w-xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
                Tell us what support you are looking for and where it is
                needed. You can then ask about suitable options, availability,
                and the next steps.
              </p>
            </div>

            <a
              href="/#contact"
              className="group inline-flex min-h-13 shrink-0 items-center justify-center gap-3 bg-white px-6 py-4 text-sm font-semibold text-[#0f1681] transition-colors hover:bg-[#eff9f7] sm:px-8"
            >
              Make an Enquiry
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  ClipboardCheck,
  Eye,
  Target,
  MessageCircle,
  CircleDollarSign,
  UserRoundCheck,
} from "lucide-react";

const principles = [
  {
    icon: MessageCircle,
    title: "Clear Communication",
    description:
      "We aim to explain what a service involves, what information may be needed, and what the next step would look like.",
  },
  {
    icon: HeartHandshake,
    title: "Respect and Dignity",
    description:
      "Every enquiry deserves respectful communication. We aim to understand individual circumstances without making assumptions about a person's needs.",
  },
  {
    icon: ShieldCheck,
    title: "Honest Service Information",
    description:
      "We aim to be clear about service limitations and when a request falls outside the support we can arrange.",
  },
  {
    icon: CircleDollarSign,
    title: "Transparent Expectations",
    description:
      "Applicable charges, availability, and relevant limitations should be explained before an arrangement is confirmed.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell Us What You Need",
    description:
      "Explain the kind of support you are looking for and the area where it is needed.",
  },
  {
    number: "02",
    title: "Understand the Options",
    description:
      "We aim to clarify which service categories may be relevant and what information is needed next.",
  },
  {
    number: "03",
    title: "Confirm the Details",
    description:
      "Service scope, professional responsibilities, availability, applicable charges, and limitations should be clarified before confirmation.",
  },
];

function SectionLabel({ children }) {
  return (
    <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[#4754ff] sm:text-sm">
      {children}
    </p>
  );
}

export default function AboutPageContent() {
  return (
    <main className="w-full overflow-hidden bg-white text-[#0f1681]">
      {/* ====================================================== */}
      {/* HERO SECTION (UPDATED)                                  */}
      {/* ====================================================== */}
      <section className="relative isolate flex min-h-[400px] items-center justify-center overflow-hidden sm:min-h-[500px] lg:min-h-[600px]">
        {/* Background Image */}
        <Image
          src="/images/about-us-page-header.jpg"
          alt="Caregiver speaking with an older adult"
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
              About Us
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

              <span className="text-[#0f1681]">ABOUT</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* WHO WE ARE                                              */}
      {/* ====================================================== */}
      <section className="bg-white py-20 sm:py-24 lg:py-28">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 xl:px-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto w-full max-w-[540px] lg:mx-0"
          >
            <div className="absolute -bottom-5 -left-5 h-2/3 w-2/3 bg-[#f4f6ff]" />

            <div className="relative aspect-[5/4] w-full overflow-hidden">
              <Image
                src="/images/step-toward-better-decisions.png"
                alt="Caregiver offering support to an older adult"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -right-2 top-6 flex h-16 w-16 items-center justify-center bg-[#0f1681] sm:-right-4 sm:h-20 sm:w-20">
              <HeartHandshake className="h-8 w-8 text-white sm:h-9 sm:w-9" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-xl"
          >
            <SectionLabel>Who We Are</SectionLabel>

            <h2 className="text-3xl font-normal leading-tight tracking-tight text-[#0f1681] sm:text-4xl lg:text-5xl">
              Clear Information Is the First Step Toward Better Decisions.
            </h2>

            <p className="mt-6 text-base leading-8 text-gray-600">
              [Brand Name] is being developed for people and families
              exploring healthcare support at home in Pakistan. We believe
              the first step should be clear information: what a service
              involves, who it may be suitable for, what it costs, and how
              to find out whether it is available in your area.
            </p>

            <p className="mt-5 text-base leading-8 text-gray-600">
              Our aim is to help make the process of exploring home healthcare
              more straightforward, so people can ask relevant questions and
              understand the next steps before making an arrangement.
            </p>

            <div className="mt-8 border-l-2 border-[#4754ff] bg-[#f4f6ff] p-5 sm:p-6">
              <p className="text-base leading-7 text-[#0f1681] sm:text-lg">
                Every person has their own circumstances. Information should
                help people understand their options rather than make
                assumptions about their needs.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* WHY WE ARE BUILDING THIS SERVICE                        */}
      {/* ====================================================== */}
      <section className="relative overflow-hidden bg-[#f4f6ff] py-20 sm:py-24 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-20 h-[300px] w-[300px] opacity-60 sm:h-[400px] sm:w-[400px]"
        >
          <svg viewBox="0 0 300 300" fill="none" className="h-full w-full">
            <path
              d="M300 0C300 165.685 165.685 300 0 300"
              stroke="#0f1681"
              strokeWidth="1.3"
            />
            <path
              d="M300 60C300 192.548 192.548 300 60 300"
              stroke="#0f1681"
              strokeWidth="1.3"
            />
            <path
              d="M300 120C300 219.411 219.411 300 120 300"
              stroke="#0f1681"
              strokeWidth="1.3"
            />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-14 max-w-3xl text-center sm:mb-16"
          >
            <SectionLabel>Why We Are Building This Service</SectionLabel>

            <h2 className="text-3xl font-normal leading-tight tracking-tight text-[#0f1681] sm:text-4xl lg:text-5xl">
              Arranging Care Should Be Easier to Navigate.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              Arranging care for yourself or someone you love can involve
              decisions about travel, time, family responsibilities, and the
              type of professional support required.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ClipboardCheck,
                number: "01",
                title: "Understand the Service",
                description:
                  "Learn what a service may involve, which professional role is responsible, and whether the requested support fits the confirmed service scope.",
              },
              {
                icon: MessageCircle,
                number: "02",
                title: "Know the Next Steps",
                description:
                  "Understand what information may be needed, how availability is checked, and what needs to be agreed before an arrangement is confirmed.",
              },
              {
                icon: ShieldCheck,
                number: "03",
                title: "Make an Informed Decision",
                description:
                  "Have relevant information about applicable charges, service limitations, and professional responsibilities before deciding how to proceed.",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.number}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border border-[#dfe4ff] bg-white p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-8"
                >
                  <div className="mb-7 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center bg-[#e8ebff]">
                      <Icon className="h-6 w-6 text-[#0f1681]" strokeWidth={1.5} />
                    </div>
                    <span className="text-3xl font-light text-[#4754ff]/40">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mb-4 text-xl font-normal text-[#0f1681] sm:text-2xl">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-7 text-gray-600 sm:text-base">
                    {item.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* OUR APPROACH                                            */}
      {/* ====================================================== */}
      <section className="bg-white py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-24"
            >
              <SectionLabel>Our Approach</SectionLabel>

              <h2 className="text-3xl font-normal leading-tight tracking-tight text-[#0f1681] sm:text-4xl lg:text-5xl">
                Care Starts With Understanding.
              </h2>

              <p className="mt-6 text-base leading-8 text-gray-600">
                We intend to treat every enquiry with respect, avoid making
                assumptions about a person's needs, and be clear when a
                request falls outside the services we offer.
              </p>

              <Link
                href="/contact/"
                className="mt-8 inline-flex items-center gap-3 text-sm font-medium text-[#0f1681] transition-colors hover:text-[#4754ff]"
              >
                Talk to Our Team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="space-y-5">
              {principles.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="flex gap-5 border border-gray-200 p-6 transition-colors duration-300 hover:border-[#4754ff] sm:gap-6 sm:p-8"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f4f6ff] sm:h-14 sm:w-14">
                      <Icon className="h-6 w-6 text-[#0f1681]" strokeWidth={1.5} />
                    </div>

                    <div>
                      <h3 className="mb-3 text-xl font-normal text-[#0f1681] sm:text-2xl">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-7 text-gray-600 sm:text-base">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* MISSION AND VISION                                      */}
      {/* ====================================================== */}
      <section className="bg-[#ecfcf5] py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-14 max-w-3xl text-center sm:mb-16"
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em]  sm:text-sm">
              Our Purpose
            </p>

            <h2 className="text-3xl font-normal leading-tight tracking-tight  sm:text-4xl lg:text-5xl">
              The Principles Guiding Our Direction.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-800">
              Our proposed mission and vision reflect the kind of home
              healthcare experience we aim to help people navigate.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <motion.article
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="border border-white/20 bg-white/[0.06] p-7 sm:p-10 lg:p-12"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center bg-[#4754ff]">
                <Target className="h-8 w-8 text-white" strokeWidth={1.5} />
              </div>

              <p className="mb-4 text-xs uppercase tracking-[0.25em]">
                Our Mission
              </p>

              <h3 className="mb-5 text-2xl font-normal leading-snug text-black sm:text-3xl">
                Make Appropriate Home Healthcare Easier to Understand and Arrange.
              </h3>

              <p className="text-base leading-8 text-gray-800">
                To make appropriate home healthcare easier for patients and
                families to understand and arrange, with clear information
                about services and the steps involved.
              </p>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="border border-white/20 bg-white/[0.06] p-7 sm:p-10 lg:p-12"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center bg-[#4754ff]">
                <Eye className="h-8 w-8 text-white" strokeWidth={1.5} />
              </div>

              <p className="mb-4 text-xs uppercase tracking-[0.25em] ">
                Our Vision
              </p>

              <h3 className="mb-5 text-2xl font-normal leading-snug text-black sm:text-3xl">
                Informed Decisions. Clear Information. Respect at Every Step.
              </h3>

              <p className="text-base leading-8 text-gray-800">
                A healthcare experience in which people can make informed
                decisions about suitable care, with clear information and
                respect at every step.
              </p>
            </motion.article>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* OUR COMMITMENT                                          */}
      {/* ====================================================== */}
      <section className="bg-white py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -left-4 -top-4 h-full w-full bg-[#f4f6ff]" />

              <div className="relative overflow-hidden bg-[#f4f6ff] p-7 sm:p-10 lg:p-12">
                <div className="mb-7 flex h-14 w-14 items-center justify-center bg-[#0f1681]">
                  <UserRoundCheck className="h-7 w-7 text-white" strokeWidth={1.5} />
                </div>

                <SectionLabel>Our Proposed Commitment</SectionLabel>

                <h2 className="text-3xl font-normal leading-tight tracking-tight text-[#0f1681] sm:text-4xl">
                  Information You Can Understand Before You Decide.
                </h2>

                <p className="mt-6 text-base leading-8 text-gray-600">
                  We aim to make important service details easier to
                  understand before an arrangement is confirmed.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <SectionLabel>What This Means</SectionLabel>

              <h3 className="mb-8 text-2xl font-normal leading-snug text-[#0f1681] sm:text-3xl">
                Our intended commitments to patients and families.
              </h3>

              <div className="space-y-6">
                {[
                  "Give clear information about the services offered.",
                  "Explain relevant charges before an arrangement is confirmed.",
                  "Handle personal information carefully.",
                  "Communicate limitations that may affect a requested arrangement.",
                  "Ensure clinical care is delivered by appropriately qualified professionals within their authorized scope.",
                ].map((item, index) => (
                  <div key={item} className="flex items-start gap-4">
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8ebff]">
                      <span className="text-sm font-medium text-[#0f1681]">
                        {index + 1}
                      </span>
                    </div>

                    <p className="text-sm leading-7 text-gray-600 sm:text-base">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-l-2 border-[#4754ff] pl-5">
                <p className="text-sm leading-7 text-gray-500">
                  These commitments must be supported by approved policies
                  and working processes before publication. Non-clinical
                  support must not be represented as nursing or medical
                  treatment.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* HOW WE APPROACH AN ENQUIRY                              */}
      {/* ====================================================== */}
      <section className="bg-[#f4f6ff] py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-14 max-w-3xl text-center"
          >
            <SectionLabel>What to Expect</SectionLabel>

            <h2 className="text-3xl font-normal leading-tight tracking-tight text-[#0f1681] sm:text-4xl lg:text-5xl">
              A Clearer Path to Your Enquiry.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-600">
              We want the process of asking about home healthcare to be
              straightforward, with the relevant details explained before
              an arrangement is confirmed.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative border border-[#dfe4ff] bg-white p-7 sm:p-8"
              >
                <span className="text-4xl font-light text-[#4754ff]">
                  {step.number}
                </span>

                <h3 className="mb-4 mt-6 text-xl font-normal text-[#0f1681] sm:text-2xl">
                  {step.title}
                </h3>

                <p className="text-sm leading-7 text-gray-600 sm:text-base">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/how-it-works/"
              className="inline-flex items-center gap-3 bg-[#0f1681] px-7 py-4 text-sm font-medium text-white transition-colors hover:bg-[#4754ff]"
            >
              Learn How It Works
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* FINAL CTA                                               */}
      {/* ====================================================== */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative isolate mx-auto max-w-5xl overflow-hidden bg-[#0f1681] px-6 py-16 text-center sm:px-10 sm:py-20 lg:px-16 lg:py-24"
          >
            {/* Decorative curves */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 -z-10 h-[280px] w-[280px] opacity-40 sm:h-[350px] sm:w-[350px] lg:h-[420px] lg:w-[420px]"
            >
              <svg
                viewBox="0 0 400 400"
                fill="none"
                className="h-full w-full"
              >
                <path
                  d="M400 0C400 220.914 220.914 400 0 400"
                  stroke="#4754ff"
                  strokeWidth="1.5"
                />
                <path
                  d="M400 60C400 247.81 247.81 400 60 400"
                  stroke="#4754ff"
                  strokeWidth="1.5"
                />
                <path
                  d="M400 120C400 274.706 274.706 400 120 400"
                  stroke="#4754ff"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-20 -left-20 -z-10 h-[280px] w-[280px] opacity-40 sm:h-[350px] sm:w-[350px] lg:h-[420px] lg:w-[420px]"
            >
              <svg
                viewBox="0 0 400 400"
                fill="none"
                className="h-full w-full"
              >
                <path
                  d="M0 400C0 179.086 179.086 0 400 0"
                  stroke="#4754ff"
                  strokeWidth="1.5"
                />
                <path
                  d="M0 340C0 152.19 152.19 0 340 0"
                  stroke="#4754ff"
                  strokeWidth="1.5"
                />
                <path
                  d="M0 280C0 125.294 125.294 0 280 0"
                  stroke="#4754ff"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            <div className="relative z-10 mx-auto max-w-2xl">
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white sm:text-sm">
                Talk to Our Team
              </p>

              <h2 className="text-3xl font-normal leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Need Help Understanding the Available Options?
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                Tell us what support you are looking for and where it is
                needed. We will use the information to explain whether a
                suitable service may be available and what the next step
                would involve.
              </p>

              <Link
                href="/contact/"
                className="mt-8 inline-flex items-center justify-center gap-3 bg-[#4754ff] px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[#0f1681] sm:px-10"
              >
                Talk to Our Team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Healthcare disclaimer */}
      <div className="border-t border-gray-200 bg-white px-5 py-5 sm:px-8">
        <p className="mx-auto max-w-5xl text-center text-xs leading-6 text-gray-500">
          This website provides general service information and is not a
          substitute for medical advice, diagnosis, or emergency care. For
          a medical emergency, contact local emergency services or go to
          the nearest emergency department.
        </p>
      </div>
    </main>
  );
}
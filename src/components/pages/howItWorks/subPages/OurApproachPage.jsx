"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  MessageCircle,
  ClipboardCheck,
  Users,
  CircleHelp,
} from "lucide-react";

const principles = [
  {
    icon: MessageCircle,
    title: "Listen and Understand",
    description:
      "Every enquiry starts with understanding what kind of support is being requested, where it is needed, and what matters to the patient and family.",
  },
  {
    icon: ClipboardCheck,
    title: "Explain the Options",
    description:
      "Clarify the proposed service, its scope, availability, applicable fees, and any limitations before deciding how to proceed.",
  },
  {
    icon: ShieldCheck,
    title: "Keep Expectations Clear",
    description:
      "Share relevant information honestly and avoid making assumptions about services, timings, or arrangements that have not been confirmed.",
  },
  {
    icon: HeartHandshake,
    title: "Respect Individual Needs",
    description:
      "Care requests can differ from one household to another. Questions and arrangements should reflect the circumstances of each request.",
  },
];

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CTA({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0f1681] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#4754ff]"
    >
      {children}
      <ArrowRight size={17} />
    </Link>
  );
}

export default function OurApproachPage() {
  return (
    <main className="overflow-hidden bg-white text-[#24304f]">
      {/* ===================================================== */}
      {/* HERO SECTION (UPDATED)                                */}
      {/* ===================================================== */}
      <section className="relative isolate flex min-h-[400px] items-center justify-center overflow-hidden sm:min-h-[500px] lg:min-h-[600px]">
        {/* Background Image */}
        <Image
          src="/images/our-approach-header.png"
          alt="Care professional spending time with an older adult"
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
              Our Approach
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

              <span className="text-[#0f1681]">OUR APPROACH</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* HERO CONTENT (placed below the header)                */}
      {/* ===================================================== */}
      <section className="relative bg-gradient-to-br from-white via-white to-[#eff9f7]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-10 lg:py-24">
          <Reveal>
            <span className="inline-flex rounded-full border border-[#e8ebff] bg-[#f4f6ff] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#4754ff]">
              Our approach
            </span>

            <h2 className="mt-6 max-w-xl text-4xl leading-tight tracking-tight text-[#0f1681] sm:text-5xl lg:text-[58px]">
              Care Begins With{" "}
              <span className="text-[#4754ff]">Understanding.</span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
              Finding home healthcare can raise important questions. Our
              approach starts with listening, sharing clear information, and
              helping you understand the options before you make a decision.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTA href="/contact">Talk to Our Team</CTA>
              <Link
                href="/how-it-works"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#dfe3ff] px-6 py-3 text-sm font-semibold text-[#0f1681] transition hover:bg-[#f4f6ff]"
              >
                How It Works
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="relative">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-[#e8ebff]/70 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] bg-[#eff9f7] p-3 sm:p-4">
              <div className="relative h-[330px] overflow-hidden rounded-[1.5rem] sm:h-[440px]">
                <Image
                  src="/images/thoughtful-starting-point.png"
                  alt="Care professional spending time with an older adult"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className="relative mx-2 -mt-12 rounded-2xl bg-white p-5 shadow-xl sm:mx-4 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8ebff] text-[#0f1681]">
                    <HeartHandshake size={25} />
                  </div>
                  <div>
                    <h2 className="text-[#0f1681]">
                      A thoughtful starting point
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Understand the request. Clarify the options. Decide
                      with confidence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================================================== */}
      {/* INTRO                                                 */}
      {/* ===================================================== */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-[#4754ff]">
            What matters to us
          </span>
          <h2 className="mt-4 text-3xl leading-tight text-[#0f1681] sm:text-4xl">
            A Clearer, More Considered Care Experience
          </h2>
          <p className="mt-5 leading-8 text-gray-600">
            Every care enquiry is different. We believe the process should
            make it easier to ask questions, understand what is being
            proposed, and know what needs to be confirmed before proceeding.
          </p>
        </Reveal>
      </section>

      {/* ===================================================== */}
      {/* PRINCIPLES                                            */}
      {/* ===================================================== */}
      <section className="bg-[#f8f9ff] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-12 text-center">
            <h2 className="text-3xl text-[#0f1681] sm:text-4xl">
              The Principles Behind Our Approach
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
              Clear communication and realistic expectations are important
              when exploring care for yourself or a loved one.
            </p>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((item, index) => {
              const Icon = item.icon;

              return (
                <Reveal key={item.title} delay={index * 0.07}>
                  <article className="h-full rounded-3xl border border-[#e8ebff] bg-white p-6 sm:p-7">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8ebff] text-[#0f1681]">
                      <Icon size={26} />
                    </div>
                    <h3 className="mt-6 text-xl text-[#0f1681]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-gray-600">
                      {item.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* PROCESS                                               */}
      {/* ===================================================== */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.2em] text-[#4754ff]">
              A simple process
            </span>
            <h2 className="mt-4 text-3xl leading-tight text-[#0f1681] sm:text-4xl">
              What You Can Expect
            </h2>
            <p className="mt-5 leading-8 text-gray-600">
              The exact process depends on the request and the services
              confirmed as available. These are the key details to clarify
              as you explore your options.
            </p>

            <div className="mt-8 space-y-6">
              {[
                "Explain the type of support you are looking for.",
                "Clarify service availability and applicable fees.",
                "Review the proposed arrangement and any limitations.",
                "Decide whether you wish to proceed.",
              ].map((item, index) => (
                <div key={item} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8ebff] text-sm text-[#0f1681]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <p className="pt-1 leading-7 text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[2rem] bg-[#eff9f7] p-7 sm:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0f1681] shadow-sm">
                <Users size={27} />
              </div>
              <h3 className="mt-6 text-2xl text-[#0f1681]">
                Your questions matter
              </h3>
              <p className="mt-4 leading-8 text-gray-600">
                Ask about the proposed care, who will provide it, what is
                included, and any preparation required. Important details
                should be clarified before you agree to an arrangement.
              </p>
              <div className="mt-7">
                <CTA href="/faqs">Read Frequently Asked Questions</CTA>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FAQ + CTA                                             */}
      {/* ===================================================== */}
      <section className="bg-[#f4f6ff] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <Reveal className="mx-auto max-w-4xl rounded-[2rem] bg-[#0f1681] px-6 py-10 text-center text-white sm:px-12 sm:py-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <CircleHelp size={27} />
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl">
            Have Questions About Home Healthcare?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/80">
            Explore common questions or contact   to discuss your
            enquiry and clarify the available options.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <CTA href="/contact">Make an Enquiry</CTA>
            <Link
              href="/articles"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Read Our Articles <ArrowRight size={17} />
            </Link>
          </div>
        </Reveal>

        <p className="mx-auto mt-8 max-w-4xl text-sm leading-6 text-gray-500">
          Home healthcare is not an emergency service. For a potentially
          life-threatening emergency, contact local emergency services or go
          to the nearest emergency department. Do not wait for an online
          response.
        </p>
      </section>
    </main>
  );
}
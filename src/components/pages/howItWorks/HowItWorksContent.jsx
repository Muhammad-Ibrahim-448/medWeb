"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  MessageCircle,
  ShieldCheck,
  CalendarCheck,
  Wallet,
  HeartHandshake,
  FileText,
  CircleHelp,
} from "lucide-react";

const pages = {
  "make-an-enquiry": {
    eyebrow: "STEP 01",
    title: "Start With a Simple Enquiry",
    description:
      "Tell us what kind of support you are looking for, where care is needed, and how we can contact you.",
    icon: MessageCircle,
    intro:
      "You do not need to know every detail before getting in touch. Start with the information you have, and the team can clarify what else may be needed.",
    sections: [
      {
        title: "What information should you share?",
        text: "A brief description of the support needed, the patient's age range when relevant, the city or area, and a safe way to contact you.",
        icon: ClipboardList,
      },
      {
        title: "Share only what is necessary",
        text: "Do not send unnecessary medical records or sensitive documents through an ordinary website enquiry form.",
        icon: ShieldCheck,
      },
      {
        title: "What happens next?",
        text: "The team reviews your enquiry and may ask follow-up questions to understand the request. An enquiry is not a medical diagnosis or a confirmed booking.",
        icon: MessageCircle,
      },
    ],
    next: {
      title: "Check availability and fees",
      description:
        "Once the request is understood, the next step is to clarify whether the service may be available and what it would cost.",
      href: "/how-it-works/availability-and-fees",
      label: "Availability & Fees",
    },
  },
  "availability-and-fees": {
    eyebrow: "STEP 02",
    title: "Understand Availability and Fees",
    description:
      "Before you agree to care, understand whether the requested service may be available in your area and what charges apply.",
    icon: Wallet,
    intro:
      "Availability and costs can depend on the type of support requested, the location, the duration, and any agreed requirements.",
    sections: [
      {
        title: "Confirm the service area",
        text: "Share the city or area where care is needed. The team should confirm whether the requested service can be arranged at that location.",
        icon: ClipboardList,
      },
      {
        title: "Understand the applicable charges",
        text: "Ask about the relevant fee and any additional costs before agreeing to a visit or service.",
        icon: Wallet,
      },
      {
        title: "Clarify what is included",
        text: "Confirm the proposed service, its scope, availability, any relevant limitations, and preparation requirements before proceeding.",
        icon: CircleHelp,
      },
    ],
    next: {
      title: "Agree on the next step",
      description:
        "If the requested support is within the confirmed service scope, the details can be discussed before you choose whether to proceed.",
      href: "/how-it-works/confirming-care",
      label: "Confirm Your Care",
    },
  },
  "confirming-care": {
    eyebrow: "STEP 03",
    title: "Confirm the Care Arrangement",
    description:
      "Review the proposed service and its details before deciding whether to move forward.",
    icon: CalendarCheck,
    intro:
      "A clear arrangement helps patients and families understand what has been discussed and what to expect next.",
    sections: [
      {
        title: "Review the proposed service",
        text: "Make sure the requested support matches the service that has been confirmed as available.",
        icon: FileText,
      },
      {
        title: "Discuss important details",
        text: "Clarify the visit or service details, applicable charges, limitations, and any preparation required.",
        icon: MessageCircle,
      },
      {
        title: "Choose whether to proceed",
        text: "Proceed only after the relevant details have been explained and you are comfortable with the arrangement.",
        icon: CheckCircle2,
      },
    ],
    next: {
      title: "Prepare for the visit",
      description:
        "If a service is agreed, check any instructions or practical preparations shared for that arrangement.",
      href: "/how-it-works/preparing-for-a-visit",
      label: "Preparing for a Visit",
    },
  },
  "preparing-for-a-visit": {
    eyebrow: "STEP 04",
    title: "Know What to Prepare",
    description:
      "Understand any instructions, information, or practical arrangements relevant to the service you have agreed.",
    icon: HeartHandshake,
    intro:
      "Preparation depends on the type of service arranged. Ask the team what is needed for your particular visit rather than assuming every service follows the same process.",
    sections: [
      {
        title: "Keep relevant instructions available",
        text: "Where applicable, have relevant instructions from the patient's treating clinician or hospital discharge plan available.",
        icon: FileText,
      },
      {
        title: "Ask about practical requirements",
        text: "Confirm any preparation, equipment, space, or other requirements that apply to the agreed service.",
        icon: ClipboardList,
      },
      {
        title: "Raise questions in advance",
        text: "If the patient's needs or circumstances change, explain this to the team before relying on the original arrangement.",
        icon: MessageCircle,
      },
    ],
    next: {
      title: "Still have questions?",
      description:
        "Ask the team to clarify the proposed service, applicable charges, and any details you are unsure about.",
      href: "/contact",
      label: "Contact  ",
    },
  },
};

const steps = [
  {
    number: "01",
    title: "Make an enquiry",
    text: "Tell us what support you are looking for and where it is needed.",
    icon: MessageCircle,
  },
  {
    number: "02",
    title: "Clarify availability and fees",
    text: "Understand the service scope, availability, and applicable charges.",
    icon: Wallet,
  },
  {
    number: "03",
    title: "Confirm the arrangement",
    text: "Review the details before deciding whether to proceed.",
    icon: CalendarCheck,
  },
  {
    number: "04",
    title: "Prepare for care",
    text: "Understand any instructions or practical requirements for the agreed service.",
    icon: HeartHandshake,
  },
];

function FadeIn({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ButtonLink({ href, children, secondary = false }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
        secondary
          ? "border border-[#dfe3ff] bg-white text-[#0f1681] hover:border-[#4754ff] hover:bg-[#f4f6ff]"
          : "bg-[#0f1681] text-white shadow-lg shadow-indigo-900/10 hover:-translate-y-0.5 hover:bg-[#4754ff]"
      }`}
    >
      {children}
      <ArrowRight size={17} />
    </Link>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      {eyebrow && (
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#4754ff]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl leading-tight tracking-tight text-[#0f1681] sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

function SafetyNote() {
  return (
    <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 shrink-0 text-amber-700" size={22} />
        <div>
          <h3 className="font-semibold text-gray-900">Important information</h3>
          <p className="mt-1 text-sm leading-6 text-gray-700">
            Home healthcare is not an emergency service. For a potentially
            life-threatening emergency, contact local emergency services or go
            to the nearest emergency department. Do not wait for an online
            response.
          </p>
        </div>
      </div>
    </div>
  );
}

// Reusable Hero component
function PageHero({ title, breadcrumbLabel }) {
  return (
    <section className="relative isolate flex min-h-[400px] items-center justify-center overflow-hidden sm:min-h-[500px] lg:min-h-[600px]">
      {/* Background Image */}
      <Image
        src="/images/how-it-works-header.png"
        alt="Care professional supporting an older adult"
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
            {title}
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

            <span className="text-[#0f1681]">{breadcrumbLabel}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MainOverview() {
  return (
    <>
      {/* ===================================================== */}
      {/* HEADER (full-bleed, title + breadcrumb only)          */}
      {/* ===================================================== */}
      <PageHero title="How It Works" breadcrumbLabel="HOW IT WORKS" />

      {/* ===================================================== */}
      {/* HERO CONTENT (placed below the header)                */}
      {/* ===================================================== */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-br from-white via-white to-[#eff9f7] lg:w-[55%]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
          <FadeIn className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e8ebff] bg-[#f4f6ff] px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#4754ff]">
              <span className="h-2 w-2 rounded-full bg-[#3DCF8E]" />
              A clearer way to arrange care
            </span>

            <h2 className="mt-6 max-w-xl text-4xl leading-[1.12] tracking-tight text-[#0f1681] sm:text-5xl lg:text-[58px]">
              How Home Healthcare{" "}
              <span className="text-[#4754ff]">Works</span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
              Finding the right support for yourself or someone you care about
              should start with clear information. Learn how to enquire, clarify
              availability and fees, and understand the next steps.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact">Make an Enquiry</ButtonLink>
              <ButtonLink href="/services" secondary>
                Explore Services
              </ButtonLink>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#3DCF8E]" />
                Clear next steps
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#3DCF8E]" />
                Fees discussed before agreement
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.12} className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-[#e8ebff]/70 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] bg-[#eff9f7] p-3 sm:p-4">
              <div className="relative h-[320px] overflow-hidden rounded-[1.5rem] sm:h-[430px]">
                <Image
                  src="/images/support-for-yourself.png"
                  alt="Care professional supporting an older adult"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className="relative mx-2 -mt-12 rounded-2xl border border-white/80 bg-white p-5 shadow-xl sm:mx-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8ebff] text-[#0f1681]">
                    <HeartHandshake size={24} />
                  </div>
                  <div>
                    <h2 className="text-[#0f1681]">
                      Care starts with a conversation
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Share your needs, ask questions, and understand the
                      available options before making a decision.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===================================================== */}
      {/* PROCESS STEPS SECTION                                 */}
      {/* ===================================================== */}
      <section className="bg-[#f8f9ff] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="The process"
            title="Four Steps to Understand Your Options"
            description="Every request is different. These steps explain the proposed enquiry process and what you should clarify along the way."
          />

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <FadeIn key={step.number} delay={index * 0.08}>
                  <div className="flex h-full flex-col rounded-3xl border border-[#e8ebff] bg-white p-6 sm:p-7">
                    <div className="flex items-center justify-between">
                      <span className="text-sm tracking-widest text-[#4754ff]">
                        {step.number}
                      </span>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0f2ff] text-[#0f1681]">
                        <Icon size={23} />
                      </div>
                    </div>
                    <h3 className="mt-7 text-xl text-[#0f1681]">
                      {step.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-gray-600">
                      {step.text}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* WHAT TO EXPECT SECTION                                */}
      {/* ===================================================== */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <FadeIn>
              <div className="relative overflow-hidden rounded-[2rem] bg-[#eff9f7] p-3 sm:p-4">
                <div className="relative h-[300px] overflow-hidden rounded-[1.5rem] sm:h-[410px]">
                  <Image
                    src="/images/what-to-expect-before-you-proceed.png"
                    alt="Healthcare professional speaking with a patient"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-xs uppercase tracking-[0.2em] text-[#4754ff]">
                Before you decide
              </p>
              <h2 className="mt-4 text-3xl leading-tight text-[#0f1681] sm:text-4xl">
                Know What to Expect Before You Proceed
              </h2>
              <p className="mt-5 leading-8 text-gray-600">
                The right arrangement starts with understanding the request and
                being clear about what can be provided. Ask questions until you
                understand the proposed service and the next step.
              </p>

              <div className="mt-7 space-y-5">
                {[
                  {
                    title: "Service scope",
                    text: "Clarify what the proposed service includes and its limitations.",
                  },
                  {
                    title: "Availability",
                    text: "Confirm whether the service can be arranged in your area.",
                  },
                  {
                    title: "Applicable fees",
                    text: "Understand the charges and any additional costs before agreeing.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <CheckCircle2
                      className="mt-1 shrink-0 text-[#3DCF8E]"
                      size={21}
                    />
                    <div>
                      <h3 className="font-semibold text-[#0f1681]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <ButtonLink href="/how-it-works/availability-and-fees">
                  Understand Availability & Fees
                </ButtonLink>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CTA SECTION                                           */}
      {/* ===================================================== */}
      <section className="bg-[#f4f6ff] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-4xl rounded-[2rem] bg-[#0f1681] px-6 py-10 text-center text-white sm:px-12 sm:py-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <MessageCircle size={27} />
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl">
            Not Sure Where to Start?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/80">
            Tell us what support you are looking for and where it is needed.
            You can ask questions before deciding whether to proceed.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0f1681] transition hover:bg-[#e8ebff]"
            >
              Make an Enquiry <ArrowRight size={17} />
            </Link>
            <Link
              href="/services"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Browse Services <ArrowRight size={17} />
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-4xl">
          <SafetyNote />
        </div>
      </section>
    </>
  );
}

function DetailPage({ page }) {
  return (
    <>
      {/* Hero Section */}
      <PageHero title={page.title} breadcrumbLabel={page.title.toUpperCase()} />

      {/* Content Section */}
      <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What you need to know"
            title="A Little Clarity Goes a Long Way"
            description={page.intro}
          />

          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
            {page.sections.map((section, index) => {
              const Icon = section.icon;

              return (
                <FadeIn key={section.title} delay={index * 0.08}>
                  <div className="h-full rounded-3xl border border-[#e8ebff] bg-white p-6 sm:p-7">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0f2ff] text-[#0f1681]">
                      <Icon size={23} />
                    </div>
                    <h2 className="mt-6 text-xl text-[#0f1681]">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-gray-600">
                      {section.text}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          <div className="mx-auto mt-10 max-w-5xl">
            <SafetyNote />
          </div>
        </div>
      </section>

      {/* Next Step Section */}
      <section className="bg-[#f4f6ff] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-7 rounded-[2rem] bg-white p-7 shadow-sm sm:p-10 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-[#4754ff]">
              Next step
            </p>
            <h2 className="mt-3 text-2xl text-[#0f1681] sm:text-3xl">
              {page.next.title}
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              {page.next.description}
            </p>
          </div>
          <div className="shrink-0">
            <ButtonLink href={page.next.href}>{page.next.label}</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

export default function HowItWorksContent({ slug = "" }) {
  const page = slug ? pages[slug] : null;

  return (
    <main className="min-h-screen bg-white">
      {page ? <DetailPage page={page} /> : <MainOverview />}
    </main>
  );
}

export const howItWorksPages = pages;
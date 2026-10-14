"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Search,
  MessageCircle,
  CircleHelp,
  ShieldCheck,
} from "lucide-react";

const categories = [
  "All Questions",
  "Getting Started",
  "Services",
  "Fees & Availability",
  "Preparing for Care",
];

const questions = [
  {
    category: "Getting Started",
    question: "How do I enquire about home healthcare?",
    answer:
      "Start by contacting   and describing the type of support you are looking for, the area where care is needed, and a suitable way to contact you. The team can clarify what additional information may be needed.",
  },
  {
    category: "Getting Started",
    question: "Do I need to know exactly which service I need?",
    answer:
      "Not necessarily. You can describe the situation and the support you are seeking. The next step is to clarify whether a suitable service may be available and what information is needed to assess the request.",
  },
  {
    category: "Getting Started",
    question: "Can a family member enquire on behalf of a patient?",
    answer:
      "A family member can make an initial enquiry. Any further information or decisions should be handled appropriately, with the patient's involvement and consent where applicable.",
  },
  {
    category: "Services",
    question: "What home healthcare services are available?",
    answer:
      "Availability depends on the services   has confirmed for the relevant area. Please check the Services page and contact the team to confirm whether your specific request can be accommodated.",
  },
  {
    category: "Services",
    question: "Can I request a doctor or nurse to visit at home?",
    answer:
      "You can enquire about the service you need. The team should confirm whether the requested visit is available, what it involves, and any applicable requirements before an arrangement is agreed.",
  },
  {
    category: "Services",
    question: "Is home healthcare suitable for every medical condition?",
    answer:
      "No. Some symptoms and conditions require assessment or treatment in a medical facility. Home healthcare should not replace emergency care or instructions from a treating clinician.",
  },
  {
    category: "Fees & Availability",
    question: "How much does home healthcare cost?",
    answer:
      "Charges may depend on the type of service and the agreed arrangement. Ask   to confirm the applicable fee and any additional costs before deciding to proceed.",
  },
  {
    category: "Fees & Availability",
    question: "Is service availability guaranteed after I enquire?",
    answer:
      "No. An enquiry does not itself confirm service availability or a booking. Wait for the relevant service details and arrangement to be explicitly confirmed.",
  },
  {
    category: "Fees & Availability",
    question: "Can I request a particular date or time?",
    answer:
      "You can explain your preferred date and time when making an enquiry. The team should confirm whether the requested timing can be accommodated; it should not be assumed to be available.",
  },
  {
    category: "Preparing for Care",
    question: "What should I prepare before a visit?",
    answer:
      "Preparation depends on the service arranged. Ask which documents, instructions, equipment, or practical arrangements are relevant to your particular visit.",
  },
  {
    category: "Preparing for Care",
    question: "Should I keep hospital discharge instructions?",
    answer:
      "If the patient has recently left hospital, keep the discharge plan and relevant instructions available when appropriate. Home support should not replace or contradict the treating team's instructions.",
  },
  {
    category: "Preparing for Care",
    question: "What if the patient's needs change?",
    answer:
      "Tell the team about relevant changes before relying on the existing arrangement. If the situation appears urgent or potentially life-threatening, seek emergency medical assistance rather than waiting for a reply.",
  },
];

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState("All Questions");
  const [search, setSearch] = useState("");
  const [openQuestion, setOpenQuestion] = useState(0);

  const filteredQuestions = useMemo(() => {
    const term = search.trim().toLowerCase();

    return questions.filter((item) => {
      const matchesCategory =
        activeCategory === "All Questions" ||
        item.category === activeCategory;

      const matchesSearch =
        !term ||
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#24304f]">
      {/* ===================================================== */}
      {/* HERO SECTION (UPDATED)                                */}
      {/* ===================================================== */}
      <section className="relative isolate flex min-h-[400px] items-center justify-center overflow-hidden sm:min-h-[500px] lg:min-h-[600px]">
        {/* Background Image */}
        <Image
          src="/images/faqs-header.png"
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
              Frequently Asked Questions
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

              <span className="text-[#0f1681]">FAQS</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* HERO CONTENT (Search + Intro, placed below header)    */}
      {/* ===================================================== */}
      <section className="bg-gradient-to-br from-white via-white to-[#eff9f7] px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8ebff] text-[#0f1681]">
              <CircleHelp size={31} />
            </div>

            <span className="mt-6 inline-block text-xs uppercase tracking-[0.2em] text-[#4754ff]">
              Help & Information
            </span>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              Find helpful information about enquiries, services, fees, and
              preparing for home healthcare.
            </p>
          </motion.div>

          {/* SEARCH */}
          <div className="mx-auto mt-9 flex max-w-2xl items-center gap-3 rounded-2xl border border-[#e8ebff] bg-white px-5 py-4 shadow-lg shadow-indigo-900/5 focus-within:border-[#4754ff]">
            <Search className="shrink-0 text-[#4754ff]" size={21} />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setOpenQuestion(0);
              }}
              placeholder="Search your question..."
              aria-label="Search frequently asked questions"
              className="w-full bg-transparent text-sm text-[#24304f] outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FAQ CONTENT                                           */}
      {/* ===================================================== */}
      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
          {/* FILTERS */}
          <aside>
            <h2 className="text-lg text-[#0f1681]">
              Browse by topic
            </h2>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category);
                    setOpenQuestion(0);
                  }}
                  className={`shrink-0 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    activeCategory === category
                      ? "bg-[#0f1681] text-white shadow-lg shadow-indigo-900/10"
                      : "bg-[#f4f6ff] text-gray-600 hover:bg-[#e8ebff] hover:text-[#0f1681]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-7 hidden rounded-2xl bg-[#eff9f7] p-5 lg:block">
              <MessageCircle className="text-[#0f1681]" size={26} />
              <h3 className="mt-4 text-[#0f1681]">
                Need more information?
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                If you cannot find an answer, contact the team about your
                specific enquiry.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4754ff] hover:text-[#0f1681]"
              >
                Contact Us <ArrowRight size={15} />
              </Link>
            </div>
          </aside>

          {/* ACCORDION */}
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl text-[#0f1681] sm:text-2xl">
                {activeCategory === "All Questions"
                  ? "Common questions"
                  : activeCategory}
              </h2>
              <span className="rounded-full bg-[#f4f6ff] px-3 py-1.5 text-xs font-semibold text-[#4754ff]">
                {filteredQuestions.length} questions
              </span>
            </div>

            <div className="space-y-3">
              {filteredQuestions.map((item, index) => {
                const isOpen = openQuestion === index;

                return (
                  <motion.article
                    layout
                    key={item.question}
                    className={`overflow-hidden rounded-2xl border transition-colors ${
                      isOpen
                        ? "border-[#cbd0ff] bg-white shadow-lg shadow-indigo-900/5"
                        : "border-[#e8ebff] bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenQuestion(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                    >
                      <span className="text-base font-semibold leading-7 text-[#0f1681]">
                        {item.question}
                      </span>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                          isOpen
                            ? "bg-[#0f1681] text-white"
                            : "bg-[#f4f6ff] text-[#0f1681]"
                        }`}
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-6 sm:px-6">
                            <div className="mb-4 h-px bg-[#edf0ff]" />
                            <p className="text-sm leading-7 text-gray-600">
                              {item.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                );
              })}

              {filteredQuestions.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#cbd0ff] bg-[#f8f9ff] px-5 py-12 text-center">
                  <Search
                    className="mx-auto text-[#4754ff]"
                    size={28}
                  />
                  <h3 className="mt-4 text-[#0f1681]">
                    No matching questions
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Try a different search term or select another category.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setActiveCategory("All Questions");
                      setOpenQuestion(0);
                    }}
                    className="mt-4 text-sm font-semibold text-[#4754ff] hover:text-[#0f1681]"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* BOTTOM CTA                                            */}
      {/* ===================================================== */}
      <section className="bg-[#f4f6ff] px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-[#0f1681] px-6 py-10 text-center text-white sm:px-12 sm:py-14">
          <ShieldCheck className="mx-auto" size={34} />
          <h2 className="mt-5 text-3xl sm:text-4xl">
            Still Have Questions?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/80">
            Get in touch to ask about your specific needs, the proposed
            service, availability, and applicable fees.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0f1681] transition hover:bg-[#e8ebff]"
          >
            Contact   <ArrowRight size={17} />
          </Link>
        </div>
        <p className="mx-auto mt-6 max-w-5xl text-sm leading-6 text-gray-500">
          For a potentially life-threatening emergency, contact local
          emergency services or go to the nearest emergency department.
          Do not wait for an online response.
        </p>
      </section>
    </main>
  );
}
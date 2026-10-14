
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  HeartHandshake,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "How It Works", href: "/how-it-works" },
];

const supportLinks = [
  { label: "Frequently Asked Questions", href: "/faqs" },
  { label: "Contact Us", href: "/contact" },
  { label: "Enquire About Care", href: "/contact" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

function LogoMark() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 34 34"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M17 6.5C17 6.5 21.5 2 26 6.5C30.5 11 26 17 26 17C26 17 30.5 23 26 27.5C21.5 32 17 27.5 17 27.5C17 27.5 12.5 32 8 27.5C3.5 23 8 17 8 17C8 17 3.5 11 8 6.5C12.5 2 17 6.5 17 6.5Z"
        stroke="#4754ff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="17" cy="17" r="4" fill="#4754ff" />
    </svg>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <a
        href={href}
        className="group inline-flex items-center gap-1.5 text-sm text-white/65 transition-colors duration-200 hover:text-[#3DCF8E]"
      >
        <span>{children}</span>
        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
      </a>
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#0f1681] text-white">
      {/* Decorative background elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full border border-white/[0.06]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/[0.06]"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 pb-7 pt-14 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20">
        {/* Main footer grid */}
        <motion.div
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.85fr_0.9fr_1fr] lg:gap-12"
        >
          {/* Brand column */}
          <motion.div variants={fadeUp} className="lg:pr-8">
            <a
              href="/"
              aria-label="  home"
              className="mb-5 inline-flex items-center gap-2.5"
            >
              <LogoMark />
              <span className="text-[27px]   tracking-tight text-white">
                 
              </span>
            </a>

            <p className="mb-6 max-w-sm text-sm leading-7 text-white/65">
              Helping individuals and families explore home healthcare with
              clear information, respectful communication, and an understanding
              of their care needs.
            </p>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-[#3DCF8E]" />
              <p className="text-sm leading-6 text-white/75">
                Care should begin with listening, understanding, and respect.
              </p>
            </div>
          </motion.div>

          {/* Contact column */}
          <motion.div variants={fadeUp}>
            <h3 className="mb-5 text-sm   uppercase tracking-[0.15em] text-white">
              Get in Touch
            </h3>

            <p className="mb-5 max-w-xs text-sm leading-6 text-white/60">
              Have questions about home healthcare? Get in touch through our
              enquiry section.
            </p>

            <a
              href="/#contact"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#3DCF8E] transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4" />
              Send an Enquiry
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            <div className="mt-5 flex items-start gap-2.5 text-sm leading-6 text-white/60">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#3DCF8E]" />
              <span>
                Please contact us to discuss service availability in your area.
              </span>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div variants={fadeUp}>
            <h3 className="mb-5 text-sm   uppercase tracking-[0.15em] text-white">
              Explore
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </motion.div>

          {/* Support links */}
          <motion.div variants={fadeUp}>
            <h3 className="mb-5 text-sm   uppercase tracking-[0.15em] text-white">
              Helpful Links
            </h3>

            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>

            <div className="mt-7 flex items-start gap-2.5 rounded-xl bg-white/[0.05] p-3.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#3DCF8E]" />
              <p className="text-xs leading-5 text-white/60">
                Every care enquiry should be handled with consideration for
                individual needs and privacy.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-white/55 sm:mt-16 sm:flex-row sm:items-center sm:justify-between sm:text-sm"
        >
          <p>
            © {new Date().getFullYear()}  . All rights reserved.
          </p>

          <p className="max-w-xl leading-5 sm:text-right">
            Home healthcare information is not a substitute for emergency
            medical care.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

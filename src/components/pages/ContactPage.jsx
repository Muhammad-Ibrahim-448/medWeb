"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  HeartHandshake,
  CircleAlert,
} from "lucide-react";

const services = [
  "General enquiry",
  "Nursing care at home",
  "Doctor visit at home",
  "Physiotherapy at home",
  "Post-hospital recovery support",
  "Elderly care and daily living assistance",
  "Sample collection and diagnostic support",
  "Ongoing support at home",
  "Other",
];

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  service: "",
  location: "",
  message: "",
  consent: false,
};

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ContactDetail({ icon: Icon, title, description, href }) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#8ff0ce]">
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-white/70">
          {description}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block transition hover:opacity-80">
        {content}
      </a>
    );
  }

  return content;
}

function Field({ label, name, value, onChange, error, ...props }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-[#0f1681]"
      >
        {label}
        {props.required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
        className={`min-h-[50px] w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#24304f] outline-none transition placeholder:text-gray-400 focus:border-[#4754ff] focus:ring-4 focus:ring-[#4754ff]/10 ${
          error ? "border-red-400" : "border-[#e2e7f7]"
        }`}
      />

      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSubmitted(false);
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName = "Please enter your first name.";
    }

    if (!form.lastName.trim()) {
      nextErrors.lastName = "Please enter your last name.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (form.phone.trim() && !/^[+\d\s().-]{7,20}$/.test(form.phone)) {
      nextErrors.phone = "Please enter a valid phone number.";
    }

    if (!form.service) {
      nextErrors.service = "Please select an enquiry type.";
    }

    if (!form.message.trim()) {
      nextErrors.message = "Please describe your enquiry.";
    } else if (form.message.trim().length < 10) {
      nextErrors.message = "Please enter at least 10 characters.";
    }

    if (!form.consent) {
      nextErrors.consent = "Please confirm that we may use your details to respond.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    /*
      BACKEND INTEGRATION:
      Connect this handler to your API route or email service.
      Do not display a success message until the server confirms receipt.
    */

    setSubmitting(true);

    try {
      // Example integration:
      // const response = await fetch("/api/contact", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });
      //
      // if (!response.ok) {
      //   throw new Error("Unable to submit your enquiry.");
      // }

      // Remove this demonstration block when connecting your API.
      await new Promise((resolve) => setTimeout(resolve, 400));

      setSubmitted(true);
      setForm(initialForm);
      setErrors({});
    } catch {
      setErrors({
        form: "We could not submit your enquiry. Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="overflow-hidden bg-white text-[#24304f]">
      {/* ===================================================== */}
      {/* HERO SECTION (UPDATED)                                */}
      {/* ===================================================== */}
      <section className="relative isolate flex min-h-[400px] items-center justify-center overflow-hidden sm:min-h-[500px] lg:min-h-[600px]">
        {/* Background Image */}
        <Image
          src="/images/contact-us-header.png"
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
              Contact Us
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

              <span className="text-[#0f1681]">CONTACT US</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CONTACT CONTENT                                       */}
      {/* ===================================================== */}
      <section className="px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-16 lg:px-10 lg:pb-24 lg:pt-20">
        <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          {/* CONTACT INFORMATION */}
          <Reveal className="overflow-hidden rounded-[2rem] bg-[#0f1681] text-white">
            <div className="relative overflow-hidden p-7 sm:p-9 lg:p-10">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#4754ff]/30 blur-3xl" />
              <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[#3DCF8E]/10 blur-3xl" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#8ff0ce]">
                  <HeartHandshake size={27} />
                </div>

                <h2 className="mt-6 text-2xl sm:text-3xl">
                  Get in Touch
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/70">
                  Tell us what you need help with. We can clarify the
                  information needed to understand your enquiry.
                </p>

                <div className="mt-9 space-y-7">
                  <ContactDetail
                    icon={MessageCircle}
                    title="General enquiries"
                    description="Use the contact form to describe your request."
                  />

                  <ContactDetail
                    icon={ShieldCheck}
                    title="Clear information"
                    description="Ask about the service scope, availability, and applicable fees."
                  />

                  <ContactDetail
                    icon={Clock}
                    title="Response time"
                    description="Response times have not been specified. Please do not assume an immediate reply or confirmed booking."
                  />
                </div>

                <div className="my-8 h-px bg-white/15" />

                <h3 className="font-semibold text-white">
                  Explore  
                </h3>

                <div className="mt-4 space-y-3">
                  <Link
                    href="/services"
                    className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10"
                  >
                    Our Services <ArrowRight size={16} />
                  </Link>

                  <Link
                    href="/how-it-works/our-approach"
                    className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10"
                  >
                    Our Approach <ArrowRight size={16} />
                  </Link>

                  <Link
                    href="/faqs"
                    className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10"
                  >
                    Frequently Asked Questions <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="mt-8 rounded-2xl border border-amber-200/20 bg-amber-300/10 p-4">
                  <div className="flex items-start gap-3">
                    <CircleAlert
                      size={21}
                      className="mt-0.5 shrink-0 text-amber-200"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Need urgent medical help?
                      </h3>
                      <p className="mt-2 text-xs leading-6 text-white/75">
                        This contact form is not an emergency service. For a
                        potentially life-threatening emergency, contact local
                        emergency services or go to the nearest emergency
                        department. Do not wait for an online response.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* CONTACT FORM */}
          <Reveal delay={0.1}>
            <div className="rounded-[2rem] border border-[#e8ebff] bg-white p-6 shadow-xl shadow-indigo-900/[0.04] sm:p-9 lg:p-10">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#4754ff]">
                  Contact form
                </span>

                <h2 className="mt-3 text-2xl text-[#0f1681] sm:text-3xl">
                  Send Us an Enquiry
                </h2>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  Fields marked with an asterisk are required. Please avoid
                  including sensitive medical records or unnecessary
                  confidential information.
                </p>
              </div>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4"
                    role="status"
                  >
                    <CheckCircle2
                      size={21}
                      className="mt-0.5 shrink-0 text-amber-700"
                    />
                    <div>
                      <p className="font-semibold text-amber-900">
                        Demo submission completed
                      </p>
                      <p className="mt-1 text-sm leading-6 text-amber-800">
                        This form is not connected to a server yet. Your
                        enquiry has not been sent to  .
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {errors.form && (
                <p role="alert" className="mt-5 text-sm text-red-600">
                  {errors.form}
                </p>
              )}

              <form onSubmit={handleSubmit} noValidate className="mt-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="First Name"
                    name="firstName"
                    placeholder="Enter first name"
                    value={form.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    autoComplete="given-name"
                    required
                  />

                  <Field
                    label="Last Name"
                    name="lastName"
                    placeholder="Enter last name"
                    value={form.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    autoComplete="family-name"
                    required
                  />

                  <Field
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    autoComplete="email"
                    required
                  />

                  <Field
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number (optional)"
                    value={form.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    autoComplete="tel"
                  />

                  {/* SERVICE SELECT */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="service"
                      className="mb-2 block text-sm font-semibold text-[#0f1681]"
                    >
                      What can we help you with?
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <select
                        id="service"
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.service)}
                        className={`min-h-[50px] w-full appearance-none rounded-xl border bg-white px-4 py-3 pr-11 text-sm text-[#24304f] outline-none transition focus:border-[#4754ff] focus:ring-4 focus:ring-[#4754ff]/10 ${
                          errors.service
                            ? "border-red-400"
                            : "border-[#e2e7f7]"
                        }`}
                        required
                      >
                        <option value="">Select an enquiry type</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={18}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                    </div>

                    {errors.service && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.service}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Field
                      label="City or Area"
                      name="location"
                      placeholder="Where is support needed? (optional)"
                      value={form.location}
                      onChange={handleChange}
                      autoComplete="address-level2"
                    />
                  </div>

                  {/* MESSAGE */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-semibold text-[#0f1681]"
                    >
                      Your Message
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      maxLength={2000}
                      placeholder="Briefly describe the support you are looking for..."
                      aria-invalid={Boolean(errors.message)}
                      className={`w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm leading-7 text-[#24304f] outline-none transition placeholder:text-gray-400 focus:border-[#4754ff] focus:ring-4 focus:ring-[#4754ff]/10 ${
                        errors.message
                          ? "border-red-400"
                          : "border-[#e2e7f7]"
                      }`}
                      required
                    />

                    <div className="mt-1 flex items-center justify-between gap-3">
                      {errors.message ? (
                        <p className="text-xs text-red-600">
                          {errors.message}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">
                          Please do not include sensitive medical records.
                        </p>
                      )}

                      <span className="shrink-0 text-xs text-gray-400">
                        {form.message.length}/2000
                      </span>
                    </div>
                  </div>
                </div>

                {/* CONSENT */}
                <div className="mt-6">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={form.consent}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 shrink-0 accent-[#0f1681]"
                    />
                    <span className="text-sm leading-6 text-gray-600">
                      I agree that   may use the details I have provided
                      to respond to this enquiry.
                      <span className="ml-1 text-red-500">*</span>
                    </span>
                  </label>

                  {errors.consent && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.consent}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-7 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#0f1681] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/10 transition hover:-translate-y-0.5 hover:bg-[#4754ff] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[190px]"
                >
                  {submitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Send Enquiry <Send size={16} />
                    </>
                  )}
                </button>

                <p className="mt-4 text-xs leading-6 text-gray-500">
                  Sending an enquiry does not confirm service availability,
                  an appointment, or a booking.
                </p>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BOTTOM SECTION */}
      <section className="bg-[#f4f6ff] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <Reveal className="mx-auto max-w-5xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0f1681] shadow-sm">
            <HeartHandshake size={27} />
          </div>

          <h2 className="mt-5 text-3xl text-[#0f1681] sm:text-4xl">
            Learn More About  
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            Explore our approach and read common questions before sending
            your enquiry.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/how-it-works/our-approach"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0f1681] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4754ff]"
            >
              Our Approach <ArrowRight size={16} />
            </Link>

            <Link
              href="/faqs"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#dfe3ff] bg-white px-6 py-3 text-sm font-semibold text-[#0f1681] transition hover:bg-[#e8ebff]"
            >
              Read FAQs <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
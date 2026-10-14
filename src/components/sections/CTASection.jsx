
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactSection() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    service: "",
    location: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Connect this handler to your backend or form service.
    console.log("Home healthcare enquiry:", form);
  };

  const inputClass =
    "h-[50px] w-full rounded-none border border-[#E1E4E8] bg-white px-5 text-[14px] text-[#343A40] outline-none transition-colors placeholder:text-[#55585B] focus:border-[#5965FF]";

  return (
    <section
      id="contact"
      className="relative isolate w-full overflow-hidden bg-[#ECFCF5] font-sans text-[#07172E]"
    >
      {/* Decorative curved lines — bottom left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[235px] -left-[330px] z-0 h-[430px] w-[430px] sm:-bottom-[260px] sm:-left-[330px] sm:h-[500px] sm:w-[500px] lg:-bottom-[285px] lg:-left-[320px] lg:h-[540px] lg:w-[540px]"
      >
        <svg
          viewBox="0 0 500 500"
          fill="none"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <circle cx="0" cy="500" r="500" stroke="#171C86" strokeWidth="2" />
          <circle cx="0" cy="500" r="465" stroke="#171C86" strokeWidth="2" />
          <circle cx="0" cy="500" r="430" stroke="#171C86" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-[100px] xl:px-16">
        <div className="grid grid-cols-1 items-center gap-10 md:gap-12 lg:grid-cols-[1fr_1.08fr] lg:gap-16 xl:gap-[100px]">
          {/* LEFT: Contact information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mx-auto w-full max-w-[540px] lg:mx-0"
          >
            <p className="mb-5 text-[13px] font-normal uppercase tracking-[0.22em] text-[#5965FF] sm:text-[15px]">
              Our Contact
            </p>

            <h2 className="mb-6 text-[34px] font-normal leading-[1.15] tracking-[-0.035em] text-[#07172E] sm:text-[42px] lg:text-[46px]">
              Let&apos;s Talk About Your Care Needs
            </h2>

            <p className="mb-10 max-w-[540px] text-[14px] leading-[1.85] text-[#52585A] sm:text-[15px]">
              Tell us what kind of support you are looking for and where it is
              needed. We can explain the enquiry process and confirm whether
              a suitable service may be available in your area.
            </p>

            <div className="mb-7 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5">
              <div className="flex items-start gap-5">
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center bg-[#5965FF] text-white">
                  <Phone size={13} strokeWidth={1.5} />
                </div>

                <div className="min-w-0 pt-[5px]">
                  <p className="mb-1 text-[13px] font-normal uppercase text-[#17263A]">
                    Phone
                  </p>
                  <p className="text-[14px] leading-6 text-[#555B5D] sm:text-[15px]">
                    Contact details to be confirmed
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center bg-[#5965FF] text-white">
                  <Mail size={13} strokeWidth={1.5} />
                </div>

                <div className="min-w-0 pt-[5px]">
                  <p className="mb-1 text-[13px] font-normal uppercase text-[#17263A]">
                    Email
                  </p>
                  <p className="break-words text-[14px] leading-6 text-[#555B5D] sm:text-[15px]">
                    Email address to be confirmed
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 border-t border-[#DDECE5] pt-5">
              <MapPin
                size={19}
                className="mt-1 shrink-0 text-[#5965FF]"
              />
              <div>
                <h3 className="mb-1 text-[13px] font-normal uppercase text-[#17263A]">
                  Service Area
                </h3>
                <p className="text-[14px] leading-6 text-[#555B5D] sm:text-[15px]">
                  Share your city or area so service availability can be
                  checked before an arrangement is confirmed.
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
            className="w-full"
          >
            <form
              onSubmit={handleSubmit}
              className="mx-auto w-full max-w-[560px] bg-white px-6 py-7 sm:px-8 sm:py-8 lg:px-[40px] lg:py-[34px]"
            >
              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-[13px] text-[#152238]"
                  >
                    First Name <span>*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    autoComplete="given-name"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-[13px] text-[#152238]"
                  >
                    Last Name <span>*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    autoComplete="family-name"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="mb-2 block text-[13px] text-[#152238]"
                >
                  Email Address <span>*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="service"
                  className="mb-2 block text-[13px] text-[#152238]"
                >
                  What Support Are You Looking For?
                </label>
                <select
                  id="service"
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className={`${inputClass} ${
                    form.service ? "" : "text-[#55585B]"
                  }`}
                >
                  <option value="">Select a service</option>
                  <option value="Nursing Care at Home">
                    Nursing Care at Home
                  </option>
                  <option value="Doctor Visits at Home">
                    Doctor Visits at Home
                  </option>
                  <option value="Physiotherapy at Home">
                    Physiotherapy at Home
                  </option>
                  <option value="Post-Hospital Recovery Support">
                    Post-Hospital Recovery Support
                  </option>
                  <option value="Elderly Care and Daily Living Assistance">
                    Elderly Care and Daily Living Assistance
                  </option>
                  <option value="Sample Collection at Home">
                    Sample Collection at Home
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="location"
                  className="mb-2 block text-[13px] text-[#152238]"
                >
                  City or Area <span>*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter your city or area"
                  autoComplete="address-level2"
                  required
                  className={inputClass}
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="message"
                  className="mb-2 block text-[13px] text-[#152238]"
                >
                  Brief Description of Your Request <span>*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us briefly what support you are looking for"
                  rows={4}
                  required
                  className="block min-h-[100px] w-full resize-y rounded-none border border-[#E1E4E8] bg-white px-5 py-4 text-[14px] text-[#343A40] outline-none transition-colors placeholder:text-[#55585B] focus:border-[#5965FF]"
                />
              </div>

              <p className="mb-5 text-xs leading-5 text-gray-500">
                Please do not include detailed medical records or other
                sensitive health information in this form.
              </p>

              <motion.button
                type="submit"
                whileHover={{ backgroundColor: "#252DA0" }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex h-[47px] min-w-[156px] items-center justify-center rounded-none bg-[#171C86] px-7 text-[13px] font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5965FF]"
              >
                Send Enquiry
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

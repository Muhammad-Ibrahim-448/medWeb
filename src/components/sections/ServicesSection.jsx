
"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  HeartPulse,
  Stethoscope,
  Activity,
  House,
  UserRound,
  TestTube,
} from "lucide-react";

const services = [
  {
    title: "Nursing Care at Home",
    description:
      "A home nursing visit may be an option when the requested task is appropriate for a home setting and within the nurse's professional scope.",
    icon: HeartPulse,
    href: "/services/home-nursing/",
  },
  {
    title: "Doctor Visits at Home",
    description:
      "For some concerns, a doctor may be able to assess a patient at home. Suitability and availability must be confirmed.",
    icon: Stethoscope,
    href: "/services/doctor-home-visit/",
  },
  {
    title: "Physiotherapy at Home",
    description:
      "Movement, mobility, and rehabilitation support when a qualified physiotherapist determines that home sessions are appropriate.",
    icon: Activity,
    href: "/services/home-physiotherapy/",
  },
  {
    title: "Post-Hospital Recovery Support",
    description:
      "Explore follow-up support after hospital discharge, subject to the care plan and the services available.",
    icon: House,
    href: "/services/post-hospital-recovery/",
  },
  {
    title: "Elderly Care and Daily Assistance",
    description:
      "Explore help with agreed everyday activities, with clear boundaries between non-clinical assistance and clinical care.",
    icon: UserRound,
    href: "/services/elderly-care-at-home/",
  },
  {
    title: "Sample Collection at Home",
    description:
      "Ask about home sample collection, including test availability, laboratory requirements, charges, and result delivery.",
    icon: TestTube,
    href: "/services/home-sample-collection/",
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-[#4754ff]">
            Our Services
          </p>

          <h2 className="text-4xl leading-tight tracking-tight text-[#0f1681] sm:text-5xl lg:text-[56px]">
            Explore the Type of Support You Are Looking For.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-gray-500">
            The kind of support that works for one person may not be
            right for another. The services available depend on the
            confirmed offering, qualified workforce, equipment, location,
            and the person's circumstances.
          </p>
        </motion.div>

        {/* SERVICES GRID */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="group relative flex flex-col items-center border border-gray-200 bg-white p-10 text-center transition-all duration-300 hover:border-[#4754ff] sm:p-12"
              >
                {/* ICON */}
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#f4f6ff] transition-colors duration-300 group-hover:bg-[#e8ebff]">
                  <Icon
                    className="h-9 w-9 text-[#0f1681] transition-colors duration-300 group-hover:text-[#4754ff]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>

                {/* TITLE */}
                <h3 className="mb-4 text-2xl font-normal text-[#0f1681]">
                  {service.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="mb-8 max-w-[300px] flex-1 text-base leading-relaxed text-gray-500">
                  {service.description}
                </p>

                {/* PROPOSED STATUS */}
                <p className="mb-5 text-xs leading-relaxed text-gray-500">
                  Proposed service — availability to be confirmed.
                </p>

                {/* LINK */}
                <a
                  href={service.href}
                  className="inline-flex items-center gap-2 text-sm text-[#0f1681] transition-colors duration-300 hover:text-[#4754ff]"
                >
                  View Service Details
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </motion.article>
            );
          })}
        </div>

        {/* CLOSING COPY */}
        <div className="mx-auto mt-14 max-w-3xl text-center">
          <p className="mb-7 text-base leading-relaxed text-gray-500">
            Before a visit is arranged, we will explain the agreed
            service, availability, applicable charges, and any preparation
            or limitations you should know about.
          </p>

          <a
            href="#contact"
            className="inline-flex min-h-12 items-center justify-center bg-[#0f1681] px-7 py-4 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#4754ff]"
          >
            Ask About Availability
          </a>
        </div>
      </div>
    </section>
  );
}

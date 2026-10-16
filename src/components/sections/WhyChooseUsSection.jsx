
"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  HeartHandshake,
  CircleDollarSign,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Image from "next/image";

const features = [
  {
    title: "Clear Service Information",
    description:
      "Understand what a service includes, which professional role is involved, and what its important limitations may be before making a decision.",
    icon: ClipboardCheck,
  },
  {
    title: "Respect for Every Person",
    description:
      "Care enquiries should be handled respectfully. The preferences, consent, and privacy of the person receiving care matter.",
    icon: HeartHandshake,
  },
  {
    title: "Charges Explained in Advance",
    description:
      "Fees may depend on the service, location, duration, and agreed requirements. Applicable charges should be explained before confirmation.",
    icon: CircleDollarSign,
  },
  {
    title: "Appropriate Professional Roles",
    description:
      "Clinical care must be provided by appropriately qualified professionals within their authorized scope. Non-clinical support should be described honestly.",
    icon: UserCheck,
  },
  {
    title: "Honest Availability",
    description:
      "Service availability depends on the requested support and location. Details should be checked before an arrangement is confirmed.",
    icon: ShieldCheck,
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-[#4754ff]">
              Why Choose Us
            </p>

            <h2 className="mb-6 text-4xl leading-[1.15] tracking-tight text-[#0f1681] sm:text-5xl lg:text-[52px]">
              Clear Information. Respectful Communication. Defined Expectations.
            </h2>

            <p className="mb-8 text-base leading-7 text-gray-600">
              Choosing home healthcare deserves clear answers. You should be
              able to understand what is being offered, who is responsible for
              the service, what it costs, and what happens if your request falls
              outside the agreed arrangement.
            </p>

            <div className="space-y-5">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="flex gap-5 border border-gray-200 bg-white p-5 transition-colors duration-300 hover:border-[#4754ff] sm:p-6"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f4f6ff]">
                      <Icon className="h-5 w-5 text-[#0f1681]" strokeWidth={1.5} />
                    </div>

                    <div>
                      <h3 className="mb-2 text-xl font-normal text-[#0f1681]">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-500 sm:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto w-full max-w-[520px] lg:mx-0"
          >
            <div className="absolute -right-6 -top-6 z-0 hidden h-full w-full bg-[#f4f6ff] lg:block" />

            <div className="relative z-10 aspect-[3/4] w-full">
              <Image
                src="/images/clear-information-image.png"
                alt="Caregiver speaking with an older adult"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-6 left-0 z-20 flex items-center gap-4 bg-white p-5 shadow-[0_20px_50px_rgba(15,22,129,0.15)] lg:-left-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-[#e8ebff]">
                <HeartHandshake className="h-6 w-6 text-[#0f1681]" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-lg font-normal text-[#0f1681]">
                  Clear Before You Decide
                </h4>
                <p className="text-sm text-gray-500">
                  Understand the next steps
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

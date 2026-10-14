
import HeroSection from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { OurPlaceSection } from "@/components/sections/OurPlaceSection";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import BlogSection from "@/components/sections/BlogSection";
import ConsultationSection from "@/components/sections/ConsultationSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";

export const metadata = {
  title: "Home Healthcare Services in [Service Area] | [Brand Name]",
  description:
    "Explore home healthcare options in [Service Area]. Learn which services may be available, what to expect, and how to enquire with [Brand Name].",
};

export default function HomePage() {
  return (
    <main className="bg-white text-[#171717]">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <OurPlaceSection />
      <WhyChooseUsSection />
      <BlogSection />
      <ConsultationSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}

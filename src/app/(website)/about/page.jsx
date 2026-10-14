
import AboutPageContent from "@/components/pages/AboutPageContent";

export const metadata = {
  title: "About [Brand Name] | Home Healthcare in [Service Area]",
  description:
    "Learn about [Brand Name] and our proposed approach to clear communication, patient dignity, and appropriate home healthcare in [Service Area].",
  alternates: {
    canonical: "/about/",
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}

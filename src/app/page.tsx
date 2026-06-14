import type { Metadata } from "next";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

export const metadata: Metadata = {
  title: "Physics Fundamentals – Learn Physics from Basics to Advanced Concepts",
  description: "Master physics with easy-to-understand notes, formulas, tutorials, solved examples, and in-depth guides on mechanics, waves, thermodynamics, electricity, optics, and modern physics.",
  alternates: {
    canonical: "/",
  },
};
import dynamic from "next/dynamic";
import HeroSection from "@components/sections/HeroSection";

const FeaturesSection = dynamic(() => import("@components/sections/FeaturesSection"));
const HowItWorksSection = dynamic(() => import("@components/sections/HowItWorksSection"));
const CurriculumSection = dynamic(() => import("@components/sections/CurriculumSection"));
const WaitlistSection = dynamic(() => import("@components/sections/WaitlistSection"));
const LatestArticlesSection = dynamic(() => import("@components/sections/LatestArticlesSection"));
const WhatAreFundamentalsSection = dynamic(() => import("@components/sections/WhatAreFundamentalsSection"));
const FAQSection = dynamic(() => import("@components/sections/FAQSection"));
const EarlyAccessSection = dynamic(() => import("@components/sections/EarlyAccessSection"));
const ExploreSection = dynamic(() => import("@components/sections/ExploreSection"));

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-[#f8fafc]">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CurriculumSection />
        <WaitlistSection />
        <LatestArticlesSection />
        <WhatAreFundamentalsSection />
        <FAQSection />
        <EarlyAccessSection />
        <ExploreSection />
      </main>
      <Footer />
    </div>
  );
}


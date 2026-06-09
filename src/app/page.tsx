import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import HeroSection from "@components/sections/HeroSection";
import FeaturesSection from "@components/sections/FeaturesSection";
import HowItWorksSection from "@components/sections/HowItWorksSection";
import CurriculumSection from "@components/sections/CurriculumSection";
import WaitlistSection from "@components/sections/WaitlistSection";
import LatestArticlesSection from "@components/sections/LatestArticlesSection";
import WhatAreFundamentalsSection from "@components/sections/WhatAreFundamentalsSection";
import FAQSection from "@components/sections/FAQSection";
import EarlyAccessSection from "@components/sections/EarlyAccessSection";
import ExploreSection from "@components/sections/ExploreSection";

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

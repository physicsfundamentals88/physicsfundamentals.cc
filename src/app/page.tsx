import type { Metadata } from "next";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

export const metadata: Metadata = {
  title: "PhysicsLab – Interactive Physics Simulations & Visual Learning",
  description: "Explore Newtonian gravity, pendulum dynamics, wave interference, and orbital mechanics in real-time. Interactive simulations make visual physics learning engaging and accessible.",
  alternates: {
    canonical: "/",
  },
};
import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { desc, ne, and } from "drizzle-orm";
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

export default async function Home() {
  let latestArticles: any[] = [];
  try {
    const db = getDb();
    latestArticles = await db
      .select()
      .from(articles)
      .where(
        and(
          ne(articles.status, "Draft"),
          ne(articles.status, "draft")
        )
      )
      .orderBy(desc(articles.createdAt))
      .limit(3);
  } catch (error) {
    console.error("Failed to fetch latest articles for home page:", error);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-[#f8fafc]">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CurriculumSection />
        <WaitlistSection />
        <LatestArticlesSection dbArticles={latestArticles} />
        <WhatAreFundamentalsSection />
        <FAQSection />
        <EarlyAccessSection />
        <ExploreSection />
      </main>
      <Footer />
    </div>
  );
}

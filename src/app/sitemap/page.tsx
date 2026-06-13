import type { Metadata } from "next";
import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { desc, ne, and } from "drizzle-orm";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import React from "react";
import Breadcrumbs from "@components/Breadcrumbs";

export const metadata: Metadata = {
  title: "HTML Sitemap | PhysicsLab",
  description: "Browse the HTML sitemap of PhysicsLab to discover all our interactive physics simulations, step-by-step solvers, topic hubs, and educational articles.",
  alternates: {
    canonical: "/sitemap",
  },
};

const staticPages = [
  { name: "Homepage", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "Interactive Simulations", href: "/simulations" },
  { name: "Physics Calculators", href: "/calculators" },
  { name: "Physics Blog", href: "/blog" },
  { name: "Platform Roadmap", href: "/roadmap" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms-conditions" },
  { name: "Disclaimer", href: "/disclaimer" }
];

const categoryHubs = [
  { name: "Classical Mechanics Hub", href: "/category/classical-mechanics" },
  { name: "Electromagnetism Hub", href: "/category/electromagnetism" },
  { name: "Thermodynamics Hub", href: "/category/thermodynamics" },
  { name: "Waves & Optics Hub", href: "/category/waves-optics" }
];

const calculators = [
  { name: "Capacitance Calculator", href: "/calculators/capacitance" },
  { name: "Centripetal Force Calculator", href: "/calculators/centripetal-force" },
  { name: "Circular Motion Calculator", href: "/calculators/circular-motion" },
  { name: "Coulomb's Law Calculator", href: "/calculators/coulombs-law" },
  { name: "Doppler Effect Calculator", href: "/calculators/doppler-effect" },
  { name: "Escape Velocity Calculator", href: "/calculators/escape-velocity" },
  { name: "Free Fall Calculator", href: "/calculators/free-fall" },
  { name: "Frequency Calculator", href: "/calculators/frequency" },
  { name: "Gravitational Potential Energy Calculator", href: "/calculators/gravitational-potential-energy" },
  { name: "Ideal Gas Law Calculator", href: "/calculators/ideal-gas-law" },
  { name: "Kinetic Energy Calculator", href: "/calculators/kinetic-energy" },
  { name: "Momentum Calculator", href: "/calculators/momentum" },
  { name: "Newton's Second Law Calculator", href: "/calculators/newtons-second-law" },
  { name: "Ohm's Law Calculator", href: "/calculators/ohms-law" },
  { name: "Pressure & Density Calculator", href: "/calculators/pressure-density" },
  { name: "Projectile Motion Calculator", href: "/calculators/projectile-motion" },
  { name: "Snell's Law Calculator", href: "/calculators/snells-law" },
  { name: "Thermal Expansion Calculator", href: "/calculators/thermal-expansion" },
  { name: "Wave Speed Calculator", href: "/calculators/wave-speed" },
  { name: "Work & Power Calculator", href: "/calculators/work-power" }
];

export default async function HtmlSitemapPage() {
  let publishedArticles: any[] = [];
  try {
    const db = getDb();
    publishedArticles = await db
      .select({ title: articles.title, slug: articles.slug })
      .from(articles)
      .where(
        and(
          ne(articles.status, "Draft"),
          ne(articles.status, "draft")
        )
      )
      .orderBy(desc(articles.createdAt));
  } catch (error) {
    console.error("Failed to query blog posts for HTML sitemap:", error);
  }

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Sitemap", item: "/sitemap" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      <Navbar />

      {/* Header */}
      <div className="pt-[110px] pb-12 bg-white border-b border-slate-100">
        <div className="max-w-[1000px] mx-auto px-6 sm:px-8">
          <Breadcrumbs items={breadcrumbs} themeColor="blue" />
          <h1 
            className="text-[38px] md:text-[46px] leading-[1.1] font-bold text-slate-900 mt-4"
            style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}
          >
            Sitemap
          </h1>
          <p 
            className="text-[16px] text-slate-500 leading-relaxed mt-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            A complete directory of all pages, calculators, simulations, topics, and blog posts published on PhysicsLab. You can also view the XML index at <a href="/sitemap.xml" className="text-blue-600 hover:underline">sitemap.xml</a>.
          </p>
        </div>
      </div>

      {/* Main Sitemap List */}
      <main className="max-w-[1000px] mx-auto px-6 sm:px-8 py-16 flex-1 w-full">
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Section 1: Core Pages */}
          <div className="space-y-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-[18px] font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <span>Core Navigation Pages</span>
                <span className="text-[11px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                  {staticPages.length}
                </span>
              </h2>
              <ul className="space-y-3">
                {staticPages.map(page => (
                  <li key={page.href}>
                    <Link 
                      href={page.href}
                      className="text-[14px] text-slate-600 hover:text-blue-600 transition-colors font-semibold"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 2: Topic Hubs */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-[18px] font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <span>Category Topic Hubs</span>
                <span className="text-[11px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  {categoryHubs.length}
                </span>
              </h2>
              <ul className="space-y-3">
                {categoryHubs.map(hub => (
                  <li key={hub.href}>
                    <Link 
                      href={hub.href}
                      className="text-[14px] text-slate-600 hover:text-blue-600 transition-colors font-semibold"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {hub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 3: Step-by-Step Solvers */}
          <div className="space-y-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-[18px] font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <span>Physics Calculators & Solvers</span>
                <span className="text-[11px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                  {calculators.length}
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-x-4 gap-y-3">
                {calculators.map(calc => (
                  <div key={calc.href}>
                    <Link 
                      href={calc.href}
                      className="text-[13px] text-slate-600 hover:text-indigo-600 transition-colors font-medium block truncate"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {calc.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Blog Articles */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-[18px] font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <span>Physics Articles & Guides</span>
                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                  {publishedArticles.length}
                </span>
              </h2>
              {publishedArticles.length > 0 ? (
                <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {publishedArticles.map(art => (
                    <li key={art.slug}>
                      <Link 
                        href={`/blog/${art.slug}`}
                        className="text-[13px] text-slate-600 hover:text-emerald-600 transition-colors font-medium block truncate"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {art.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13px] text-slate-400" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  No published articles found.
                </p>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

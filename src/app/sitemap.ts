import type { MetadataRoute } from "next";
import { getDb } from "@/db";
import { articles } from "@/db/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://physicslab.app";

  // 1. Core static and category hub pages
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/simulations",
    "/calculators",
    "/blog",
    "/roadmap",
    "/privacy-policy",
    "/terms-conditions",
    "/disclaimer",
    "/category/classical-mechanics",
    "/category/electromagnetism",
    "/category/thermodynamics",
    "/category/waves-optics",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/blog" || route === "/simulations" || route.startsWith("/category/") ? ("daily" as const) : ("monthly" as const),
    priority: route === "" ? 1.0 : route === "/simulations" || route === "/calculators" || route === "/blog" || route.startsWith("/category/") ? 0.9 : 0.7,
  }));

  // 2. Individual calculator pages
  const calculators = [
    "capacitance",
    "centripetal-force",
    "circular-motion",
    "coulombs-law",
    "doppler-effect",
    "escape-velocity",
    "free-fall",
    "frequency",
    "gravitational-potential-energy",
    "ideal-gas-law",
    "kinetic-energy",
    "momentum",
    "newtons-second-law",
    "ohms-law",
    "pressure-density",
    "projectile-motion",
    "snells-law",
    "thermal-expansion",
    "wave-speed",
    "work-power",
  ].map((slug) => ({
    url: `${baseUrl}/calculators/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // 3. Dynamic blog article pages from SQLite D1 DB
  let blogUrls: MetadataRoute.Sitemap = [];
  try {
    const db = getDb();
    const dbArticles = await db.select({ slug: articles.slug, updatedAt: articles.updatedAt }).from(articles);
    blogUrls = dbArticles.map((art) => ({
      url: `${baseUrl}/blog/${art.slug}`,
      lastModified: art.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (e) {
    console.error("Sitemap generation database query failed:", e);
  }

  return [...staticPages, ...calculators, ...blogUrls];
}

import type { Metadata } from "next";
import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { desc, ne, and } from "drizzle-orm";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Physics Fundamentals Blog",
  description: "Read in-depth articles on physics fundamentals covering classical mechanics, electromagnetism, thermodynamics, waves, optics, and kinematics.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  let publishedArticles: any[] = [];
  try {
    const db = getDb();
    publishedArticles = await db
      .select()
      .from(articles)
      .where(
        and(
          ne(articles.status, "Draft"),
          ne(articles.status, "draft")
        )
      )
      .orderBy(desc(articles.createdAt));
  } catch (error) {
    console.error("Fetch Published Articles on Server Error:", error);
  }

  return <BlogClient initialArticles={publishedArticles} />;
}

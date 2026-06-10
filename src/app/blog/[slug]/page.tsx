import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import PostClient from "./PostClient";
import { notFound } from "next/navigation";
import React from "react";

export const runtime = "edge";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch from our new API
  // In a real Cloudflare environment, you might fetch directly from D1
  // but for consistency with the CMS, we'll use a fetch-like pattern or direct DB access
  // Since this is a server component, we can use the DB if we have the env,
  // but to keep it simple and robust across environments, let's fetch from the absolute URL if available
  // or just use the DB directly by assuming env is in process.env
  
  let article = null;
  let latestArticles: any[] = [];

  try {
    const db = getDb();
    const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    article = result[0];

    const latest = await db.select().from(articles).orderBy(desc(articles.createdAt)).limit(5);
    latestArticles = latest.map(a => ({
      title: a.title,
      date: a.date,
      category: a.category,
      href: `/blog/${a.slug}`
    }));
  } catch (e) {
    console.error("Failed to fetch article from DB:", e);
  }

  if (!article) {
    notFound();
  }

  return <PostClient article={article as any} latestArticles={latestArticles} />;
}

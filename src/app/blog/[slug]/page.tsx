import type { Metadata } from "next";
import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import PostClient from "./PostClient";
import { notFound } from "next/navigation";
import React from "react";
import { renderMath } from "@/lib/renderMath";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const db = getDb();
    const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    const article = result[0];
    if (!article) return {};

    const title = article.metaTitle || article.title;
    const description = article.metaDescription || article.excerpt;
    const imageUrl = article.heroImage
      ? (article.heroImage.startsWith("/") ? `https://physicsfundamentals.cc${article.heroImage}` : article.heroImage)
      : "https://physicsfundamentals.cc/og-image.png";

    return {
      title,
      description,
      alternates: {
        canonical: `/blog/${slug}`,
      },
      openGraph: {
        type: "article",
        title,
        description,
        url: `https://physicsfundamentals.cc/blog/${slug}`,
        images: [{ url: imageUrl }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (e) {
    console.error("Failed to generate metadata for blog post:", e);
    return {};
  }
}

import PostPageClient from "./PostPageClient";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PostPageClient slug={slug} />;
}

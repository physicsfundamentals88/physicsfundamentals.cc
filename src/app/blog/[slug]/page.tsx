import type { Metadata } from "next";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import React from "react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    let env: any;
    try {
      env = getCloudflareContext().env;
    } catch {
      env = process.env;
    }

    const db = env?.DB;
    if (!db) return {};

    // Use raw Cloudflare D1 driver (executes instantly, no JavaScript ORM overhead)
    const article: any = await db
      .prepare("SELECT title, meta_title, excerpt, meta_description, hero_image FROM articles WHERE slug = ? LIMIT 1")
      .bind(slug)
      .first();

    if (!article) return {};

    const title = article.meta_title || article.title;
    const description = article.meta_description || article.excerpt;
    const imageUrl = article.hero_image
      ? (article.hero_image.startsWith("/") ? `https://physicsfundamentals.cc${article.hero_image}` : article.hero_image)
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

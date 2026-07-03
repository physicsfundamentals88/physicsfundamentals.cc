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

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
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
      href: `/blog/${a.slug}`,
      heroImage: a.heroImage
    }));
  } catch (e) {
    console.error("Failed to fetch article from DB:", e);
  }

  if (!article) {
    notFound();
  }

  const imageUrl = article.heroImage
    ? (article.heroImage.startsWith("/") ? `https://physicsfundamentals.cc${article.heroImage}` : article.heroImage)
    : "https://physicsfundamentals.cc/og-image.png";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://physicsfundamentals.cc/blog/${slug}`
    },
    "headline": article.title,
    "description": article.excerpt,
    "image": imageUrl,
    "datePublished": article.createdAt ? new Date(article.createdAt).toISOString() : new Date().toISOString(),
    "dateModified": article.updatedAt ? new Date(article.updatedAt).toISOString() : new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": article.author || "Physics Fundamentals Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Physics Fundamentals",
      "logo": {
        "@type": "ImageObject",
        "url": "https://physicsfundamentals.cc/og-image.png"
      }
    }
  };

  // Pre-render math server-side so the client receives plain HTML with KaTeX output
  const renderedContent = article.content ? renderMath(article.content) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostClient
        article={article as any}
        latestArticles={latestArticles}
        renderedContent={renderedContent}
      />
    </>
  );
}

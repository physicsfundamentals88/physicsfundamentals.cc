import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const db = getDb();
    
    // Fetch the specific article
    const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    const article = result[0];
    
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Fetch the 5 latest articles for the sidebar
    const latest = await db.select().from(articles).orderBy(desc(articles.createdAt)).limit(5);
    const latestArticles = latest.map(a => ({
      title: a.title,
      date: a.date,
      category: a.category,
      href: `/blog/${a.slug}`,
      heroImage: a.heroImage
    }));

    return NextResponse.json({ article, latestArticles });
  } catch (error: any) {
    console.error(`Failed to fetch article slug ${slug} in API:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    let env: any;
    try {
      env = getCloudflareContext().env;
    } catch {
      env = process.env;
    }

    const db = env?.DB;
    if (!db) {
      return NextResponse.json({ error: "DB binding not found" }, { status: 500 });
    }
    
    // Fetch the specific article
    const article = await db
      .prepare("SELECT * FROM articles WHERE slug = ? LIMIT 1")
      .bind(slug)
      .first();
    
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Fetch the 5 latest articles for the sidebar
    const { results: latest } = await db
      .prepare("SELECT title, slug, date, category, heroImage FROM articles ORDER BY createdAt DESC LIMIT 5")
      .all();

    const latestArticles = latest.map((a: any) => ({
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

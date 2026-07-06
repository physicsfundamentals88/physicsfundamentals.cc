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
    const article: any = await db
      .prepare("SELECT * FROM articles WHERE slug = ? LIMIT 1")
      .bind(slug)
      .first();
    
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const mappedArticle = {
      ...article,
      sections: typeof article.sections === "string" ? JSON.parse(article.sections) : (article.sections || []),
      toc: typeof article.toc === "string" ? JSON.parse(article.toc) : (article.toc || []),
      readTime: article.read_time,
      authorInitials: article.author_initials,
      authorBg: article.author_bg,
      heroImage: article.hero_image,
      scheduledDate: article.scheduled_date,
      metaTitle: article.meta_title,
      metaDescription: article.meta_description,
      siteName: article.site_name,
      createdAt: article.created_at,
      updatedAt: article.updated_at,
    };

    // Fetch the 5 latest articles for the sidebar
    const { results: latest } = await db
      .prepare("SELECT title, slug, date, category, hero_image FROM articles ORDER BY created_at DESC LIMIT 5")
      .all();

    const latestArticles = latest.map((a: any) => ({
      title: a.title,
      date: a.date,
      category: a.category,
      href: `/blog/${a.slug}`,
      heroImage: a.hero_image
    }));

    return NextResponse.json({ article: mappedArticle, latestArticles });
  } catch (error: any) {
    console.error(`Failed to fetch article slug ${slug} in API:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

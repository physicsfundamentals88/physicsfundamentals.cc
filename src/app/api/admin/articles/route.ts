import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";

export const runtime = "edge";

// GET all articles
export async function GET(request: Request) {
  try {
    const env = (process as any).env;
    const db = getDb(env);
    
    const allArticles = await db.select().from(articles).orderBy(desc(articles.createdAt));
    
    return NextResponse.json(allArticles);
  } catch (error: any) {
    console.error("Fetch Articles Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new article
export async function POST(request: Request) {
  try {
    const env = (process as any).env;
    const db = getDb(env);
    const body = await request.json();

    // Mapping editor state to DB schema
    const newArticle = await db.insert(articles).values({
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      status: body.status || "draft",
      scheduledDate: body.scheduledDate,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      siteName: body.siteName,
      date: body.date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      readTime: body.readTime || "5 min read",
      category: body.category || "General",
      author: body.author || "Admin User",
      authorInitials: body.authorInitials || "AU",
      authorBg: body.authorBg || "#FACC15",
      heroImage: body.heroImage,
      sections: body.sections || [],
      toc: body.toc || [],
    }).returning();

    return NextResponse.json(newArticle[0]);
  } catch (error: any) {
    console.error("Save Article Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

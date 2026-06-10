import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { pages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";



export async function GET() {
  try {
    const db = getDb();
    const allPages = await db.select().from(pages).orderBy(desc(pages.updatedAt));
    
    // If no pages exist yet, return seed data for the CMS
    if (allPages.length === 0) {
      return NextResponse.json([
        { id: 1, title: "Home Page", slug: "/", status: "Published", updatedAt: new Date() },
        { id: 2, title: "About Us", slug: "/about", status: "Published", updatedAt: new Date() },
        { id: 3, title: "Contact", slug: "/contact", status: "Published", updatedAt: new Date() },
        { id: 4, title: "Privacy Policy", slug: "/privacy-policy", status: "Published", updatedAt: new Date() },
      ]);
    }

    return NextResponse.json(allPages);
  } catch (error: any) {
    console.error("Pages GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = getDb();
    const data = await req.json();
    const result = await db.insert(pages).values({
      title: data.title,
      slug: data.slug,
      content: data.content,
      status: data.status || "draft",
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
    }).returning();
    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error("Pages POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

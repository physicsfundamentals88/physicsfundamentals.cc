import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { desc, ne, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const db = getDb();
    const publishedArticles = await db
      .select()
      .from(articles)
      .where(
        and(
          ne(articles.status, "Draft"),
          ne(articles.status, "draft")
        )
      )
      .orderBy(desc(articles.createdAt));
    return NextResponse.json(publishedArticles);
  } catch (error: any) {
    console.error("Fetch Published Articles Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

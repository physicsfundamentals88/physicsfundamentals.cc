import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { count } from "drizzle-orm";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const db = getDb();

    // Get total articles count
    const articlesCount = await db.select({ value: count() }).from(articles);
    
    // Get published vs draft (hypothetically, we don't have a status field yet, but we can filter by content for now)
    // Actually, let's just return basic counts for now to get the UI moving
    
    return NextResponse.json({
      totalPosts: articlesCount[0].value,
      totalCategories: 5, // Hardcoded until we have a categories table
      totalViews: "12.4K",
      avgReadTime: "6 min",
    });
  } catch (error: any) {
    console.error("Fetch Stats Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

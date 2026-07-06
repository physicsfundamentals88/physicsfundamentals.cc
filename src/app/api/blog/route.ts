import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(request: Request) {
  try {
    let env: any;
    try {
      env = getCloudflareContext().env;
    } catch {
      env = process.env;
    }
    
    const db = env?.DB;
    if (!db) {
      // Return empty array during local builds if DB is not bound
      return NextResponse.json([]);
    }

    const { results } = await db
      .prepare("SELECT * FROM articles WHERE status IS NULL OR (status != 'Draft' AND status != 'draft') ORDER BY created_at DESC")
      .all();

    const mappedResults = results.map((row: any) => ({
      ...row,
      sections: typeof row.sections === "string" ? JSON.parse(row.sections) : (row.sections || []),
      toc: typeof row.toc === "string" ? JSON.parse(row.toc) : (row.toc || []),
      readTime: row.read_time,
      authorInitials: row.author_initials,
      authorBg: row.author_bg,
      heroImage: row.hero_image,
      scheduledDate: row.scheduled_date,
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      siteName: row.site_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json(mappedResults);
  } catch (error: any) {
    console.error("Fetch Published Articles Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

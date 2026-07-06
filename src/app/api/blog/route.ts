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
      .prepare("SELECT * FROM articles WHERE status IS NULL OR (status != 'Draft' AND status != 'draft') ORDER BY createdAt DESC")
      .all();

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Fetch Published Articles Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

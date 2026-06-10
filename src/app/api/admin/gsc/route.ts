import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { searchStats } from "@/db/schema";
import { desc } from "drizzle-orm";



export async function GET() {
  try {
    const db = getDb();

    // In a real scenario, this would fetch from GSC API and cache in searchStats table.
    // For now, we return the cached data or mock data.
    const stats = await db.select().from(searchStats).orderBy(desc(searchStats.date)).limit(30);
    
    if (stats.length === 0) {
      // Mock search performance data for demonstration
      return NextResponse.json({
        summary: {
           clicks: "1,240",
           impressions: "45,820",
           ctr: "2.7%",
           position: "14.2"
        },
        trends: {
           clicks: "+12.5%",
           impressions: "+5.2%",
           ctr: "-0.4%",
           position: "+1.2"
        },
        history: Array.from({ length: 7 }, (_, i) => ({
           date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
           clicks: Math.floor(Math.random() * 200) + 100,
           impressions: Math.floor(Math.random() * 5000) + 2000,
        }))
      });
    }

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("GSC GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

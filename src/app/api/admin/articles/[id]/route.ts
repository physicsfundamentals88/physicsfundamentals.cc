import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

// GET individual article
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const db = getDb();
    const id = parseInt(idStr);

    const article = await db.select().from(articles).where(eq(articles.id, id));

    if (!article.length) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article[0]);
  } catch (error: any) {
    console.error("Fetch Article Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update article
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const db = getDb();
    const id = parseInt(idStr);
    const body = await request.json();

    const updatedArticle = await db.update(articles)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id))
      .returning();

    return NextResponse.json(updatedArticle[0]);
  } catch (error: any) {
    console.error("Update Article Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE article
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const db = getDb();
    const id = parseInt(idStr);

    await db.delete(articles).where(eq(articles.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete Article Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

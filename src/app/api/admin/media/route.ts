import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const env = (process as any).env;
    if (!env.MEDIA_BUCKET) {
      return NextResponse.json({ error: "R2 bucket binding missing" }, { status: 500 });
    }

    // List recent objects from R2
    // Cloudflare R2 list() returns an object containing 'objects' array
    const list = await env.MEDIA_BUCKET.list({ limit: 50 });
    
    const assets = list.objects.map((obj: any) => ({
      name: obj.key,
      size: obj.size,
      uploaded: obj.uploaded,
      url: `/api/assets/${obj.key}`
    }));

    return NextResponse.json(assets);
  } catch (error: any) {
    console.error("List Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// DELETE media object
export async function DELETE(request: Request) {
  try {
    const env = (process as any).env;
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    if (!env.MEDIA_BUCKET) {
      return NextResponse.json({ error: "R2 bucket binding missing" }, { status: 500 });
    }

    await env.MEDIA_BUCKET.delete(key);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

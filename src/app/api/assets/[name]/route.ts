import { NextResponse } from "next/server";



export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const env = (process as any).env;

    if (!env.MEDIA_BUCKET) {
      return NextResponse.json({ error: "R2 bucket binding missing" }, { status: 500 });
    }

    const object = await env.MEDIA_BUCKET.get(name);

    if (!object) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new Response(object.body, { headers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

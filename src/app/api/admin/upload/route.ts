import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const env = (process as any).env;
    if (!env.MEDIA_BUCKET) {
      return NextResponse.json({ error: "R2 bucket binding 'MEDIA_BUCKET' not found." }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const contentType = file.type || "application/octet-stream";

    // Dynamic import/access for R2 put operation
    await env.MEDIA_BUCKET.put(fileName, file.stream(), {
      httpMetadata: { contentType },
    });

    // We assume the user has a custom domain or public access configured
    // For local development with wrangler, this returns the name which they can use
    return NextResponse.json({ 
      url: `/api/assets/${fileName}`, // We'll create a proxy route for easier access
      name: fileName 
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

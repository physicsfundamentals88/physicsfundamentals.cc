import { NextResponse } from "next/server";

export const runtime = "edge";

import { getCloudflareContext } from "@opennextjs/cloudflare";

function getCloudflareEnv(): any {
  try {
    const { env } = getCloudflareContext();
    return env;
  } catch {
    return (process as any).env;
  }
}

export async function POST(request: Request) {
  try {
    const env = getCloudflareEnv();
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!env?.MEDIA_BUCKET) {
      // Fallback: Convert to Base64 — works without any credit card or R2 bucket
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const contentType = file.type || "application/octet-stream";
      const dataUrl = `data:${contentType};base64,${base64}`;
      return NextResponse.json({ 
        url: dataUrl,
        name: file.name 
      });
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const contentType = file.type || "application/octet-stream";

    await env.MEDIA_BUCKET.put(fileName, file.stream(), {
      httpMetadata: { contentType },
    });

    return NextResponse.json({ 
      url: `/api/assets/${fileName}`,
      name: fileName 
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

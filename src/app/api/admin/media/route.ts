import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import { getCloudflareContext } from "@opennextjs/cloudflare";

function getCloudflareEnv(): any {
  try {
    const { env } = getCloudflareContext();
    return env;
  } catch {
    return (process as any).env;
  }
}

export async function GET(request: Request) {
  try {
    const env = getCloudflareEnv();
    if (!env?.MEDIA_BUCKET) {
      // Fallback: Read from local JSON database
      try {
        const dbPath = path.join(process.cwd(), "src/data/localMedia.json");
        if (fs.existsSync(dbPath)) {
          const content = fs.readFileSync(dbPath, "utf-8");
          const localMedia = JSON.parse(content);
          return NextResponse.json(localMedia);
        }
      } catch (err) {
        console.error("Failed to read local media database:", err);
      }
      return NextResponse.json([]);
    }

    // List recent objects from R2
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
    const env = getCloudflareEnv();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    if (!env?.MEDIA_BUCKET) {
      // Fallback: Delete from local JSON database
      try {
        const dbPath = path.join(process.cwd(), "src/data/localMedia.json");
        if (fs.existsSync(dbPath)) {
          const content = fs.readFileSync(dbPath, "utf-8");
          let localMedia = JSON.parse(content);
          localMedia = localMedia.filter((item: any) => item.name !== key);
          fs.writeFileSync(dbPath, JSON.stringify(localMedia, null, 2), "utf-8");
        }
      } catch (err) {
        console.error("Failed to delete from local media database:", err);
      }
      return NextResponse.json({ success: true });
    }

    await env.MEDIA_BUCKET.delete(key);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

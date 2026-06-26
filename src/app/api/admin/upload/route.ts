import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

      // Save to local JSON database for listing in Media Library
      try {
        const dbPath = path.join(process.cwd(), "src/data/localMedia.json");
        let localMedia = [];
        if (fs.existsSync(dbPath)) {
          const content = fs.readFileSync(dbPath, "utf-8");
          localMedia = JSON.parse(content);
        }

        const newMedia = {
          name: file.name,
          size: file.size,
          uploaded: new Date().toISOString(),
          url: dataUrl
        };

        // Check if item already exists, if so filter it out to prevent duplicates
        localMedia = localMedia.filter((item: any) => item.name !== file.name);
        localMedia.unshift(newMedia);

        const dirPath = path.dirname(dbPath);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        fs.writeFileSync(dbPath, JSON.stringify(localMedia, null, 2), "utf-8");
      } catch (err) {
        console.error("Failed to write to local media database:", err);
      }

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

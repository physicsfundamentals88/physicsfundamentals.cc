"use client";

import React, { useRef, useState } from "react";
import { compressToWebP } from "@/utils/imageCompressor";

export default function WatermarkRemoverPage() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [processedSize, setProcessedSize] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalSize(file.size);
    setOriginalUrl(URL.createObjectURL(file));

    try {
      const compressedBlob = await compressToWebP(file);
      setProcessedSize(compressedBlob.size);
      setProcessedUrl(URL.createObjectURL(compressedBlob));
    } catch (err) {
      console.error(err);
    }
  };

  const drawTestImage = (type: "gemini" | "banana") => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw background (blue/gray gradient)
    const grad = ctx.createLinearGradient(0, 0, 600, 400);
    grad.addColorStop(0, "#1e293b");
    grad.addColorStop(1, "#0f172a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 400);

    // Draw some shapes
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(300, 200, 80, 0, Math.PI * 2);
    ctx.fill();

    // Draw text
    ctx.fillStyle = "#ffffff";
    ctx.font = "24px sans-serif";
    ctx.fillText("Watermark Test Canvas", 50, 80);

    // Draw watermark in bottom-right corner
    // Config: size 64, marginRight 16, marginBottom 16
    // x = 600 - 16 - 64 = 520
    // y = 400 - 16 - 64 = 320
    const x = 520;
    const y = 320;
    const size = 64;

    if (type === "gemini") {
      // Draw 4-pointed white sparkle (Gemini logo) in the center of the watermark box
      const cx = x + size / 2;
      const cy = y + size / 2;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(cx, cy - 20);
      ctx.quadraticCurveTo(cx, cy, cx + 20, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy + 20);
      ctx.quadraticCurveTo(cx, cy, cx - 20, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy - 20);
      ctx.fill();
    } else {
      // Draw yellow banana logo in the center of the watermark box
      const cx = x + size / 2;
      const cy = y + size / 2;
      ctx.fillStyle = "#facc15"; // bright yellow
      ctx.beginPath();
      // Crescent banana shape
      ctx.arc(cx, cy, 15, 0.2 * Math.PI, 1.2 * Math.PI, false);
      ctx.arc(cx - 5, cy - 5, 15, 1.2 * Math.PI, 0.2 * Math.PI, true);
      ctx.fill();
      
      // Banana stem (darker color)
      ctx.fillStyle = "#854d0e";
      ctx.fillRect(cx - 15, cy - 12, 4, 4);
    }

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `test-${type}.png`, { type: "image/png" });
      setOriginalSize(file.size);
      setOriginalUrl(URL.createObjectURL(file));

      const compressedBlob = await compressToWebP(file);
      setProcessedSize(compressedBlob.size);
      setProcessedUrl(URL.createObjectURL(compressedBlob));
    }, "image/png");
  };

  return (
    <div style={{ padding: 24, background: "#f1f5f9", minHeight: "calc(100vh - 100px)", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#0f172a", marginBottom: 6, fontWeight: "900" }}>Watermark Remover Panel</h2>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20, fontWeight: "500" }}>
        Generate a watermarked test image or upload your own to test the automated client-side logo detection and removal.
      </p>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <button onClick={() => drawTestImage("gemini")} style={{ padding: "10px 20px", background: "#2271b1", color: "white", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer", transition: "all 0.15s ease" }} className="hover:opacity-90 active:scale-95">
          Generate Gemini Sparkle Test
        </button>
        <button onClick={() => drawTestImage("banana")} style={{ padding: "10px 20px", background: "#dba617", color: "white", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer", transition: "all 0.15s ease" }} className="hover:opacity-90 active:scale-95">
          Generate Banana Test
        </button>
        <input ref={fileRef} type="file" onChange={handleUpload} style={{ display: "none" }} />
        <button onClick={() => fileRef.current?.click()} style={{ padding: "10px 20px", background: "#00a32a", color: "white", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer", transition: "all 0.15s ease" }} className="hover:opacity-90 active:scale-95">
          Upload Custom Image
        </button>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ background: "white", padding: 16, borderRadius: 12, border: "1px solid #e2e8f0", flex: 1, minWidth: 320 }}>
          <h3 style={{ marginTop: 0, marginBottom: 12, color: "#1e293b", fontSize: 15, fontWeight: "bold" }}>Original Image {originalSize && `(${Math.round(originalSize / 1024)} KB)`}</h3>
          {originalUrl ? (
            <img src={originalUrl} alt="Original" style={{ width: "100%", height: "auto", border: "1px solid #cbd5e1", borderRadius: 8 }} />
          ) : (
            <div style={{ height: 200, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #cbd5e1", borderRadius: 8, color: "#94a3b8" }}>
              No image generated or uploaded
            </div>
          )}
        </div>
        <div style={{ background: "white", padding: 16, borderRadius: 12, border: "1px solid #e2e8f0", flex: 1, minWidth: 320 }}>
          <h3 style={{ marginTop: 0, marginBottom: 12, color: "#1e293b", fontSize: 15, fontWeight: "bold" }}>Processed WebP Image {processedSize && `(${Math.round(processedSize / 1024)} KB)`}</h3>
          {processedUrl ? (
            <img src={processedUrl} alt="Processed" style={{ width: "100%", height: "auto", border: "1px solid #cbd5e1", borderRadius: 8 }} />
          ) : (
            <div style={{ height: 200, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #cbd5e1", borderRadius: 8, color: "#94a3b8" }}>
              No image processed yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

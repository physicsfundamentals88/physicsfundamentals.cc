"use client";

import React, { useRef, useState } from "react";
import { compressToWebP } from "@/utils/imageCompressor";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2, Upload, ExternalLink } from "lucide-react";

export default function WatermarkRemoverPage() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [processedSize, setProcessedSize] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const uploadToMediaLibrary = async (blob: Blob, fileName: string) => {
    setUploading(true);
    setUploadedMediaUrl(null);
    try {
      const webpFile = new File([blob], fileName, { type: "image/webp" });
      const fd = new FormData();
      fd.append("file", webpFile);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Upload failed");
      }
      const data = await res.json();
      setUploadedMediaUrl(data.url);
      showNotification("success", `Image saved to Media Library as "${fileName}"!`);
    } catch (err: any) {
      showNotification("error", err.message || "Failed to upload to Media Library.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalSize(file.size);
    setOriginalUrl(URL.createObjectURL(file));
    setProcessedUrl(null);
    setUploadedMediaUrl(null);

    try {
      const compressedBlob = await compressToWebP(file);
      setProcessedSize(compressedBlob.size);
      const blobUrl = URL.createObjectURL(compressedBlob);
      setProcessedUrl(blobUrl);

      // Auto-upload to media library
      const baseName = file.name.replace(/\.[^.]+$/, "");
      const webpName = `${baseName}.webp`;
      await uploadToMediaLibrary(compressedBlob, webpName);
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to process image.");
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

    const x = 520;
    const y = 320;
    const size = 64;

    if (type === "gemini") {
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
      const cx = x + size / 2;
      const cy = y + size / 2;
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0.2 * Math.PI, 1.2 * Math.PI, false);
      ctx.arc(cx - 5, cy - 5, 15, 1.2 * Math.PI, 0.2 * Math.PI, true);
      ctx.fill();
      ctx.fillStyle = "#854d0e";
      ctx.fillRect(cx - 15, cy - 12, 4, 4);
    }

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `test-${type}.png`, { type: "image/png" });
      setOriginalSize(file.size);
      setOriginalUrl(URL.createObjectURL(file));
      setProcessedUrl(null);
      setUploadedMediaUrl(null);

      const compressedBlob = await compressToWebP(file);
      setProcessedSize(compressedBlob.size);
      setProcessedUrl(URL.createObjectURL(compressedBlob));

      // Auto-upload to media library
      await uploadToMediaLibrary(compressedBlob, `test-${type}.webp`);
    }, "image/png");
  };

  return (
    <div style={{ padding: 24, background: "#f1f5f9", minHeight: "calc(100vh - 100px)", fontFamily: "sans-serif" }}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
          zIndex: 100, padding: "12px 24px", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          display: "flex", alignItems: "center", gap: 10,
          background: notification.type === "success" ? "#0f172a" : "#ef4444",
          color: "white", fontWeight: "bold", fontSize: 14
        }}>
          {notification.type === "success"
            ? <CheckCircle2 size={18} style={{ color: "#facc15" }} />
            : <AlertCircle size={18} />}
          {notification.message}
        </div>
      )}

      <h2 style={{ color: "#0f172a", marginBottom: 6, fontWeight: "900" }}>Image Compressor & Media Library Upload</h2>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20, fontWeight: "500" }}>
        Upload an image to compress it to WebP format. The processed image will be <strong>automatically saved to your Media Library</strong> where you can use it in blog posts.
      </p>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <button onClick={() => drawTestImage("gemini")} style={{ padding: "10px 20px", background: "#2271b1", color: "white", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer", transition: "all 0.15s ease" }} className="hover:opacity-90 active:scale-95">
          Generate Gemini Sparkle Test
        </button>
        <button onClick={() => drawTestImage("banana")} style={{ padding: "10px 20px", background: "#dba617", color: "white", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer", transition: "all 0.15s ease" }} className="hover:opacity-90 active:scale-95">
          Generate Banana Test
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ padding: "10px 20px", background: "#00a32a", color: "white", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer", transition: "all 0.15s ease", display: "flex", alignItems: "center", gap: 8, opacity: uploading ? 0.6 : 1 }} className="hover:opacity-90 active:scale-95">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "Processing & Uploading..." : "Upload & Compress Image"}
        </button>
      </div>

      {/* Upload status banner */}
      {uploadedMediaUrl && (
        <div style={{ marginBottom: 20, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <CheckCircle2 size={20} style={{ color: "#16a34a", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: "bold", color: "#15803d", fontSize: 14 }}>✅ Image saved to Media Library!</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#166534" }}>You can now use this image in your blog posts via the media library.</p>
          </div>
          <Link href="/admin/media" style={{ padding: "8px 16px", background: "#16a34a", color: "white", borderRadius: 8, fontWeight: "bold", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
            <ExternalLink size={14} />
            Open Media Library
          </Link>
        </div>
      )}

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ background: "white", padding: 16, borderRadius: 12, border: "1px solid #e2e8f0", flex: 1, minWidth: 320 }}>
          <h3 style={{ marginTop: 0, marginBottom: 12, color: "#1e293b", fontSize: 15, fontWeight: "bold" }}>Original Image {originalSize && `(${Math.round(originalSize / 1024)} KB)`}</h3>
          {originalUrl ? (
            <img src={originalUrl} alt="Original" style={{ width: "100%", height: "auto", border: "1px solid #cbd5e1", borderRadius: 8 }} />
          ) : (
            <div style={{ height: 200, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #cbd5e1", borderRadius: 8, color: "#94a3b8" }}>
              No image uploaded yet
            </div>
          )}
        </div>
        <div style={{ background: "white", padding: 16, borderRadius: 12, border: "1px solid #e2e8f0", flex: 1, minWidth: 320 }}>
          <h3 style={{ marginTop: 0, marginBottom: 12, color: "#1e293b", fontSize: 15, fontWeight: "bold" }}>
            Compressed WebP {processedSize && `(${Math.round(processedSize / 1024)} KB)`}
            {originalSize && processedSize && (
              <span style={{ marginLeft: 10, fontSize: 12, color: "#16a34a", fontWeight: "600" }}>
                {Math.round((1 - processedSize / originalSize) * 100)}% smaller
              </span>
            )}
          </h3>
          {uploading ? (
            <div style={{ height: 200, background: "#f8fafc", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px dashed #cbd5e1", borderRadius: 8, color: "#64748b", gap: 10 }}>
              <Loader2 size={28} className="animate-spin" style={{ color: "#facc15" }} />
              <span style={{ fontSize: 13, fontWeight: "600" }}>Compressing & saving to Media Library...</span>
            </div>
          ) : processedUrl ? (
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

"use client";

import React, { useRef, useState } from "react";
import { compressToWebP } from "@/utils/imageCompressor";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2, Upload, ExternalLink, Download } from "lucide-react";

export default function ImageCompressorPage() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [processedSize, setProcessedSize] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string | null>(null);
  const [processedName, setProcessedName] = useState<string | null>(null);
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
      setProcessedName(webpName);
      await uploadToMediaLibrary(compressedBlob, webpName);
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to process image.");
    }
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
        Upload any image to compress it to WebP format. The processed image will be <strong>automatically saved to your Media Library</strong> where you can use it in blog posts.
      </p>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ padding: "10px 20px", background: "#00a32a", color: "white", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer", transition: "all 0.15s ease", display: "flex", alignItems: "center", gap: 8, opacity: uploading ? 0.6 : 1 }} className="hover:opacity-90 active:scale-95">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "Compressing & Uploading..." : "Upload & Compress Image"}
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
          <div style={{ display: "flex", gap: 10 }}>
            {processedUrl && (
              <a 
                href={processedUrl} 
                download={processedName || "compressed.webp"} 
                style={{ padding: "8px 16px", background: "#0f172a", color: "white", borderRadius: 8, fontWeight: "bold", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
                className="hover:opacity-90 active:scale-95"
              >
                <Download size={14} />
                Download WebP
              </a>
            )}
            <Link href="/admin/media" style={{ padding: "8px 16px", background: "#16a34a", color: "white", borderRadius: 8, fontWeight: "bold", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
              <ExternalLink size={14} />
              Open Media Library
            </Link>
          </div>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <img src={processedUrl} alt="Processed" style={{ width: "100%", height: "auto", border: "1px solid #cbd5e1", borderRadius: 8 }} />
              <a 
                href={processedUrl} 
                download={processedName || "compressed.webp"} 
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  gap: 8, 
                  padding: "10px 20px", 
                  background: "#0f172a", 
                  color: "white", 
                  borderRadius: 8, 
                  fontWeight: "bold", 
                  fontSize: 13, 
                  textDecoration: "none",
                  width: "fit-content"
                }}
                className="hover:opacity-90 active:scale-95"
              >
                <Download size={16} />
                Download Compressed WebP
              </a>
            </div>
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

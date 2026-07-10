"use client";

import React, { useRef, useState, useEffect } from "react";
import { compressToWebP } from "@/utils/imageCompressor";
import Link from "next/link";
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Upload, 
  ExternalLink, 
  Download, 
  Trash2, 
  RefreshCw, 
  FileImage,
  Sparkles
} from "lucide-react";

interface QueueItem {
  id: string;
  file: File;
  status: "queued" | "compressing" | "uploading" | "success" | "error";
  originalSize: number;
  compressedSize?: number;
  compressedBlob?: Blob;
  uploadedUrl?: string;
  error?: string;
}

export default function ImageCompressorPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Auto-process queue when it changes
  useEffect(() => {
    const activeTasks = queue.filter(item => item.status === "compressing" || item.status === "uploading").length;
    const CONCURRENCY = 2;

    if (activeTasks >= CONCURRENCY) return;

    // Find next queued item
    const nextItem = queue.find(item => item.status === "queued");
    if (!nextItem) return;

    // Start processing
    processItem(nextItem.id);
  }, [queue]);

  const processItem = async (id: string) => {
    // 1. Set to Compressing
    setQueue(prev => prev.map(item => item.id === id ? { ...item, status: "compressing" } : item));

    let currentBlob: Blob | undefined;
    let currentItem = queue.find(item => item.id === id);
    if (!currentItem) return;

    try {
      // Compress
      const compressedBlob = await compressToWebP(currentItem.file);
      currentBlob = compressedBlob;

      setQueue(prev => prev.map(item => 
        item.id === id 
          ? { ...item, status: "uploading", compressedSize: compressedBlob.size, compressedBlob } 
          : item
      ));

      // 2. Upload to Media Library
      const baseName = currentItem.file.name.replace(/\.[^.]+$/, "");
      const webpName = `${baseName}.webp`;
      const webpFile = new File([compressedBlob], webpName, { type: "image/webp" });
      
      const fd = new FormData();
      fd.append("file", webpFile);

      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Upload failed");
      }
      const data = await res.json();

      setQueue(prev => prev.map(item => 
        item.id === id 
          ? { ...item, status: "success", uploadedUrl: data.url } 
          : item
      ));
    } catch (err: any) {
      console.error("Failed to process item:", id, err);
      setQueue(prev => prev.map(item => 
        item.id === id 
          ? { ...item, status: "error", error: err.message || "Failed to process image." } 
          : item
      ));
    }
  };

  const addFilesToQueue = (files: FileList) => {
    const newItems: QueueItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;

      newItems.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        status: "queued",
        originalSize: file.size,
      });
    }

    if (newItems.length > 0) {
      setQueue(prev => [...prev, ...newItems]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFilesToQueue(e.target.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const retryItem = (id: string) => {
    setQueue(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: "queued", error: undefined, compressedSize: undefined, compressedBlob: undefined } 
        : item
    ));
  };

  const removeItem = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  // Helper stats
  const totalCount = queue.length;
  const successCount = queue.filter(item => item.status === "success").length;
  const errorCount = queue.filter(item => item.status === "error").length;
  const processingCount = queue.filter(item => item.status === "compressing" || item.status === "uploading").length;
  
  let totalSavedBytes = 0;
  queue.forEach(item => {
    if (item.status === "success" && item.compressedSize) {
      totalSavedBytes += Math.max(0, item.originalSize - item.compressedSize);
    }
  });

  return (
    <div style={{ padding: 24, background: "#f1f5f9", minHeight: "calc(100vh - 100px)", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#0f172a", marginBottom: 6, fontWeight: "900" }}>Bulk Image Compressor</h2>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24, fontWeight: "500" }}>
        Upload or drag multiple images to compress them to WebP format. Compressed images will be **automatically saved to your Media Library**.
      </p>

      {/* Stats Board */}
      {totalCount > 0 && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24
        }}>
          <div style={{ background: "white", padding: "16px 20px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: "bold", textTransform: "uppercase" }}>Queue Progress</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 24, fontWeight: "bold", color: "#0f172a" }}>{successCount + errorCount}</span>
              <span style={{ fontSize: 14, color: "#64748b" }}>/ {totalCount} processed</span>
            </div>
            <div style={{ width: "100%", height: 6, background: "#e2e8f0", borderRadius: 3, marginTop: 10, overflow: "hidden" }}>
              <div style={{
                height: "100%", background: "#10b981", borderRadius: 3,
                width: `${(successCount / totalCount) * 100}%`,
                transition: "width 0.3s ease"
              }} />
            </div>
          </div>
          
          <div style={{ background: "white", padding: "16px 20px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: "bold", textTransform: "uppercase" }}>Total Storage Saved</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4, color: "#10b981" }}>
              <span style={{ fontSize: 24, fontWeight: "bold" }}>
                {totalSavedBytes > 1024 * 1024 
                  ? `${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB`
                  : `${(totalSavedBytes / 1024).toFixed(1)} KB`}
              </span>
              <Sparkles size={16} />
            </div>
            <span style={{ fontSize: 11, color: "#64748b", display: "block", marginTop: 4 }}>Across all optimized images</span>
          </div>

          <div style={{ background: "white", padding: "16px 20px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: "bold", textTransform: "uppercase" }}>Failed Jobs</span>
            <div style={{ fontSize: 24, fontWeight: "bold", color: errorCount > 0 ? "#ef4444" : "#0f172a", marginTop: 4 }}>
              {errorCount}
            </div>
            <span style={{ fontSize: 11, color: "#64748b", display: "block", marginTop: 4 }}>Images requiring retry</span>
          </div>
        </div>
      )}

      {/* Drag & Drop Area */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        style={{
          width: "100%",
          padding: "40px 20px",
          background: dragActive ? "#eff6ff" : "white",
          border: dragActive ? "2px dashed #3b82f6" : "2px dashed #cbd5e1",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.15s ease",
          marginBottom: 24
        }}
        onClick={() => fileRef.current?.click()}
        className="group hover:border-blue-500 hover:bg-slate-50/50"
      >
        <input 
          ref={fileRef} 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFileInput} 
          style={{ display: "none" }} 
        />
        <div style={{
          padding: 16, borderRadius: "50%", background: "#f8fafc", color: "#64748b",
          marginBottom: 12, transition: "transform 0.2s ease"
        }} className="group-hover:scale-110">
          <Upload size={32} style={{ color: "#3b82f6" }} />
        </div>
        <p style={{ margin: 0, fontWeight: "bold", color: "#1e293b", fontSize: 15 }}>
          Drag & drop your images here, or <span style={{ color: "#3b82f6" }}>browse files</span>
        </p>
        <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 12 }}>
          Supports PNG, JPEG, WEBP. Convert & compress multiple files instantly.
        </p>
      </div>

      {/* Queue Section */}
      {queue.length > 0 && (
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{
            padding: "16px 20px", borderBottom: "1px solid #e2e8f0",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: "bold", color: "#1e293b" }}>
              Compression Queue ({queue.length} files)
            </h3>
            <button 
              onClick={clearQueue}
              style={{
                background: "transparent", border: "none", color: "#ef4444", fontSize: 13,
                fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: 6
              }}
              className="hover:opacity-80"
            >
              <Trash2 size={14} />
              Clear Queue
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {queue.map((item, index) => {
              const saving = item.compressedSize 
                ? Math.round((1 - item.compressedSize / item.originalSize) * 100) 
                : 0;

              return (
                <div 
                  key={item.id}
                  style={{
                    padding: "14px 20px",
                    borderBottom: index < queue.length - 1 ? "1px solid #f1f5f9" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                    background: item.status === "compressing" || item.status === "uploading" ? "#f8fafc" : "white"
                  }}
                >
                  {/* File Icon / Thumbnail */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, background: "#f1f5f9",
                    display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center",
                    color: "#94a3b8", flexShrink: 0
                  }}>
                    <FileImage size={20} />
                  </div>

                  {/* Name and size details */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ margin: 0, fontWeight: "bold", color: "#1e293b", fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.file.name}
                    </p>
                    <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: 12 }}>
                      Original: {Math.round(item.originalSize / 1024)} KB
                      {item.compressedSize && ` → Compressed: ${Math.round(item.compressedSize / 1024)} KB`}
                    </p>
                  </div>

                  {/* Savings percentage tag */}
                  {item.status === "success" && (
                    <span style={{
                      background: "#ecfdf5", color: "#10b981", padding: "4px 8px",
                      borderRadius: 6, fontSize: 11, fontWeight: "bold", border: "1px solid #a7f3d0"
                    }}>
                      {saving}% space saved
                    </span>
                  )}

                  {/* Status Badge */}
                  <div style={{ minWidth: 120, display: "flex", alignItems: "center", gap: 6 }}>
                    {item.status === "queued" && (
                      <span style={{ fontSize: 12, color: "#64748b", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#94a3b8" }} />
                        Queued
                      </span>
                    )}
                    {item.status === "compressing" && (
                      <span style={{ fontSize: 12, color: "#2563eb", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <Loader2 size={13} className="animate-spin" />
                        Compressing...
                      </span>
                    )}
                    {item.status === "uploading" && (
                      <span style={{ fontSize: 12, color: "#d97706", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <Loader2 size={13} className="animate-spin" />
                        Saving to Media...
                      </span>
                    )}
                    {item.status === "success" && (
                      <span style={{ fontSize: 12, color: "#10b981", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <CheckCircle2 size={14} />
                        Completed
                      </span>
                    )}
                    {item.status === "error" && (
                      <span style={{ fontSize: 12, color: "#ef4444", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: 4 }} title={item.error}>
                        <AlertCircle size={14} />
                        Failed
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    {item.status === "success" && item.compressedBlob && (
                      <>
                        <a 
                          href={URL.createObjectURL(item.compressedBlob)}
                          download={item.file.name.replace(/\.[^.]+$/, "") + ".webp"}
                          style={{
                            padding: 8, borderRadius: 8, background: "#f1f5f9", color: "#1e293b",
                            display: "inline-flex", alignItems: "center", justifyContent: "center"
                          }}
                          className="hover:bg-slate-200"
                          title="Download WebP"
                        >
                          <Download size={14} />
                        </a>
                        {item.uploadedUrl && (
                          <Link 
                            href="/admin/media"
                            style={{
                              padding: "6px 12px", borderRadius: 8, background: "#10b981", color: "white",
                              fontSize: 12, fontWeight: "bold", textDecoration: "none", display: "inline-flex",
                              alignItems: "center", gap: 4
                            }}
                            className="hover:opacity-90"
                          >
                            <ExternalLink size={12} />
                            View
                          </Link>
                        )}
                      </>
                    )}
                    {item.status === "error" && (
                      <button 
                        onClick={() => retryItem(item.id)}
                        style={{
                          padding: "6px 12px", borderRadius: 8, background: "#ef4444", color: "white",
                          fontSize: 12, fontWeight: "bold", border: "none", cursor: "pointer",
                          display: "inline-flex", alignItems: "center", gap: 4
                        }}
                        className="hover:opacity-90"
                      >
                        <RefreshCw size={12} />
                        Retry
                      </button>
                    )}
                    <button 
                      onClick={() => removeItem(item.id)}
                      style={{
                        padding: 8, borderRadius: 8, background: "transparent", border: "none", color: "#64748b",
                        cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center"
                      }}
                      className="hover:bg-slate-100 hover:text-slate-900"
                      title="Remove from list"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

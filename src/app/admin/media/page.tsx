"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  Search, 
  Grid, 
  List, 
  Filter, 
  Image as ImageIcon, 
  Upload, 
  MoreHorizontal,
  X,
  Download,
  Trash2,
  Copy,
  ExternalLink,
  Video,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import { compressImageToFile } from "@/utils/imageCompressor";

export default function MediaLibraryPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (error) {
      console.error("Fetch Media Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressedFile = await compressImageToFile(file);
      const fd = new FormData();
      fd.append("file", compressedFile);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      showNotification("success", "File uploaded successfully!");
      fetchMedia();
    } catch (error: any) {
      showNotification("error", error.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm("Are you sure you want to delete this file? This action is irreversible.")) return;
    try {
      const res = await fetch(`/api/admin/media?key=${encodeURIComponent(key)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showNotification("success", "File deleted successfully.");
      setSelectedItem(null);
      fetchMedia();
    } catch (error: any) {
      showNotification("error", error.message);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8 flex flex-col min-h-[calc(100vh-140px)] relative">
      {/* Notifications */}
      {notification && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up ${
          notification.type === "success" ? "bg-[#0F172A] text-white" : "bg-red-500 text-white"
        }`}>
          {notification.type === "success" ? <CheckCircle2 className="text-[#FACC15]" size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-black tracking-tight">{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">Media Library</h1>
           <p className="text-[#64748B] font-medium mt-1">Upload and manage images, videos, and educational resources for your articles.</p>
        </div>
        <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} />
        <button 
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-[#FACC15] text-[#0F172A] px-6 py-3.5 rounded-xl font-black text-sm transition-all shadow-xl shadow-yellow-500/20 hover:scale-105 active:scale-95 w-fit disabled:opacity-50"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          {uploading ? "Uploading..." : "Upload New Media"}
        </button>
      </div>

      {/* Media Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center gap-4">
         <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
               type="text" 
               placeholder="Search media by filename..." 
               className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:border-[#FACC15] focus:bg-white outline-none transition-all"
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex bg-slate-100 p-1 rounded-xl">
               <button onClick={() => setView("grid")} className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-white text-[#0F172A] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
                  <Grid size={18} />
               </button>
               <button onClick={() => setView("list")} className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-white text-[#0F172A] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
                  <List size={18} />
               </button>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E2E8F0] text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest hover:border-[#FACC15] hover:text-[#0F172A] transition-all">
               <Filter size={16} /> Filters
            </button>
         </div>
      </div>

      {/* Grid Display */}
      <div className="flex items-start gap-8">
         <div className={`flex-1 grid gap-6 ${view === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
            {loading ? (
                Array(8).fill(0).map((_, i) => (
                    <div key={i} className="aspect-square bg-slate-100 rounded-2xl animate-pulse" />
                ))
            ) : items.length === 0 ? (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-4">
                        <ImageIcon size={32} />
                    </div>
                    <p className="text-[#0F172A] font-black text-lg">No media found</p>
                    <p className="text-[#64748B] text-sm font-medium mt-1">Upload your first image to get started.</p>
                </div>
            ) : (
                items.map((item) => (
                    <div 
                        key={item.name} 
                        onClick={() => setSelectedItem(item)}
                        className={`group relative bg-white border rounded-2xl overflow-hidden cursor-pointer transition-all ${selectedItem?.name === item.name ? "ring-2 ring-[#FACC15] border-transparent" : "border-[#E2E8F0] hover:shadow-lg hover:border-slate-300"}`}
                    >
                        {view === "grid" ? (
                            <div className="flex flex-col">
                                <div className="aspect-square bg-slate-50 relative overflow-hidden">
                                    <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white" title="View details">
                                            <MoreHorizontal size={14} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-[11px] font-black text-[#0F172A] truncate leading-none uppercase tracking-widest">{item.name}</p>
                                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{formatSize(item.size)}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 p-3">
                                <img src={item.url} className="w-12 h-12 bg-slate-50 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-[#0F172A] truncate uppercase tracking-widest leading-none">{item.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-widest uppercase">{formatSize(item.size)}</p>
                                </div>
                                <div className="flex items-center gap-2 px-4">
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(item.name); }} className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}
         </div>

         {/* Selection Sidebar */}
         {selectedItem && (
            <aside className="w-[340px] bg-white rounded-2xl border border-[#E2E8F0] shadow-xl sticky top-[100px] animate-fade-in flex flex-col max-h-[calc(100vh-140px)]">
               <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-widest">File Details</h3>
                  <button onClick={() => setSelectedItem(null)} className="p-1.5 text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-all">
                     <X size={18} />
                  </button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  <div className="aspect-square bg-slate-50 rounded-xl border border-slate-100 overflow-hidden relative">
                     <img src={selectedItem.url} alt={selectedItem.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <Detail title="Size" value={formatSize(selectedItem.size)} />
                        <Detail title="Uploaded" value={new Date(selectedItem.uploaded).toLocaleDateString()} />
                     </div>
                     <div className="space-y-4 pt-6 border-t border-slate-50">
                        <Field label="Direct URL" value={selectedItem.url} copyable />
                        <Field label="Key" value={selectedItem.name} />
                     </div>
                  </div>
               </div>
               <div className="p-6 border-t border-slate-100 grid grid-cols-2 gap-3 bg-slate-50/50">
                  <a href={selectedItem.url} download className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0F172A] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1E293B] transition-all">
                     <Download size={14} /> Download
                  </a>
                  <button 
                    onClick={() => handleDelete(selectedItem.name)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-red-100 transition-all"
                  >
                     <Trash2 size={14} /> Delete
                  </button>
               </div>
            </aside>
         )}
      </div>
    </div>
  );
}

function Detail({ title, value }: { title: string; value: string }) {
   return (
      <div className="flex flex-col gap-1">
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
         <span className="text-[13px] font-bold text-[#0F172A]">{value}</span>
      </div>
   );
}

function Field({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
   const copy = () => {
       navigator.clipboard.writeText(value);
       alert("Copied to clipboard!");
   };
   return (
      <div className="space-y-2">
         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
            {label}
            {copyable && <button onClick={copy} className="text-[#3b82f6] hover:underline flex items-center gap-1"><Copy size={12}/> Copy</button>}
         </label>
         <input readOnly value={value} className="w-full bg-[#F8FAFC] border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-[#0F172A] outline-none truncate" />
      </div>
   );
}

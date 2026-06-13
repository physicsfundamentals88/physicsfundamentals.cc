"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { compressImageToFile } from "@/utils/imageCompressor";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { Placeholder } from "@tiptap/extension-placeholder";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Youtube } from "@tiptap/extension-youtube";
import { Link as LinkExtension } from "@tiptap/extension-link";
import { Image as ImageExtension } from "@tiptap/extension-image";
import { Underline } from "@tiptap/extension-underline";
import { Heading } from "@tiptap/extension-heading";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Code,
  Table as TableIcon,
  CheckSquare,
  Undo2,
  Redo2,
  Plus,
  ChevronDown,
  Edit3,
  Minus,
  X,
  Upload,
  Loader2,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  title: string;
  setTitle: (title: string) => void;
  slug: string;
  setSlug: (slug: string) => void;
  hideTitle?: boolean;
}

/* ─── Heading Dropdown ─────────────────────────── */
function HeadingDropdown({ editor }: { editor: any }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLabel = () => {
    if (editor.isActive("heading", { level: 1 })) return "H1";
    if (editor.isActive("heading", { level: 2 })) return "H2";
    if (editor.isActive("heading", { level: 3 })) return "H3";
    if (editor.isActive("paragraph")) return "¶";
    return "H1";
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const items = [
    { label: "Paragraph", icon: "¶", action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive("paragraph") },
    { label: "Heading 1", icon: "H1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
    { label: "Heading 2", icon: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { label: "Heading 3", icon: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-black text-[#0F172A] hover:bg-slate-50 border border-slate-100 transition-all min-w-[68px]"
      >
        <span>{currentLabel()}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl shadow-slate-900/10 z-50 w-44 overflow-hidden animate-fade-in">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => { item.action(); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all ${item.active ? "bg-[#FACC15]/10 text-[#0F172A]" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-black text-[#0F172A]">{item.icon}</span>
              {item.label}
              {item.active && <span className="ml-auto text-[#FACC15]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Link Modal ───────────────────────────────── */
function LinkModal({ editor, open, onClose }: { editor: any; open: boolean; onClose: () => void }) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) {
      const existing = editor.getAttributes("link").href || "";
      setUrl(existing);
      setText(editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to) || "");
    }
  }, [open, editor]);

  if (!open) return null;

  const apply = () => {
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[400px] space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#0F172A]">Insert Link</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">URL</label>
            <input
              autoFocus
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              onKeyDown={(e) => e.key === "Enter" && apply()}
              className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm font-medium focus:border-[#3b82f6] outline-none transition-all bg-[#F8FAFC] focus:bg-white"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={apply} className="flex-1 py-2.5 bg-[#0F172A] text-white rounded-xl text-sm font-black hover:bg-[#1E293B] transition-all">
            Apply Link
          </button>
          {editor.isActive("link") && (
            <button
              onClick={() => { editor.chain().focus().unsetLink().run(); onClose(); }}
              className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-black hover:bg-red-100 transition-all"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── YouTube Embed Modal ──────────────────────── */
function YoutubeModal({ editor, open, onClose }: { editor: any; open: boolean; onClose: () => void }) {
  const [url, setUrl] = useState("");

  if (!open) return null;

  const embed = () => {
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url, width: 640, height: 360 });
    setUrl("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[400px] space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#0F172A]">Embed YouTube Video</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">YouTube URL</label>
          <input
            autoFocus
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            onKeyDown={(e) => e.key === "Enter" && embed()}
            className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm font-medium focus:border-[#3b82f6] outline-none transition-all bg-[#F8FAFC] focus:bg-white"
          />
        </div>
        <button onClick={embed} className="w-full py-2.5 bg-red-500 text-white rounded-xl text-sm font-black hover:bg-red-600 transition-all">
          Embed Video
        </button>
      </div>
    </div>
  );
}

/* ─── Image Upload Button ──────────────────────── */
function ImageUploadButton({ editor, onUploadStart, onUploadEnd }: { editor: any; onUploadStart: () => void; onUploadEnd: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onUploadStart();
    try {
      const compressedFile = await compressImageToFile(file);
      const fd = new FormData();
      fd.append("file", compressedFile);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }
      const data = await res.json();
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
      } else {
        throw new Error("No URL returned from server");
      }
    } catch (err: any) {
      console.error("Image upload failed:", err);
      alert(err.message || "Failed to upload image. Please try again.");
    }
    onUploadEnd();
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <ToolbarBtn
        onClick={() => fileRef.current?.click()}
        title="Insert Image"
      >
        <ImageIcon size={17} />
      </ToolbarBtn>
    </>
  );
}

/* ─── Main Editor ──────────────────────────────── */
export default function RichTextEditor({ content, onChange, title, setTitle, slug, setSlug, hideTitle }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [editingSlug, setEditingSlug] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [ytOpen, setYtOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });

  useEffect(() => { setIsMounted(true); }, []);

  // Auto-generate slug from title (50-60 chars)
  useEffect(() => {
    if (!editingSlug && title) {
      let seoSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove all non-word chars
        .replace(/[\s_-]+/g, "-") // Replace spaces/underscores/hyphens with a single hyphen
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
      
      // Smart Truncation (strict 60 char limit)
      if (seoSlug.length > 60) {
        let truncated = seoSlug.substring(0, 60);
        const lastHyphen = truncated.lastIndexOf("-");
        // If we found a hyphen and it's not too early (within 15 chars of the end), cut there
        if (lastHyphen > 45) {
          seoSlug = truncated.substring(0, lastHyphen);
        } else {
          seoSlug = truncated;
        }
      }
      
      // Ensure it never exceeds 60 under any circumstance
      if (seoSlug.length > 60) {
        seoSlug = seoSlug.substring(0, 60);
      }
      
      setSlug(seoSlug);
    }
  }, [title, editingSlug, setSlug]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, horizontalRule: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      Underline,
      LinkExtension.configure({ openOnClick: false, HTMLAttributes: { class: "text-blue-600 underline cursor-pointer" } }),
      ImageExtension.configure({ HTMLAttributes: { class: "rounded-xl max-w-full my-4" } }),
      Youtube.configure({ controls: true, nocookie: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      HorizontalRule,
      Placeholder.configure({ placeholder: "Start writing your article..." }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none min-h-[500px] outline-none font-sans text-[#0F172A] leading-relaxed prose-headings:font-black prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-2 prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-2 prose-p:text-lg prose-p:leading-[1.85] prose-p:text-slate-700 prose-a:text-blue-600 prose-code:bg-slate-100 prose-code:rounded prose-code:px-1.5 prose-blockquote:border-l-4 prose-blockquote:border-yellow-400 prose-blockquote:bg-amber-50 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-10 prose-pre:bg-[#0F172A] prose-pre:text-yellow-300 prose-pre:rounded-3xl prose-pre:shadow-2xl",
      },
      handlePaste(view, event) {
        const text = event.clipboardData?.getData("text/plain");
        if (!text) return false;

        // If the selection is inside a code block or inline code, let native paste handle it
        const { state } = view;
        const { selection } = state;
        const { $from } = selection;
        const isInCode = $from.parent.type.name === "codeBlock" || $from.parent.type.name === "code";
        if (isInCode) {
          return false;
        }

        const types = event.clipboardData?.types || [];
        const isHtml = types.includes("text/html");

        // Detect if the plain-text contains math formulas, markdown/space tables, or callouts
        const hasMath = /\$[^$]+\$|\$\$[\s\S]+?\$\$/g.test(text);
        const hasTable = text.includes("|") || text.includes("\t") || /\s{2,}/.test(text);
        const hasCallouts = /^\s*(Note|Important|Key\s+Point|Formula|Definition|Example|Caution|Warning|Real-World\s+Example|SI\s+Unit)\s*:/mi.test(text) || text.includes("💡") || text.includes(">");

        // If it's a rich HTML paste and contains no formulas/tables/callouts, let Tiptap handle it natively
        if (isHtml && !hasMath && !hasTable && !hasCallouts) {
          return false;
        }

        // Run our custom parser to generate clean, semantic HTML
        const finalHtml = parsePlaintextToHtml(text);
        if (!finalHtml) return false;

        try {
          const parser = view.someProp("clipboardParser") as any;
          const slice = parser.parseSlice(finalHtml);
          view.dispatch(view.state.tr.replaceSelection(slice).scrollIntoView());
          return true;
        } catch (err) {
          console.error("Custom paste parser error:", err);
          return false;
        }
      },
      handleKeyDown(view, event) {
        if (event.key === "Tab") return true;
        return false;
      },
    },
  });

  if (!isMounted || !editor) return null;

  const btn = (active: boolean) =>
    `p-2 rounded-xl transition-all flex items-center justify-center min-w-[34px] h-[34px] ${
      active ? "bg-[#FACC15] text-[#0F172A] shadow-sm" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
    }`;

  return (
    <div className={`${hideTitle ? "flex flex-col" : "space-y-8"} animate-fade-in`}>
      {/* ── Title + Permalink ── */}
      {!hideTitle && (
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</label>
          <input
            type="text"
            placeholder="Enter your post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl lg:text-5xl font-black text-[#0F172A] placeholder:text-slate-200 border-none outline-none bg-transparent leading-tight"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-slate-400">Permalink:</span>
          {editingSlug ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#3b82f6] px-4 py-2 rounded-xl">
                <span className="text-sm font-bold text-slate-400">yourdomain.com/</span>
                <input
                  autoFocus
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.substring(0, 60))}
                  onBlur={() => setEditingSlug(false)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingSlug(false)}
                  className="text-sm font-black text-[#3b82f6] border-none outline-none bg-transparent min-w-[120px]"
                />
              </div>
              <p className={`text-[10px] font-bold text-right px-1 ${slug.length > 55 ? "text-amber-500" : "text-slate-400"}`}>
                {slug.length} / 60 characters
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <div
                onClick={() => setEditingSlug(true)}
                className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-2 rounded-xl cursor-pointer hover:border-[#3b82f6] transition-all group"
              >
                <span className="text-sm font-bold text-slate-400">yourdomain.com/</span>
                <span className="text-sm font-black text-[#3b82f6]">{slug || "sample-post"}</span>
                <Edit3 size={13} className="text-slate-300 group-hover:text-[#3b82f6] ml-1" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 text-right px-1">
                {slug.length} / 60 characters
              </p>
            </div>
          )}
        </div>
      </div>
      )}

      {/* ── Toolbar ── */}
      <div className={`bg-white flex items-center flex-wrap gap-1 ${
        hideTitle 
          ? "border-b border-slate-200 px-4 py-2.5" 
          : "border border-[#E2E8F0] rounded-2xl px-3 py-2 shadow-sm"
      }`}>
        {/* Undo / Redo */}
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo" disabled={!editor.can().undo()}>
          <Undo2 size={16} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo" disabled={!editor.can().redo()}>
          <Redo2 size={16} />
        </ToolbarBtn>

        <Sep />

        {/* Heading Dropdown */}
        <HeadingDropdown editor={editor} />

        <Sep />

        {/* Inline formatting */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        ><Bold size={17} /></ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        ><Italic size={17} /></ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline (Ctrl+U)"
        ><UnderlineIcon size={17} /></ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline Code"
        ><Code size={17} /></ToolbarBtn>

        <Sep />

        {/* Link */}
        <ToolbarBtn
          onClick={() => setLinkOpen(true)}
          active={editor.isActive("link")}
          title="Insert Link (Ctrl+K)"
        ><LinkIcon size={17} /></ToolbarBtn>

        {/* Blockquote */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        ><Quote size={17} /></ToolbarBtn>

        {/* Horizontal Rule */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Divider"
        ><Minus size={17} /></ToolbarBtn>

        <Sep />

        {/* Lists */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        ><List size={17} /></ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered List"
        ><ListOrdered size={17} /></ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          active={editor.isActive("taskList")}
          title="Task / Checklist"
        ><CheckSquare size={17} /></ToolbarBtn>

        <Sep />

        {/* Table */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title="Insert Table"
        ><TableIcon size={17} /></ToolbarBtn>

        {/* Code Block */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <span className="text-[11px] font-black">&lt;/&gt;</span>
        </ToolbarBtn>

        <Sep />

        {/* Image Upload */}
        <ImageUploadButton
          editor={editor}
          onUploadStart={() => setUploading(true)}
          onUploadEnd={() => setUploading(false)}
        />

        {/* YouTube Embed */}
        <ToolbarBtn onClick={() => setYtOpen(true)} title="Embed YouTube Video">
          <Video size={17} />
        </ToolbarBtn>

        {uploading && (
          <span className="flex items-center gap-1.5 text-[11px] font-black text-blue-600 ml-2">
            <Loader2 size={14} className="animate-spin" /> Uploading...
          </span>
        )}

        <div className="flex-1" />

        {/* Table controls (context-aware) */}
        {editor.isActive("table") && (
          <div className="flex items-center gap-1 mr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="px-2 py-1 text-[10px] font-black bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-all"
              title="Add Column"
            >+Col</button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="px-2 py-1 text-[10px] font-black bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-all"
              title="Add Row"
            >+Row</button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="px-2 py-1 text-[10px] font-black bg-red-50 hover:bg-red-100 rounded-lg text-red-500 transition-all"
              title="Delete Table"
            >Del</button>
          </div>
        )}
      </div>

      {/* ── Floating Bubble Toolbar (appears on text selection) ── */}
      {editor && (
        <BubbleMenu
          editor={editor}
          options={{ placement: "top", arrow: false }}
          className="flex items-center gap-0.5 bg-[#0F172A] border border-white/10 shadow-2xl shadow-black/40 rounded-2xl px-2 py-1.5 animate-fade-in"
        >
          {/* Heading Options */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}
            className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all ${ editor.isActive("heading", { level: 1 }) ? "bg-[#FACC15] text-[#0F172A]" : "text-white/70 hover:text-white hover:bg-white/10" }`}
            title="Heading 1 — H1 (main title)"
          >H1</button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
            className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all ${ editor.isActive("heading", { level: 2 }) ? "bg-[#FACC15] text-[#0F172A]" : "text-white/70 hover:text-white hover:bg-white/10" }`}
            title="Heading 2 — H2 (section)"
          >H2</button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
            className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all ${ editor.isActive("heading", { level: 3 }) ? "bg-[#FACC15] text-[#0F172A]" : "text-white/70 hover:text-white hover:bg-white/10" }`}
            title="Heading 3 — H3 (sub-section)"
          >H3</button>

          <div className="w-px h-4 bg-white/20 mx-1" />

          {/* Inline formatting */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
            className={`p-1.5 rounded-lg transition-all ${ editor.isActive("bold") ? "bg-[#FACC15] text-[#0F172A]" : "text-white/70 hover:text-white hover:bg-white/10" }`}
            title="Bold"
          ><Bold size={14}/></button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
            className={`p-1.5 rounded-lg transition-all ${ editor.isActive("italic") ? "bg-[#FACC15] text-[#0F172A]" : "text-white/70 hover:text-white hover:bg-white/10" }`}
            title="Italic"
          ><Italic size={14}/></button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
            className={`p-1.5 rounded-lg transition-all ${ editor.isActive("underline") ? "bg-[#FACC15] text-[#0F172A]" : "text-white/70 hover:text-white hover:bg-white/10" }`}
            title="Underline"
          ><UnderlineIcon size={14}/></button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleCode().run(); }}
            className={`p-1.5 rounded-lg transition-all ${ editor.isActive("code") ? "bg-[#FACC15] text-[#0F172A]" : "text-white/70 hover:text-white hover:bg-white/10" }`}
            title="Inline Code"
          ><Code size={14}/></button>

          <div className="w-px h-4 bg-white/20 mx-1" />

          {/* Quote */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
            className={`p-1.5 rounded-lg transition-all ${ editor.isActive("blockquote") ? "bg-[#FACC15] text-[#0F172A]" : "text-white/70 hover:text-white hover:bg-white/10" }`}
            title="Blockquote / Note"
          ><Quote size={14}/></button>

          {/* Link */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setLinkOpen(true); }}
            className={`p-1.5 rounded-lg transition-all ${ editor.isActive("link") ? "bg-[#FACC15] text-[#0F172A]" : "text-white/70 hover:text-white hover:bg-white/10" }`}
            title="Insert Link"
          ><LinkIcon size={14}/></button>
        </BubbleMenu>
      )}

      {/* ── Editor Surface ── */}
      <div className={`${
        hideTitle 
          ? "p-4 min-h-[500px]" 
          : "bg-white rounded-[24px] border border-slate-200 shadow-sm p-10 lg:p-14 min-h-[600px]"
      } relative group transition-colors`}>
        {/* Block handle (+) for adding blocks */}
        {!hideTitle && (
          <div className="absolute left-5 top-12 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => editor.chain().focus().run()}
              className="w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-[#0F172A] hover:border-[#FACC15] shadow-sm transition-all"
              title="Add block"
            >
              <Plus size={15} />
            </button>
          </div>
        )}

        <div className={`${hideTitle ? "pl-0" : "pl-5"} relative`}>
          {editor && editor.isFocused && editor.isEmpty && !showSlashMenu && (
            <div className="absolute left-0 top-0 mt-3 flex items-center gap-2 text-slate-300 animate-pulse-subtle pointer-events-none">
               <Plus size={14} className="text-[#3b82f6]" />
               <span className="text-sm font-medium">Type <span className="font-black text-[#3b82f6]">/</span> for commands...</span>
            </div>
          )}

          {editor && showSlashMenu && (
            <div 
              className="fixed bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-2 w-[260px] animate-slide-up outline-none ring-1 ring-black/5 overflow-hidden backdrop-blur-sm bg-white/95 z-[100]"
              style={{ top: slashMenuPos.top, left: slashMenuPos.left }}
            >
              <div className="px-3 py-2 border-b border-slate-50 mb-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blocks & Media</p>
              </div>
              <div className="grid grid-cols-1 gap-0.5 max-h-[300px] overflow-y-auto custom-scrollbar">
                 <CommandItem 
                    icon={<span className="font-black text-xs">H1</span>} 
                    label="Heading 1" 
                    description="Main article heading" 
                    onClick={() => {
                        editor.chain().focus().deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from }).toggleHeading({ level: 1 }).run();
                        setShowSlashMenu(false);
                    }} 
                 />
                 <CommandItem 
                    icon={<span className="font-black text-xs italic">H2</span>} 
                    label="Heading 2" 
                    description="Series of sections" 
                    onClick={() => {
                        editor.chain().focus().deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from }).toggleHeading({ level: 2 }).run();
                        setShowSlashMenu(false);
                    }} 
                 />
                 <CommandItem 
                    icon={<List size={16} />} 
                    label="Bullet List" 
                    description="Simple point list" 
                    onClick={() => {
                        editor.chain().focus().deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from }).toggleBulletList().run();
                        setShowSlashMenu(false);
                    }} 
                 />
                 <CommandItem 
                    icon={<ImageIcon size={16} />} 
                    label="Image" 
                    description="Add a physics visual" 
                    onClick={() => {
                      editor.chain().focus().deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from }).run();
                      setShowSlashMenu(false);
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = async (e: any) => {
                          const file = e.target.files[0];
                          if (file) {
                              try {
                                  const compressedFile = await compressImageToFile(file);
                                  const fd = new FormData();
                                  fd.append("file", compressedFile);
                                  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                                  if (!res.ok) {
                                      const errorData = await res.json().catch(() => ({}));
                                      throw new Error(errorData.error || "Upload failed");
                                  }
                                  const data = await res.json();
                                  if (data.url) {
                                      editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
                                  } else {
                                      throw new Error("No URL returned from server");
                                  }
                              } catch (err: any) {
                                  console.error("Upload failed", err);
                                  alert(err.message || "Failed to upload image. Please try again.");
                              }
                          }
                      };
                      input.click();
                    }} 
                 />
                 <CommandItem 
                    icon={<Video size={16} />} 
                    label="YouTube" 
                    description="Embed video player" 
                    onClick={() => {
                        editor.chain().focus().deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from }).run();
                        setShowSlashMenu(false);
                        setYtOpen(true);
                    }} 
                 />
              </div>
            </div>
          )}

          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Modals */}
      <LinkModal editor={editor} open={linkOpen} onClose={() => setLinkOpen(false)} />
      <YoutubeModal editor={editor} open={ytOpen} onClose={() => setYtOpen(false)} />
    </div>
  );
}

/* ─── Tiny helpers ─────────────────────────────── */
function ToolbarBtn({
  onClick,
  children,
  title,
  active,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  title: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // keeps editor focus
        if (!disabled) onClick();
      }}
      title={title}
      disabled={disabled}
      className={`p-1.5 rounded-xl transition-all flex items-center justify-center min-w-[34px] h-[34px] disabled:opacity-30 disabled:cursor-not-allowed ${
        active
          ? "bg-[#FACC15] text-[#0F172A] shadow-sm"
          : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-5 bg-slate-100 mx-0.5 self-center" />;
}

function CommandItem({ icon, label, description, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#FACC15]/10 rounded-xl transition-all group text-left"
    >
      <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-[#0F172A] group-hover:bg-[#FACC15] transition-all group-hover:border-transparent">
        {icon}
      </div>
      <div>
        <p className="text-[13px] font-black text-[#0F172A] leading-tight group-hover:text-[#0F172A]">{label}</p>
        <p className="text-[10px] font-bold text-slate-400 truncate w-[160px]">{description}</p>
      </div>
    </button>
  );
}

function parsePlaintextToHtml(text: string): string {
  // Pre-process text to place block equations $$...$$ on their own lines
  let processedText = text.replace(/([^\n])\s*\$\$([\s\S]+?)\$\$\s*([^\n])/g, "$1\n$$$$$2$$$$\n$3");
  processedText = processedText.replace(/^([^\n]+?)\s*\$\$([\s\S]+?)\$\$/gm, "$1\n$$$$$2$$$$");
  processedText = processedText.replace(/\$\$([\s\S]+?)\$\$\s*([^\n]+)$/gm, "$$$$$1$$$$\n$2");

  const lines = processedText.split(/\r?\n/);
  const htmlParts: string[] = [];
  
  let currentParagraphLines: string[] = [];
  let inList: "ul" | "ol" | null = null;
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const pText = currentParagraphLines.join(" ").trim();
      if (pText) {
        // Replace markdown links and inline equations
        let processed = pText
          .replace(/\[([^\]]+)\]\s*\(([^)]+)\)/g, '<a href="$2">$1</a>')
          .replace(/\$\$([^$]+)\$\$/g, (_m, eq) => `<code>${eq.trim()}</code>`)
          .replace(/\$([^$\n]+)\$/g, (_m, eq) => `<code>${eq.trim()}</code>`);
        htmlParts.push(`<p>${processed}</p>`);
      }
      currentParagraphLines = [];
    }
  };

  const flushList = () => {
    if (inList && listItems.length > 0) {
      let listHtml = inList === "ul" ? "<ul>" : "<ol>";
      listItems.forEach(item => {
        let processed = item
          .replace(/\[([^\]]+)\]\s*\(([^)]+)\)/g, '<a href="$2">$1</a>')
          .replace(/\$\$([^$]+)\$\$/g, (_m, eq) => `<code>${eq.trim()}</code>`)
          .replace(/\$([^$\n]+)\$/g, (_m, eq) => `<code>${eq.trim()}</code>`);
        listHtml += `<li>${processed}</li>`;
      });
      listHtml += inList === "ul" ? "</ul>" : "</ol>";
      htmlParts.push(listHtml);
      listItems = [];
      inList = null;
    }
  };

  const getSeparator = (l: string) => {
    if (l.includes("|")) return "|";
    if (l.includes("\t")) return "\t";
    if (/\s{2,}/.test(l)) return "MULTISPACE";
    return null;
  };

  const getCellsCount = (l: string, sep: string) => {
    if (sep === "|") {
      return l.replace(/^\||\|$/g, "").split("|").length;
    } else if (sep === "MULTISPACE") {
      return l.split(/\s{2,}/).length;
    } else {
      return l.split(sep).length;
    }
  };

  const isShortHeading = (l: string) => {
    if (!/^[A-Z0-9💡📌⚙️📐🔍]/.test(l)) return false;
    if (/[.,:;]$/.test(l)) return false;
    if (l.length > 80) return false;
    if (l.includes("=") || l.includes("\\") || l.includes("$$")) return false;
    if (/^[\*\-\+]\s+/.test(l)) return false;
    const words = l.split(/\s+/);
    if (words.length > 10) return false;
    
    const capitalizedWords = words.filter(w => {
      const cleanWord = w.replace(/^[("']|[)"']$/g, "");
      if (!cleanWord) return true;
      return /^[A-Z0-9]/.test(cleanWord) || /^(of|in|the|and|a|to|for|on|by|with|or|as|at|but|by|if|nor|off|out|per|up|via)$/i.test(cleanWord);
    });
    return capitalizedWords.length / words.length >= 0.75;
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    
    if (!line) {
      flushParagraph();
      flushList();
      i++;
      continue;
    }

    // Check if this is the start of a table using our robust multi-line column count detection
    const sep = getSeparator(line);
    if (sep && i < lines.length - 1) {
      const nextLine = lines[i+1].trim();
      const nextSep = getSeparator(nextLine);
      if (nextSep === sep) {
        const cols1 = getCellsCount(line, sep);
        const cols2 = getCellsCount(nextLine, sep);
        if (cols1 >= 2 && cols2 >= 2) {
          flushParagraph();
          flushList();
          const tableLines: string[] = [];
          // Consume all lines that belong to this table (contain the separator and cells >= 2)
          while (i < lines.length && getSeparator(lines[i]) === sep && getCellsCount(lines[i], sep) >= 2) {
            tableLines.push(lines[i]);
            i++;
          }
          
          const parsedTable = parseTableLinesToHtml(tableLines);
          if (parsedTable) {
            htmlParts.push(parsedTable);
          } else {
            tableLines.forEach(tl => {
              currentParagraphLines.push(tl);
            });
          }
          continue;
        }
      }
    }

    // Check for bullet or numbered list
    const bulletMatch = line.match(/^[\*\-\+]\s+(.+)$/);
    const numMatch = line.match(/^(\d+)\.\s+(.+)$/);

    if (bulletMatch || numMatch) {
      let isHeading = false;
      if (numMatch) {
        const titleText = numMatch[2].trim();
        isHeading = titleText.includes("?") || 
                    titleText.includes(":") || 
                    (titleText.split(" ").length > 2 && /^[A-Z]/.test(titleText));
      }

      if (isHeading) {
        flushParagraph();
        flushList();
        let processed = numMatch![2]
          .replace(/\[([^\]]+)\]\s*\(([^)]+)\)/g, '<a href="$2">$1</a>')
          .replace(/\$\$([^$]+)\$\$/g, (_m, eq) => `<code>${eq.trim()}</code>`)
          .replace(/\$([^$\n]+)\$/g, (_m, eq) => `<code>${eq.trim()}</code>`);
        htmlParts.push(`<h2>${numMatch![1]}. ${processed}</h2>`);
        i++;
        continue;
      }

      flushParagraph();
      const type = bulletMatch ? "ul" : "ol";
      const content = bulletMatch ? bulletMatch[1] : numMatch![2];

      if (inList && inList !== type) {
        flushList();
      }

      inList = type;
      listItems.push(content);
      i++;
      continue;
    }

    flushList();

    // Check for subheadings like "A. Kinetic Energy"
    const alphaHeadingMatch = line.match(/^([A-Z])\.\s+(.+)$/);
    if (alphaHeadingMatch) {
      flushParagraph();
      let processed = alphaHeadingMatch[2]
        .replace(/\[([^\]]+)\]\s*\(([^)]+)\)/g, '<a href="$2">$1</a>')
        .replace(/\$\$([^$]+)\$\$/g, (_m, eq) => `<code>${eq.trim()}</code>`)
        .replace(/\$([^$\n]+)\$/g, (_m, eq) => `<code>${eq.trim()}</code>`);
      htmlParts.push(`<h3>${alphaHeadingMatch[1]}. ${processed}</h3>`);
      i++;
      continue;
    }

    // Check for standalone link (e.g. in list of curated guides)
    const standaloneLinkMatch = line.match(/^\[([^\]]+)\]\s*\(([^)]+)\)$/);
    if (standaloneLinkMatch) {
      flushParagraph();
      htmlParts.push(`<p><a href="${standaloneLinkMatch[2]}">${standaloneLinkMatch[1]}</a></p>`);
      i++;
      continue;
    }

    // Check for blockquote / Note / Important / 💡 / >
    const isCallout = 
      /^\s*(Note|Important|Key\s+Point|Formula|Definition|Example|Real-World\s+Example|Caution|Warning|SEO\s+Insight|Internal\s+Link|SI\s+Unit|Summary)\b.*?:/i.test(line) ||
      line.startsWith("💡") ||
      line.startsWith("📌") ||
      line.startsWith(">");

    if (isCallout) {
      flushParagraph();
      let cleanLine = line;
      if (line.startsWith(">")) {
        cleanLine = line.substring(1).trim();
      }
      let processed = cleanLine
        .replace(/\[([^\]]+)\]\s*\(([^)]+)\)/g, '<a href="$2">$1</a>')
        .replace(/\$\$([^$]+)\$\$/g, (_m, eq) => `<code>${eq.trim()}</code>`)
        .replace(/\$([^$\n]+)\$/g, (_m, eq) => `<code>${eq.trim()}</code>`);
      htmlParts.push(`<blockquote>${processed}</blockquote>`);
      i++;
      continue;
    }

    // Check for standalone block LaTeX $$...$$
    if (/^\$\$[\s\S]+\$\$$/.test(line)) {
      flushParagraph();
      const inner = line.replace(/^\$\$|\$\$/g, "").trim();
      htmlParts.push(`<pre><code>${inner}</code></pre>`);
      i++;
      continue;
    }

    // Block LaTeX spanning lines
    if (line.startsWith("$$")) {
      flushParagraph();
      let blockContent = line;
      let j = i + 1;
      while (j < lines.length && !lines[j-1].endsWith("$$") && !blockContent.endsWith("$$")) {
        blockContent += "\n" + lines[j];
        j++;
      }
      const inner = blockContent.replace(/^\$\$|\$\$/g, "").trim();
      htmlParts.push(`<pre><code>${inner}</code></pre>`);
      i = j;
      continue;
    }

    // Check for YouTube Embed link
    const ytMatch = line.match(/https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch && (line.toLowerCase().includes("youtube") || line.toLowerCase().includes("video") || line.toLowerCase().includes("embed"))) {
      flushParagraph();
      const videoId = ytMatch[1];
      htmlParts.push(`<div data-youtube-video=""><iframe src="https://www.youtube.com/embed/${videoId}" width="640" height="360" allowfullscreen="true"></iframe></div>`);
      i++;
      continue;
    }

    // Check for standalone equation line: W = F * d, E = mgh
    if (/^[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*.+$/.test(line) && !line.includes("<") && !line.includes(">") && line.length < 100) {
      flushParagraph();
      htmlParts.push(`<pre><code>${line}</code></pre>`);
      i++;
      continue;
    }

    // Check for short headings
    if (isShortHeading(line)) {
      flushParagraph();
      let processed = line
        .replace(/\[([^\]]+)\]\s*\(([^)]+)\)/g, '<a href="$2">$1</a>')
        .replace(/\$\$([^$]+)\$\$/g, (_m, eq) => `<code>${eq.trim()}</code>`)
        .replace(/\$([^$\n]+)\$/g, (_m, eq) => `<code>${eq.trim()}</code>`);
      htmlParts.push(`<h3>${processed}</h3>`);
      i++;
      continue;
    }

    currentParagraphLines.push(line);
    i++;
  }

  flushParagraph();
  flushList();

  return htmlParts.join("\n");
}

function parseTableLinesToHtml(lines: string[]): string | null {
  if (lines.length < 2) return null;

  const firstLine = lines[0].trim();
  const separator = firstLine.includes("|") 
    ? "|" 
    : firstLine.includes("\t") 
      ? "\t" 
      : /\s{2,}/.test(firstLine) 
        ? "MULTISPACE" 
        : null;

  if (!separator) return null;

  const getCells = (line: string) => {
    if (separator === "|") {
      const clean = line.replace(/^\||\|$/g, "");
      return clean.split("|").map(s => s.trim());
    } else if (separator === "MULTISPACE") {
      return line.split(/\s{2,}/).map(s => s.trim());
    } else {
      return line.split(separator).map(s => s.trim());
    }
  };

  const headers = getCells(firstLine);
  if (headers.length < 2) return null;

  let startIndex = 1;
  const secondLine = lines[1].trim();
  if (secondLine.includes("-") && (secondLine.includes("|") || secondLine.includes("---") || secondLine.includes("- -"))) {
    startIndex = 2;
  }

  let html = `<table><thead><tr>`;
  headers.forEach(h => {
    let processed = h
      .replace(/\$\$([^$]+)\$\$/g, (_m, eq) => `<code>${eq.trim()}</code>`)
      .replace(/\$([^$\n]+)\$/g, (_m, eq) => `<code>${eq.trim()}</code>`);
    html += `<th>${processed}</th>`;
  });
  html += `</tr></thead><tbody>`;

  let validRows = 0;
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cells = getCells(line);
    if (cells.length === 0) continue;
    
    html += `<tr>`;
    for (let c = 0; c < headers.length; c++) {
      let cellText = cells[c] || "";
      let processed = cellText
        .replace(/\$\$([^$]+)\$\$/g, (_m, eq) => `<code>${eq.trim()}</code>`)
        .replace(/\$([^$\n]+)\$/g, (_m, eq) => `<code>${eq.trim()}</code>`);
      html += `<td>${processed}</td>`;
    }
    html += `</tr>`;
    validRows++;
  }
  html += `</tbody></table>`;

  return validRows > 0 ? html : null;
}

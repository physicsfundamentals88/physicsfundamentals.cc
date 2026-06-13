"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit3, Trash2, ExternalLink } from "lucide-react";

export default function AdminBlogListing() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [search, setSearch] = useState("");
  const [bulkAction, setBulkAction] = useState("");

  useEffect(() => {
    fetch("/api/admin/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleSelectAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map((a) => a.id));
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const filtered = articles.filter((a) => {
    const matchesSearch = a.title?.toLowerCase().includes(search.toLowerCase()) || !search;
    const matchesFilter =
      filter === "all" ||
      (filter === "published" && a.status?.toLowerCase() !== "draft") ||
      (filter === "draft" && a.status?.toLowerCase() === "draft");
    return matchesSearch && matchesFilter;
  });

  const published = articles.filter((a) => a.status?.toLowerCase() !== "draft").length;
  const drafts = articles.filter((a) => a.status?.toLowerCase() === "draft").length;

  const handleDelete = async (id: number) => {
    if (!confirm("Move this post to trash?")) return;
    const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    if (res.ok) setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleBulkAction = async () => {
    if (selected.length === 0) {
      alert("Please select at least one post.");
      return;
    }
    if (!bulkAction || bulkAction === "Bulk actions") {
      alert("Please select a bulk action.");
      return;
    }

    if (bulkAction === "delete") {
      if (!confirm(`Are you sure you want to move the ${selected.length} selected post(s) to trash?`)) return;
      setLoading(true);
      try {
        await Promise.all(
          selected.map((id) => fetch(`/api/admin/articles/${id}`, { method: "DELETE" }))
        );
        setArticles((prev) => prev.filter((a) => !selected.includes(a.id)));
        setSelected([]);
      } catch (err) {
        console.error("Bulk delete failed:", err);
        alert("Failed to delete some posts.");
      } finally {
        setLoading(false);
      }
    } else if (bulkAction === "publish" || bulkAction === "draft") {
      const statusToSet = bulkAction === "publish" ? "Published" : "Draft";
      if (!confirm(`Are you sure you want to change the status of ${selected.length} selected post(s) to ${statusToSet}?`)) return;
      setLoading(true);
      try {
        await Promise.all(
          selected.map((id) => {
            const articleObj = articles.find((a) => a.id === id);
            return fetch(`/api/admin/articles/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...articleObj,
                status: statusToSet,
              }),
            });
          })
        );
        setArticles((prev) =>
          prev.map((a) => (selected.includes(a.id) ? { ...a, status: statusToSet } : a))
        );
        setSelected([]);
      } catch (err) {
        console.error("Bulk status update failed:", err);
        alert("Failed to update status.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="wp-animate-in">
      {/* Page Header */}
      <div className="wp-page-header">
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <h1 className="wp-page-title">Posts</h1>
          <Link href="/admin/blog/create" style={{ fontSize: 13, color: "var(--wp-blue)", textDecoration: "none" }}>
            Add New Post
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="wp-table-wrap">
        {/* Top nav */}
        <div className="wp-table-nav">
          {/* Filter tabs */}
          <div className="wp-filter-tabs">
            <button
              className={`wp-filter-tab ${filter === "all" ? "wp-filter-tab--active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All ({articles.length})
            </button>
            <span className="wp-filter-tab-sep">|</span>
            <button
              className={`wp-filter-tab ${filter === "published" ? "wp-filter-tab--active" : ""}`}
              onClick={() => setFilter("published")}
            >
              Published ({published})
            </button>
            <span className="wp-filter-tab-sep">|</span>
            <button
              className={`wp-filter-tab ${filter === "draft" ? "wp-filter-tab--active" : ""}`}
              onClick={() => setFilter("draft")}
            >
              Drafts ({drafts})
            </button>
          </div>

          {/* Search */}
          <div className="wp-search-box">
            <input
              type="text"
              className="wp-search-input"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="wp-btn wp-btn-secondary wp-btn-sm">Search</button>
          </div>
        </div>

        {/* Bulk actions bar */}
        <div style={{ padding: "8px 12px", background: "#f6f7f7", borderBottom: "1px solid var(--wp-border)", display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <select
            className="wp-select"
            style={{ width: "auto", padding: "4px 8px", fontSize: 12 }}
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
          >
            <option value="">Bulk actions</option>
            <option value="delete">Delete</option>
            <option value="publish">Publish</option>
            <option value="draft">Move to Draft</option>
          </select>
          <button
            className="wp-btn wp-btn-secondary wp-btn-sm"
            onClick={handleBulkAction}
          >
            Apply
          </button>
          {selected.length > 0 && (
            <span style={{ color: "var(--wp-text-muted)", fontSize: 12 }}>
              {selected.length} item{selected.length > 1 ? "s" : ""} selected
            </span>
          )}
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table className="wp-table">
            <thead>
              <tr>
                <th style={{ width: 32 }}>
                  <input
                    type="checkbox"
                    className="wp-checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Title</th>
                <th>Author</th>
                <th>Categories</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="wp-loading-row">
                  <td colSpan={6}>Loading posts...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr className="wp-loading-row">
                  <td colSpan={6}>
                    No posts found.{" "}
                    <Link href="/admin/blog/create" style={{ color: "var(--wp-blue)" }}>
                      Create your first post
                    </Link>
                  </td>
                </tr>
              ) : (
                filtered.map((article) => (
                  <tr key={article.id} style={selected.includes(article.id) ? { background: "#f0f6fc" } : {}}>
                    <td>
                      <input
                        type="checkbox"
                        className="wp-checkbox"
                        checked={selected.includes(article.id)}
                        onChange={() => toggleSelect(article.id)}
                      />
                    </td>
                    <td>
                      <div>
                        <Link href={`/admin/blog/${article.id}`} className="wp-post-title">
                          {article.title}
                        </Link>
                        <div className="row-actions">
                          <Link href={`/admin/blog/${article.id}`} className="wp-row-action-link">
                            Edit
                          </Link>
                          <span className="wp-row-action-sep">|</span>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="wp-row-action-link wp-row-action-link--danger"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }}
                          >
                            Trash
                          </button>
                          <span className="wp-row-action-sep">|</span>
                          <Link
                            href={`/blog/${article.slug}`}
                            target="_blank"
                            className="wp-row-action-link"
                          >
                            View
                          </Link>
                        </div>
                        {article.slug && (
                          <div style={{ fontSize: 11, color: "var(--wp-text-muted)", marginTop: 2, fontFamily: "monospace" }}>
                            /{article.slug}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12 }}>
                      {article.author || "Admin"}
                    </td>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12 }}>
                      <Link
                        href="/admin/categories"
                        style={{ color: "var(--wp-blue)", textDecoration: "none", fontSize: 12 }}
                      >
                        {article.category || "Uncategorized"}
                      </Link>
                    </td>
                    <td>
                      <span className={`wp-badge ${article.status?.toLowerCase() === "draft" ? "wp-badge--draft" : "wp-badge--published"}`}>
                        {article.status || "Published"}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12, color: "var(--wp-text-muted)" }}>
                      {article.date || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="wp-pagination">
          <span>{filtered.length} item{filtered.length !== 1 ? "s" : ""}</span>
          <span style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            <button className="wp-page-btn">‹</button>
            <button className="wp-page-btn" style={{ background: "var(--wp-blue)", color: "white", borderColor: "var(--wp-blue)" }}>1</button>
            <button className="wp-page-btn">›</button>
          </span>
        </div>
      </div>
    </div>
  );
}

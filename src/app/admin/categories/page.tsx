"use client";

import React, { useState, useEffect } from "react";
import { Edit3, Trash2 } from "lucide-react";

const defaultCategories = [
  { id: 1, name: "Electromagnetism", slug: "electromagnetism", count: 12, description: "Study of electromagnetic fields and forces" },
  { id: 2, name: "Thermodynamics", slug: "thermodynamics", count: 8, description: "Heat, temperature, and energy transfer" },
  { id: 3, name: "Quantum Physics", slug: "quantum-physics", count: 5, description: "Subatomic phenomena and wave-particle duality" },
  { id: 4, name: "Classical Mechanics", slug: "mechanics", count: 15, description: "Motion, forces and classical systems" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(defaultCategories);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newParent, setNewParent] = useState("None");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [bulkAction, setBulkAction] = useState("");
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/articles")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setArticles(data);
        }
      })
      .catch((err) => console.error("Failed to load articles for category counts:", err));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("sa_categories_list");
    if (saved) {
      try {
        setCategories(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved categories:", e);
      }
    } else {
      localStorage.setItem("sa_categories_list", JSON.stringify(defaultCategories));
    }
  }, []);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newName.trim()) return;
    const slug = newSlug || newName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const updated = [
      ...categories,
      { id: Date.now(), name: newName.trim(), slug, count: 0, description: newDesc },
    ];
    setCategories(updated);
    localStorage.setItem("sa_categories_list", JSON.stringify(updated));
    setNewName(""); setNewSlug(""); setNewDesc(""); setNewParent("None");
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this category?")) return;
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    localStorage.setItem("sa_categories_list", JSON.stringify(updated));
    if (editingId === id) handleCancel();
  };

  const handleEditClick = (cat: any) => {
    setEditingId(cat.id);
    setNewName(cat.name);
    setNewSlug(cat.slug);
    setNewDesc(cat.description || "");
    setNewParent("None");
  };

  const handleUpdate = () => {
    if (!newName.trim()) return;
    const slug = newSlug || newName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const updated = categories.map((c) =>
      c.id === editingId
        ? { ...c, name: newName.trim(), slug, description: newDesc }
        : c
    );
    setCategories(updated);
    localStorage.setItem("sa_categories_list", JSON.stringify(updated));
    // Reset form
    setNewName("");
    setNewSlug("");
    setNewDesc("");
    setEditingId(null);
  };

  const handleCancel = () => {
    setNewName("");
    setNewSlug("");
    setNewDesc("");
    setEditingId(null);
  };

  const handleBulkAction = () => {
    if (selected.length === 0) {
      alert("Please select at least one category.");
      return;
    }
    if (bulkAction === "delete") {
      if (!confirm(`Are you sure you want to delete the ${selected.length} selected category(ies)?`)) return;
      const updated = categories.filter((c) => !selected.includes(c.id));
      setCategories(updated);
      localStorage.setItem("sa_categories_list", JSON.stringify(updated));
      if (editingId && selected.includes(editingId)) handleCancel();
      setSelected([]);
    }
  };

  const toggleSelect = (id: number) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((c) => c.id));

  return (
    <div className="wp-animate-in">
      <div className="wp-page-header">
        <h1 className="wp-page-title">Categories</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20, alignItems: "flex-start" }}>
        {/* Add/Edit Category */}
        <div className="wp-metabox">
          <div className="wp-metabox-header">
            <h2 className="wp-metabox-title">
              {editingId ? `Edit Category: ${categories.find(c => c.id === editingId)?.name || ""}` : "Add New Category"}
            </h2>
          </div>
          <div className="wp-metabox-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="wp-form-row" style={{ marginBottom: 0 }}>
              <label className="wp-label">Name <span style={{ color: "var(--wp-red)" }}>*</span></label>
              <input
                type="text"
                className="wp-input"
                placeholder="e.g. Astrophysics"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                }}
              />
              <p className="wp-input-note">The name is how it appears on your site.</p>
            </div>

            <div className="wp-form-row" style={{ marginBottom: 0 }}>
              <label className="wp-label">Slug</label>
              <input
                type="text"
                className="wp-input"
                placeholder="e.g. astrophysics"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
              />
              <p className="wp-input-note">The "slug" is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.</p>
            </div>

            <div className="wp-form-row" style={{ marginBottom: 0 }}>
              <label className="wp-label">Parent Category</label>
              <select
                className="wp-select"
                value={newParent}
                onChange={(e) => setNewParent(e.target.value)}
              >
                <option>None</option>
                {categories.map((c) => <option key={c.id}>{c.name}</option>)}
              </select>
              <p className="wp-input-note">Unlike tags, categories can have a hierarchy.</p>
            </div>

            <div className="wp-form-row" style={{ marginBottom: 0 }}>
              <label className="wp-label">Description</label>
              <textarea
                className="wp-textarea"
                placeholder="Category description (optional)"
                rows={4}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
              <p className="wp-input-note">The description is not prominent by default.</p>
            </div>

            {editingId ? (
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="wp-btn wp-btn-primary"
                  onClick={handleUpdate}
                >
                  Save Changes
                </button>
                <button
                  className="wp-btn wp-btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="wp-btn wp-btn-primary"
                onClick={handleAdd}
                style={{ alignSelf: "flex-start" }}
              >
                Add New Category
              </button>
            )}
          </div>
        </div>

        {/* Categories Table */}
        <div className="wp-table-wrap">
          <div className="wp-table-nav">
            <div className="wp-filter-tabs">
              <span style={{ fontSize: 13, color: "var(--wp-text)" }}>All ({categories.length})</span>
            </div>
            <div className="wp-search-box">
              <input
                type="text"
                className="wp-search-input"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="wp-btn wp-btn-secondary wp-btn-sm">Search</button>
            </div>
          </div>

          {/* Bulk actions */}
          <div style={{ padding: "8px 12px", background: "#f6f7f7", borderBottom: "1px solid var(--wp-border)", display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <select
              className="wp-select"
              style={{ width: "auto", padding: "4px 8px", fontSize: 12 }}
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
            >
              <option value="">Bulk actions</option>
              <option value="delete">Delete</option>
            </select>
            <button
              className="wp-btn wp-btn-secondary wp-btn-sm"
              onClick={handleBulkAction}
            >
              Apply
            </button>
            {selected.length > 0 && (
              <span style={{ color: "var(--wp-text-muted)", fontSize: 12 }}>
                {selected.length} selected
              </span>
            )}
          </div>

          <table className="wp-table">
            <thead>
              <tr>
                <th style={{ width: 32 }}>
                  <input
                    type="checkbox"
                    className="wp-checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th>Name</th>
                <th>Description</th>
                <th>Slug</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr className="wp-loading-row">
                  <td colSpan={5}>No categories found.</td>
                </tr>
              ) : (
                filtered.map((cat) => (
                  <tr key={cat.id} style={selected.includes(cat.id) ? { background: "#f0f6fc" } : {}}>
                    <td>
                      <input
                        type="checkbox"
                        className="wp-checkbox"
                        checked={selected.includes(cat.id)}
                        onChange={() => toggleSelect(cat.id)}
                      />
                    </td>
                    <td>
                      <strong style={{ fontSize: 13, color: "var(--wp-text)" }}>{cat.name}</strong>
                      <div className="row-actions">
                        <button
                          className="wp-row-action-link"
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }}
                          onClick={() => handleEditClick(cat)}
                        >
                          Edit
                        </button>
                        <span className="wp-row-action-sep">|</span>
                        <button
                          className="wp-row-action-link wp-row-action-link--danger"
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }}
                          onClick={() => handleDelete(cat.id)}
                        >
                          Delete
                        </button>
                        <span className="wp-row-action-sep">|</span>
                        <a href={`/blog?category=${cat.name}`} target="_blank" className="wp-row-action-link">
                          View
                        </a>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--wp-text-muted)" }}>
                      {cat.description || "—"}
                    </td>
                    <td style={{ fontSize: 12, fontFamily: "monospace", color: "var(--wp-text-muted)" }}>
                      {cat.slug}
                    </td>
                    <td style={{ fontSize: 13 }}>
                      {articles.filter((a) => (a.category || "Uncategorized").toLowerCase() === cat.name.toLowerCase()).length}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="wp-pagination">
            <span>{filtered.length} item{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

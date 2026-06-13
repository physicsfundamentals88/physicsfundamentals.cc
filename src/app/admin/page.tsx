"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Layers,
  Plus,
  TrendingUp,
  Edit3,
  ExternalLink,
  Clock,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, categories: 0 });
  const [gscStats, setGscStats] = useState({
    clicks: "—",
    impressions: "—",
    ctr: "—",
    position: "—",
  });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()).catch(() => ({})),
      fetch("/api/admin/articles").then((r) => r.json()).catch(() => []),
      fetch("/api/admin/gsc").then((r) => r.json()).catch(() => null),
    ]).then(([statsData, articlesData, gscData]) => {
      if (statsData) {
        setStats({
          total: statsData.totalPosts || 0,
          published: statsData.totalPosts || 0,
          drafts: 0,
          categories: statsData.totalCategories || 0,
        });
      }
      if (Array.isArray(articlesData)) {
        setRecentPosts(articlesData.slice(0, 5));
      }
      if (gscData) {
        if (!Array.isArray(gscData) && gscData.summary) {
          setGscStats({
            clicks: gscData.summary.clicks || "—",
            impressions: gscData.summary.impressions || "—",
            ctr: gscData.summary.ctr || "—",
            position: gscData.summary.position || "—",
          });
        } else if (Array.isArray(gscData) && gscData.length > 0) {
          const totalClicks = gscData.reduce((sum, item) => sum + (item.clicks || 0), 0);
          const totalImpressions = gscData.reduce((sum, item) => sum + (item.impressions || 0), 0);
          const avgCtr = (
            gscData.reduce((sum, item) => {
              const val = parseFloat((item.ctr || "0").replace("%", ""));
              return sum + (isNaN(val) ? 0 : val);
            }, 0) / gscData.length
          ).toFixed(1) + "%";
          const avgPos = (
            gscData.reduce((sum, item) => {
              const val = parseFloat(item.position || "0");
              return sum + (isNaN(val) ? 0 : val);
            }, 0) / gscData.length
          ).toFixed(1);

          setGscStats({
            clicks: totalClicks.toLocaleString(),
            impressions: totalImpressions.toLocaleString(),
            ctr: avgCtr,
            position: avgPos,
          });
        }
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="wp-animate-in">
      {/* Page Header */}
      <div className="wp-page-header">
        <h1 className="wp-page-title">Dashboard</h1>
        <div className="wp-page-actions">
          <Link href="/admin/blog/create" className="wp-btn wp-btn-primary">
            <Plus size={14} />
            New Post
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="wp-stats-row">
        <div className="wp-stat-card">
          <FileText size={20} className="wp-stat-icon" />
          <span className="wp-stat-number">{loading ? "—" : stats.total}</span>
          <span className="wp-stat-label">Total Posts</span>
        </div>
        <div className="wp-stat-card wp-stat-card--green">
          <CheckCircle2 size={20} className="wp-stat-icon" />
          <span className="wp-stat-number">{loading ? "—" : stats.published}</span>
          <span className="wp-stat-label">Published</span>
        </div>
        <div className="wp-stat-card wp-stat-card--orange">
          <Clock size={20} className="wp-stat-icon" />
          <span className="wp-stat-number">{loading ? "—" : stats.drafts}</span>
          <span className="wp-stat-label">Drafts</span>
        </div>
        <div className="wp-stat-card wp-stat-card--red">
          <Layers size={20} className="wp-stat-icon" />
          <span className="wp-stat-number">{loading ? "—" : stats.categories}</span>
          <span className="wp-stat-label">Categories</span>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px", alignItems: "flex-start" }}>
        {/* Recent Posts */}
        <div className="wp-box">
          <div className="wp-box-header">
            <h2 className="wp-box-title">Recent Posts</h2>
            <Link href="/admin/blog" style={{ fontSize: 12, color: "var(--wp-blue)", textDecoration: "none" }}>
              View All →
            </Link>
          </div>
          <div>
            <table className="wp-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="wp-loading-row">
                    <td colSpan={5}>Loading posts...</td>
                  </tr>
                ) : recentPosts.length === 0 ? (
                  <tr className="wp-loading-row">
                    <td colSpan={5}>No posts yet. <Link href="/admin/blog/create" style={{ color: "var(--wp-blue)" }}>Create your first post</Link></td>
                  </tr>
                ) : (
                  recentPosts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <span className="wp-post-title">{post.title}</span>
                        <div className="row-actions">
                          <Link href={`/admin/blog/${post.id}`} className="wp-row-action-link">Edit</Link>
                          <span className="wp-row-action-sep">|</span>
                          <Link href={`/blog/${post.slug}`} target="_blank" className="wp-row-action-link">View</Link>
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: "var(--wp-text-muted)", whiteSpace: "nowrap" }}>
                        {post.category || "—"}
                      </td>
                      <td>
                        <span className="wp-badge wp-badge--published">Published</span>
                      </td>
                      <td style={{ fontSize: 12, color: "var(--wp-text-muted)", whiteSpace: "nowrap" }}>
                        {post.date || "—"}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <Link
                            href={`/admin/blog/${post.id}`}
                            title="Edit"
                            style={{ color: "var(--wp-text-muted)", display: "flex", alignItems: "center", padding: "2px 4px" }}
                          >
                            <Edit3 size={14} />
                          </Link>
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            title="View"
                            style={{ color: "var(--wp-text-muted)", display: "flex", alignItems: "center", padding: "2px 4px" }}
                          >
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Quick Draft */}
          <div className="wp-box">
            <div className="wp-box-header">
              <h2 className="wp-box-title">Quick Draft</h2>
            </div>
            <div className="wp-box-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: 12, color: "var(--wp-text-muted)", marginBottom: 4 }}>
                Quickly save a new idea to write about later.
              </p>
              <div className="wp-form-row" style={{ marginBottom: 8 }}>
                <input type="text" className="wp-input" placeholder="Post title" />
              </div>
              <div className="wp-form-row" style={{ marginBottom: 8 }}>
                <textarea className="wp-textarea" placeholder="What's on your mind?" rows={4} />
              </div>
              <Link href="/admin/blog/create" className="wp-btn wp-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Save Draft
              </Link>
            </div>
          </div>

          {/* At a Glance */}
          <div className="wp-box">
            <div className="wp-box-header">
              <h2 className="wp-box-title">At a Glance</h2>
            </div>
            <div className="wp-box-body">
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                <li style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                  <FileText size={14} style={{ color: "var(--wp-blue)" }} />
                  <Link href="/admin/blog" style={{ color: "var(--wp-blue)", textDecoration: "none" }}>
                    {loading ? "..." : stats.total} Posts
                  </Link>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                  <Layers size={14} style={{ color: "var(--wp-blue)" }} />
                  <Link href="/admin/categories" style={{ color: "var(--wp-blue)", textDecoration: "none" }}>
                    {loading ? "..." : stats.categories} Categories
                  </Link>
                </li>
              </ul>
              <hr style={{ margin: "12px 0", borderColor: "var(--wp-border)" }} />
              <p style={{ fontSize: 12, color: "var(--wp-text-muted)" }}>
                Physics CMS <span style={{ color: "var(--wp-green)", fontWeight: 600 }}>●</span> Running
              </p>
            </div>
          </div>

          {/* Search Performance */}
          <div className="wp-box">
            <div className="wp-box-header">
              <h2 className="wp-box-title">Search Performance</h2>
            </div>
            <div className="wp-box-body">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Total Clicks", value: gscStats.clicks },
                  { label: "Impressions", value: gscStats.impressions },
                  { label: "Avg. CTR", value: gscStats.ctr },
                  { label: "Avg. Position", value: gscStats.position },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "var(--wp-text-muted)" }}>{item.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--wp-text)" }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--wp-border)" }}>
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 12, color: "var(--wp-blue)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
                >
                  <TrendingUp size={12} />
                  Open Search Console
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

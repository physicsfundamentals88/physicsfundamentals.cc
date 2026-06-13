"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldAlert,
  Server,
  Activity,
  HardDrive,
  Trash2,
  UserPlus,
  Shield,
  FileSpreadsheet,
  Check,
  RefreshCw,
  Loader2,
  Terminal,
} from "lucide-react";

interface UserAccount {
  id: number;
  name: string;
  email: string;
  role: "Super Admin" | "Administrator" | "Editor";
  status: "Active" | "Inactive";
  lastLogin: string;
}

interface AuditLog {
  id: number;
  time: string;
  user: string;
  action: string;
  type: "info" | "warning" | "success";
}

const defaultUsers: UserAccount[] = [
  { id: 1, name: "Super Admin", email: "super.admin@physicsfundamentals.org", role: "Super Admin", status: "Active", lastLogin: "Just now" },
  { id: 2, name: "Dr. Sarah Jenkins", email: "s.jenkins@physicsfundamentals.org", role: "Administrator", status: "Active", lastLogin: "2 hours ago" },
  { id: 3, name: "Alex Rivera", email: "alex.r@physicsfundamentals.org", role: "Editor", status: "Active", lastLogin: "Yesterday" },
  { id: 4, name: "James Carter", email: "j.carter@physicsfundamentals.org", role: "Editor", status: "Inactive", lastLogin: "5 days ago" },
];

const defaultLogs: AuditLog[] = [
  { id: 1, time: "Just now", user: "Super Admin", action: "Accessed System Maintenance Console", type: "info" },
  { id: 2, time: "10 mins ago", user: "Super Admin", action: "Saved Analytics credentials configuration", type: "success" },
  { id: 3, time: "4 hours ago", user: "Dr. Sarah Jenkins", action: "Updated article: 'What Is Energy in Physics?'", type: "success" },
  { id: 4, time: "Yesterday", user: "Alex Rivera", action: "Added new Category: 'Kinematics'", type: "info" },
  { id: 5, time: "Yesterday", user: "Super Admin", action: "Purged CDN cache for /blog page", type: "warning" },
  { id: 6, time: "2 days ago", user: "James Carter", action: "Failed login attempt from IP 204.14.92.3", type: "warning" },
];

export default function SuperAdminUsersPage() {
  const [activeTab, setActiveTab] = useState<"users" | "system" | "logs">("users");
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>(defaultLogs);
  
  // Add user form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Super Admin" | "Administrator" | "Editor">("Editor");
  const [pwd, setPwd] = useState("");

  // Loading/Operation states
  const [processing, setProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // DB console state
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM articles WHERE status = 'published';");
  const [sqlOutput, setSqlOutput] = useState<string | null>(null);

  useEffect(() => {
    const savedUsers = localStorage.getItem("sa_users_list");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(defaultUsers);
      localStorage.setItem("sa_users_list", JSON.stringify(defaultUsers));
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser: UserAccount = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      role,
      status: "Active",
      lastLogin: "Never",
    };

    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem("sa_users_list", JSON.stringify(updated));

    // Add audit log
    const newLog: AuditLog = {
      id: Date.now(),
      time: "Just now",
      user: "Super Admin",
      action: `Created user account: ${name} (${role})`,
      type: "success",
    };
    setLogs([newLog, ...logs]);

    // Reset form
    setName("");
    setEmail("");
    setRole("Editor");
    setPwd("");
    triggerToast("User account created successfully!");
  };

  const handleDeleteUser = (id: number) => {
    if (id === 1) {
      alert("Security Protocol: You cannot delete the primary Super Admin account.");
      return;
    }
    const userToDelete = users.find(u => u.id === id);
    if (!userToDelete) return;
    if (!confirm(`Are you sure you want to permanently delete user account: ${userToDelete.name}?`)) return;

    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    localStorage.setItem("sa_users_list", JSON.stringify(updated));

    // Add audit log
    const newLog: AuditLog = {
      id: Date.now(),
      time: "Just now",
      user: "Super Admin",
      action: `Deleted user account: ${userToDelete.name}`,
      type: "warning",
    };
    setLogs([newLog, ...logs]);
    triggerToast("User account removed.");
  };

  const handleRoleChange = (id: number, newRole: "Super Admin" | "Administrator" | "Editor") => {
    if (id === 1) {
      alert("Primary Super Admin account role must remain unchanged.");
      return;
    }
    const updated = users.map(u => u.id === id ? { ...u, role: newRole } : u);
    setUsers(updated);
    localStorage.setItem("sa_users_list", JSON.stringify(updated));

    const userObj = users.find(u => u.id === id);
    const newLog: AuditLog = {
      id: Date.now(),
      time: "Just now",
      user: "Super Admin",
      action: `Updated user role: ${userObj?.name} is now ${newRole}`,
      type: "info",
    };
    setLogs([newLog, ...logs]);
    triggerToast("User role updated.");
  };

  // Maintenance triggers
  const runMaintenance = (type: "optimize" | "cache" | "backup") => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      let msg = "";
      if (type === "optimize") {
        msg = "D1 database vacuum complete. All indexes rebuilt.";
      } else if (type === "cache") {
        msg = "Cloudflare CDN edge cache purged successfully.";
      } else if (type === "backup") {
        msg = "SQLite system database snapshot backup completed.";
      }
      triggerToast(msg);
      setLogs([
        {
          id: Date.now(),
          time: "Just now",
          user: "Super Admin",
          action: `Executed maintenance task: ${type}`,
          type: "success",
        },
        ...logs,
      ]);
    }, 1500);
  };

  const executeConsoleQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sqlQuery.trim()) return;

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (sqlQuery.toLowerCase().includes("select")) {
        setSqlOutput(
          JSON.stringify(
            [
              { id: 1, slug: "what-is-energy", title: "What Is Energy in Physics?", status: "published" },
              { id: 2, slug: "gravity-rules", title: "Understanding Gravitational Pull", status: "published" },
              { id: 3, slug: "newtons-laws", title: "Newton's 3 Laws of Motion", status: "draft" },
            ],
            null,
            2
          )
        );
      } else {
        setSqlOutput(`Query executed successfully. (Affected rows: 0, Duration: 4ms)`);
      }
      setLogs([
        {
          id: Date.now(),
          time: "Just now",
          user: "Super Admin",
          action: `Ran SQL Console Command`,
          type: "info",
        },
        ...logs,
      ]);
    }, 800);
  };

  return (
    <div className="wp-animate-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Toast Notification */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            backgroundColor: "var(--wp-sidebar-bg)",
            color: "white",
            padding: "12px 20px",
            borderRadius: "var(--radius-card)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            zIndex: 1000,
            fontSize: 13,
            fontWeight: 500,
            animation: "fade-in 0.3s ease-out",
          }}
        >
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--wp-green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Check size={12} color="white" />
          </div>
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="wp-page-header">
        <div>
          <h1 className="wp-page-title">Super Admin Console</h1>
          <p style={{ fontSize: 12, color: "var(--wp-text-muted)", marginTop: 4 }}>
            Control user security profiles, monitor D1 server health, and run maintenance tasks.
          </p>
        </div>
      </div>

      {/* Stats row for Super Admin */}
      <div className="wp-stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="wp-stat-card">
          <Users size={20} className="wp-stat-icon" />
          <span className="wp-stat-number">{users.length}</span>
          <span className="wp-stat-label">Active Users</span>
        </div>
        <div className="wp-stat-card wp-stat-card--green">
          <Server size={20} className="wp-stat-icon" />
          <span className="wp-stat-number">99.9%</span>
          <span className="wp-stat-label">D1 Edge Uptime</span>
        </div>
        <div className="wp-stat-card wp-stat-card--orange">
          <HardDrive size={20} className="wp-stat-icon" />
          <span className="wp-stat-number">1.4 MB</span>
          <span className="wp-stat-label">SQLite File Size</span>
        </div>
        <div className="wp-stat-card wp-stat-card--red">
          <Activity size={20} className="wp-stat-icon" />
          <span className="wp-stat-number">34 ms</span>
          <span className="wp-stat-label">Response Time</span>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="wp-filter-tabs" style={{ background: "white", padding: "10px 16px", borderRadius: "var(--radius-card)", border: "1px solid var(--wp-border)", width: "fit-content", display: "flex", gap: 12 }}>
        <button
          onClick={() => setActiveTab("users")}
          className={`wp-filter-tab ${activeTab === "users" ? "wp-filter-tab--active" : ""}`}
          style={{ padding: "6px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: activeTab === "users" ? 700 : 400 }}
        >
          Users Management
        </button>
        <span style={{ color: "var(--wp-border)" }}>|</span>
        <button
          onClick={() => setActiveTab("system")}
          className={`wp-filter-tab ${activeTab === "system" ? "wp-filter-tab--active" : ""}`}
          style={{ padding: "6px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: activeTab === "system" ? 700 : 400 }}
        >
          System Health & Console
        </button>
        <span style={{ color: "var(--wp-border)" }}>|</span>
        <button
          onClick={() => setActiveTab("logs")}
          className={`wp-filter-tab ${activeTab === "logs" ? "wp-filter-tab--active" : ""}`}
          style={{ padding: "6px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: activeTab === "logs" ? 700 : 400 }}
        >
          Security Audit Logs
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "users" && (
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20, alignItems: "flex-start" }}>
          
          {/* Add User form */}
          <div className="wp-metabox">
            <div className="wp-metabox-header">
              <h3 className="wp-metabox-title">Create User Account</h3>
            </div>
            <div className="wp-metabox-body">
              <form onSubmit={handleAddUser} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="wp-form-row">
                  <label className="wp-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="wp-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Professor Smith"
                  />
                </div>
                <div className="wp-form-row">
                  <label className="wp-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="wp-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                  />
                </div>
                <div className="wp-form-row">
                  <label className="wp-label">System Role</label>
                  <select
                    className="wp-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                  >
                    <option value="Editor">Editor (Read/Write Posts)</option>
                    <option value="Administrator">Administrator (All access)</option>
                    <option value="Super Admin">Super Admin (System access)</option>
                  </select>
                </div>
                <div className="wp-form-row">
                  <label className="wp-label">Temporary Password</label>
                  <input
                    type="password"
                    required
                    className="wp-input"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="wp-btn wp-btn-primary"
                  style={{ gap: 8, marginTop: 8 }}
                >
                  <UserPlus size={14} /> Create User
                </button>
              </form>
            </div>
          </div>

          {/* Users List table */}
          <div className="wp-table-wrap">
            <table className="wp-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th style={{ width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <strong style={{ fontSize: 13, color: "var(--wp-text)" }}>{u.name}</strong>
                      {u.id === 1 && <span style={{ marginLeft: 6, fontSize: 10, background: "var(--wp-blue-light)", color: "var(--wp-blue-dark)", padding: "1px 4px", borderRadius: 4, fontWeight: 700 }}>You</span>}
                    </td>
                    <td style={{ fontSize: 12, color: "var(--wp-text-muted)", fontFamily: "monospace" }}>{u.email}</td>
                    <td>
                      <select
                        className="wp-select"
                        style={{ padding: "2px 6px", fontSize: 11, width: "auto" }}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                        disabled={u.id === 1}
                      >
                        <option value="Super Admin">Super Admin</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Editor">Editor</option>
                      </select>
                    </td>
                    <td>
                      <span className={`wp-badge ${u.status === "Active" ? "wp-badge--published" : "wp-badge--draft"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--wp-text-muted)" }}>{u.lastLogin}</td>
                    <td>
                      {u.id !== 1 && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--wp-red)",
                            display: "flex",
                            alignItems: "center",
                            padding: 4,
                          }}
                          title="Delete Account"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {activeTab === "system" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "flex-start" }}>
          
          {/* SQL Console */}
          <div className="wp-box">
            <div className="wp-box-header" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Terminal size={16} />
              <h2 className="wp-box-title">D1 SQL Database Console</h2>
            </div>
            <div className="wp-box-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontSize: 12, color: "var(--wp-text-muted)" }}>Run raw query strings against the SQLite schema binding. Select operations are read-only.</p>
              <form onSubmit={executeConsoleQuery} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <textarea
                  className="wp-textarea"
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  style={{ fontFamily: "monospace", fontSize: 12 }}
                  rows={4}
                />
                <button
                  type="submit"
                  className="wp-btn wp-btn-primary"
                  disabled={processing}
                  style={{ alignSelf: "flex-end" }}
                >
                  {processing ? <Loader2 size={14} className="animate-spin" /> : "Run Query"}
                </button>
              </form>

              {sqlOutput && (
                <div style={{ marginTop: 10 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--wp-text-muted)", marginBottom: 6 }}>Console Output</label>
                  <pre
                    style={{
                      background: "var(--wp-sidebar-bg)",
                      color: "#4ade80",
                      padding: 16,
                      borderRadius: "var(--radius-card)",
                      fontSize: 11,
                      fontFamily: "monospace",
                      overflowX: "auto",
                      maxHeight: 250,
                    }}
                  >
                    {sqlOutput}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Maintenance Tools panel */}
          <div className="wp-metabox">
            <div className="wp-metabox-header">
              <h3 className="wp-metabox-title">Maintenance Tools</h3>
            </div>
            <div className="wp-metabox-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              
              <div>
                <button
                  onClick={() => runMaintenance("optimize")}
                  className="wp-btn wp-btn-secondary"
                  style={{ width: "100%", justifyContent: "center", gap: 8 }}
                  disabled={processing}
                >
                  <RefreshCw size={14} className={processing ? "animate-spin" : ""} />
                  Vacuum & Optimize DB
                </button>
                <span style={{ display: "block", fontSize: 10, color: "var(--wp-text-muted)", marginTop: 4, textAlign: "center" }}>
                  Shrinks and defragments the SQLite file.
                </span>
              </div>

              <div>
                <button
                  onClick={() => runMaintenance("cache")}
                  className="wp-btn wp-btn-secondary"
                  style={{ width: "100%", justifyContent: "center", gap: 8 }}
                  disabled={processing}
                >
                  <ShieldAlert size={14} />
                  Purge Cloudflare Cache
                </button>
                <span style={{ display: "block", fontSize: 10, color: "var(--wp-text-muted)", marginTop: 4, textAlign: "center" }}>
                  Clears compiled feed assets from CDN edge servers.
                </span>
              </div>

              <div>
                <button
                  onClick={() => runMaintenance("backup")}
                  className="wp-btn wp-btn-secondary"
                  style={{ width: "100%", justifyContent: "center", gap: 8 }}
                  disabled={processing}
                >
                  <HardDrive size={14} />
                  System Backup Snapshot
                </button>
                <span style={{ display: "block", fontSize: 10, color: "var(--wp-text-muted)", marginTop: 4, textAlign: "center" }}>
                  Generates an encrypted copy of D1 tables.
                </span>
              </div>

            </div>
          </div>

        </div>
      )}

      {activeTab === "logs" && (
        <div className="wp-box">
          <div className="wp-box-header" style={{ display: "flex", justifyContent: "between", alignItems: "center" }}>
            <h2 className="wp-box-title">System Security Log</h2>
            <button
              onClick={() => { setLogs(defaultLogs); triggerToast("Logs list refreshed."); }}
              className="wp-btn wp-btn-secondary wp-btn-sm"
              style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}
            >
              <RefreshCw size={12} /> Reload Logs
            </button>
          </div>
          <div className="wp-box-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {logs.map(log => {
                let badgeColor = "var(--wp-blue)";
                if (log.type === "warning") badgeColor = "var(--wp-red)";
                if (log.type === "success") badgeColor = "var(--wp-green)";

                return (
                  <div
                    key={log.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "100px 140px 1fr",
                      padding: "10px 16px",
                      border: "1px solid var(--wp-border)",
                      borderRadius: 8,
                      fontSize: 12,
                      alignItems: "center",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <span style={{ color: "var(--wp-text-muted)" }}>{log.time}</span>
                    <span style={{ fontWeight: 700, color: "var(--wp-text)" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: badgeColor, display: "inline-block", marginRight: 8 }} />
                      {log.user}
                    </span>
                    <span style={{ color: "var(--wp-text)", fontFamily: "monospace" }}>{log.action}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

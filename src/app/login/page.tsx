"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Mail, User, ShieldCheck, ArrowRight, Loader2, AlertCircle, CheckCircle, Sparkles, BookOpen, Compass, Trophy } from "lucide-react";
import Link from "next/link";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Tabs: "login" or "register"
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  // Registration form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Logged-in state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; role: string } | null>(null);

  // Parse query parameter mode
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "register") {
      setActiveTab("register");
    } else {
      setActiveTab("login");
    }
  }, [searchParams]);

  // Check if already logged in (client-side mock session)
  useEffect(() => {
    const isLogged = localStorage.getItem("user_logged") === "true";
    const profile = localStorage.getItem("user_profile");
    if (isLogged && profile) {
      setIsLoggedIn(true);
      setUserProfile(JSON.parse(profile));
    }

    // Load Cloudflare Turnstile script
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: regEmail.trim(),
          name: regName.trim(),
          password: regPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register.");
      }

      setSuccess("Account successfully created! You can now log in below.");
      // Switch to login tab and prefill email
      setLoginEmail(regEmail);
      setActiveTab("login");
      
      // Clear registration form
      setRegName("");
      setRegEmail("");
      setRegPassword("");
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Direct mock fallback check for primary admin account
      if ((loginEmail === "admin" || loginEmail === "admin@physics.com") && loginPassword === "physics2024") {
        localStorage.setItem("admin_logged", "true");
        localStorage.setItem("user_logged", "true");
        const adminProfile = { name: "Super Admin", email: "admin@physics.com", role: "admin" };
        localStorage.setItem("user_profile", JSON.stringify(adminProfile));
        setIsLoggedIn(true);
        setUserProfile(adminProfile);
        router.push("/admin");
        return;
      }

      // Allow physicsfundamentals88@gmail.com as username/email with new secret password as a fallback
      if (loginEmail === "physicsfundamentals88@gmail.com" && loginPassword === "PhysiX#99!quantum_Gravity@2026") {
        localStorage.setItem("admin_logged", "true");
        localStorage.setItem("user_logged", "true");
        const adminProfile = { name: "Admin", email: "physicsfundamentals88@gmail.com", role: "admin" };
        localStorage.setItem("user_profile", JSON.stringify(adminProfile));
        setIsLoggedIn(true);
        setUserProfile(adminProfile);
        router.push("/admin");
        return;
      }

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginEmail.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      // If user is admin, log into administration panel
      if (data.user.role === "admin") {
        localStorage.setItem("admin_logged", "true");
        localStorage.setItem("user_logged", "true");
        localStorage.setItem("user_profile", JSON.stringify(data.user));
        setIsLoggedIn(true);
        setUserProfile(data.user);
        router.push("/admin");
      } else {
        // Log in as general early access user
        localStorage.setItem("user_logged", "true");
        localStorage.setItem("user_profile", JSON.stringify(data.user));
        setIsLoggedIn(true);
        setUserProfile(data.user);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_logged");
    localStorage.removeItem("user_profile");
    localStorage.removeItem("admin_logged");
    setIsLoggedIn(false);
    setUserProfile(null);
  };

  // Logged-in success welcome screen
  if (isLoggedIn && userProfile) {
    return (
      <div className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-8 relative z-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-2 border border-emerald-500/20">
            <CheckCircle size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Access Granted</h1>
          <p className="text-slate-400 font-medium">Welcome back to Physics Fundamentals, <span className="text-[#FACC15]">{userProfile.name}</span>!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
          <Link href="/simulations" className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-amber-500/50 transition-all text-center group space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#FACC15] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Compass size={20} />
            </div>
            <h3 className="font-bold text-white text-sm">Interactive Labs</h3>
            <p className="text-xs text-slate-500">Run simulations, modify parameters, and explore physics visually.</p>
          </Link>

          <Link href="/blog" className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-amber-500/50 transition-all text-center group space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <BookOpen size={20} />
            </div>
            <h3 className="font-bold text-white text-sm">Study Articles</h3>
            <p className="text-xs text-slate-500">Read breakdowns of mechanics, waves, electromagnetism, and more.</p>
          </Link>

          <Link href="/roadmap" className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-amber-500/50 transition-all text-center group space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Trophy size={20} />
            </div>
            <h3 className="font-bold text-white text-sm">Platform Roadmap</h3>
            <p className="text-xs text-slate-500">Vote on future simulations and explore planned releases.</p>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-500">
            Logged in as <span className="text-slate-300 font-bold">{userProfile.email}</span> ({userProfile.role})
          </div>
          <div className="flex items-center gap-3">
            {userProfile.role === "admin" && (
              <Link href="/admin" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl text-xs font-bold transition-all">
                Admin Area
              </Link>
            )}
            <button onClick={handleLogout} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8 relative z-10">
      <div className="text-center space-y-2 animate-fade-in">
        <Link href="/" className="inline-flex items-center gap-2 text-[#FACC15] hover:text-[#EAB308] text-sm font-black transition-colors uppercase tracking-widest mb-3">
          <Sparkles size={16} />
          Physics Fundamentals
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Early Access Portal</h1>
        <p className="text-slate-400 font-medium text-sm">Register to join our waiting list or sign in to your account.</p>
      </div>

      {/* Glassmorphic Box */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
        
        {/* Tab Buttons */}
        <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-850">
          <button
            onClick={() => {
              setActiveTab("login");
              setError("");
              setSuccess("");
            }}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === "login"
                ? "bg-[#FACC15] text-[#0F172A] shadow-lg shadow-yellow-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab("register");
              setError("");
              setSuccess("");
            }}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === "register"
                ? "bg-[#FACC15] text-[#0F172A] shadow-lg shadow-yellow-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Get Access
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm font-semibold flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-sm font-semibold flex items-start gap-3">
            <CheckCircle size={18} className="shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {activeTab === "login" ? (
          /* Login Form */
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FACC15] transition-colors" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 focus:border-[#FACC15] rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none transition-all placeholder:text-slate-600"
                  placeholder="name@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FACC15] transition-colors" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 focus:border-[#FACC15] rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Cloudflare Turnstile Verification */}
            <div className="py-2 flex justify-center">
              <div 
                className="cf-turnstile" 
                data-sitekey="1x00000000000000000000SH"
                data-theme="dark"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-[#FACC15] hover:bg-[#EAB308] text-[#0F172A] py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-yellow-500/5 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FACC15] transition-colors" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 focus:border-[#FACC15] rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none transition-all placeholder:text-slate-600"
                  placeholder="Dr. Isaac Newton"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FACC15] transition-colors" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 focus:border-[#FACC15] rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none transition-all placeholder:text-slate-600"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Choose Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FACC15] transition-colors" />
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 focus:border-[#FACC15] rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Cloudflare Turnstile Verification */}
            <div className="py-2 flex justify-center">
              <div 
                className="cf-turnstile" 
                data-sitekey="1x00000000000000000000SH"
                data-theme="dark"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FACC15] hover:bg-[#EAB308] text-[#0F172A] py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-yellow-500/5 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Submit Waitlist Invitation
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <div className="text-center">
        <Link href="/" className="text-slate-500 hover:text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5">
          ← Back to Homepage
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FACC15]/5 rounded-full blur-3xl -mr-48 -mt-48 transition-all duration-700 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <Suspense fallback={
        <div className="flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-[#FACC15]" size={24} />
          <span className="text-xs text-slate-500">Loading portal...</span>
        </div>
      }>
        <LoginContent />
      </Suspense>
    </div>
  );
}

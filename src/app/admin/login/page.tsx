"use client";

import React, { useState, useEffect } from "react";
import { Lock, User, ShieldCheck, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Allow admin or admin@physics.com as username/email with secret password
      if ((username === "admin" || username === "admin@physics.com") && password === "physics2024") {
         localStorage.setItem("admin_logged", "true");
         // Mock success
         setTimeout(() => {
            router.push("/admin");
         }, 1000);
      } else {
         setError("Invalid credentials. Please check your username/email and password.");
         setIsLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FACC15]/5 rounded-full blur-3xl -mr-48 -mt-48 transition-all duration-700 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FACC15] text-[#0F172A] mb-4 shadow-xl shadow-yellow-500/20">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Access</h1>
          <p className="text-slate-400 font-medium">Verify your identity to access the Physics CMS</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm font-bold flex items-center gap-3 animate-shake">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Email or Username</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FACC15] transition-colors" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white font-medium focus:outline-none focus:border-[#FACC15] focus:bg-slate-950 transition-all placeholder:text-slate-700"
                  placeholder="Enter your email or username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Secret Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FACC15] transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white font-medium focus:outline-none focus:border-[#FACC15] focus:bg-slate-950 transition-all placeholder:text-slate-700"
                  placeholder="••••••••"
                  required
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
              className="w-full bg-[#FACC15] hover:bg-[#EAB308] text-[#0F172A] py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-yellow-500/10 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
           <Link href="/" className="text-slate-500 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-2">
             Back to Homepage
           </Link>
        </div>
      </div>
    </div>
  );
}

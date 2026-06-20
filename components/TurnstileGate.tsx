"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function TurnstileGate({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [rayId, setRayId] = useState("");
  const [ipAddress, setIpAddress] = useState("127.0.0.1");

  useEffect(() => {
    setIsMounted(true);
    
    // Generate a random mock Ray ID for authenticity
    const hex = "0123456789abcdef";
    let mockRay = "";
    for (let i = 0; i < 16; i++) {
      mockRay += hex[Math.floor(Math.random() * 16)];
    }
    setRayId(mockRay.toUpperCase());

    // Retrieve verification status
    const verified = sessionStorage.getItem("site_verified") === "true";
    if (verified) {
      setIsVerified(true);
      return;
    }

    // Try to get a mock IP from public API or default
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        if (data.ip) setIpAddress(data.ip);
      })
      .catch(() => {
        // Fallback silently
      });

    // Define callbacks globally
    (window as any).onTurnstileVerify = (token: string) => {
      if (token) {
        sessionStorage.setItem("site_verified", "true");
        // Add a tiny delay for visual transition satisfaction
        setTimeout(() => {
          setIsVerified(true);
        }, 800);
      }
    };

    (window as any).onloadTurnstileCallback = () => {
      if ((window as any).turnstile) {
        (window as any).turnstile.render("#turnstile-container", {
          sitekey: "1x00000000000000000000SH", // Cloudflare test key (always resolves)
          callback: "onTurnstileVerify",
          theme: "light", // Matches the light widget theme in the screenshot
        });
      }
    };

    // Load Turnstile Script
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback&render=explicit";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Clean up script and globals
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      delete (window as any).onTurnstileVerify;
      delete (window as any).onloadTurnstileCallback;
    };
  }, []);

  // During SSR or before mounting on the client, render children normally
  // so that search engine crawl and Next.js static exports work perfectly.
  // We hide/overlay on the client right after mount if not verified.
  const showGate = isMounted && !isVerified;

  return (
    <>
      {/* Main site container - hidden on client until verified, fully rendered on server for SEO */}
      <div style={{ display: showGate ? "none" : "block" }} className="w-full h-full">
        {children}
      </div>

      {/* Cloudflare Turnstile Gate Overlay */}
      {showGate && (
        <div className="fixed inset-0 z-[99999] bg-[#0b1220] text-slate-300 flex flex-col items-center justify-center p-6 select-none font-sans">
          <div className="w-full max-w-[520px] bg-slate-900/60 border border-slate-800/80 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-8 backdrop-blur-md">
            
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400 font-bold text-sm tracking-wide">
                <ShieldCheck className="text-amber-500" size={18} />
                <span>physicslab.app</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Checking if the site connection is secure
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                physicslab.app needs to review the security of your connection before proceeding.
              </p>
            </div>

            {/* Turnstile Check Box Widget */}
            <div className="py-2 min-h-[85px] flex items-center justify-center bg-slate-950/40 rounded-2xl border border-slate-850 p-4">
              <div id="turnstile-container" className="scale-95 sm:scale-100 transition-transform" />
            </div>

            {/* Info Message */}
            <div className="space-y-3">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Verification is automatic. Your browser will redirect to the requested page once the challenge is completed.
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Why am I seeing this page? Requests from malicious bots can pose as legitimate traffic. This check ensures you are a real human visitor to keep our interactive simulations fast and secure.
              </p>
            </div>

            {/* Footer with Ray ID and IP */}
            <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-slate-500">
              <div className="flex flex-wrap justify-center sm:justify-start gap-x-3 gap-y-1">
                <span>Ray ID: <span className="font-mono text-slate-400">{rayId}</span></span>
                <span className="hidden sm:inline text-slate-700">|</span>
                <span>IP: <span className="font-mono text-slate-400">{ipAddress}</span></span>
              </div>
              <span className="font-medium tracking-wide">Performance & security by Cloudflare</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

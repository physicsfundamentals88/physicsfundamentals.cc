import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of suspicious patterns in User-Agent header (case-insensitive)
const BANNED_USER_AGENTS = [
  "python",
  "curl",
  "wget",
  "httpclient",
  "scrape",
  "spider",
  "bot", // we will exclude good bots below
  "headless",
  "puppeteer",
  "selenium",
  "playwright",
  "axios",
  "postman",
  "sqlmap",
  "nmap",
  "hydra",
  "acunetix",
  "nikto",
  "dirbuster",
  "gobuster",
  "zgrab",
  "go-http-client",
  "java/",
  "perl",
  "libwww-perl",
  "scrapy",
  "node-fetch",
  "urllib",
  "superagent",
  "got-scraping",
  "got/",
  "gptbot",
  "chatgpt",
  "claude",
  "claudebot",
  "bytespider",
  "diffbot",
  "blexbot",
  "semrushbot",
  "ahrefsbot",
  "mj12bot",
  "rogerbot",
  "dotbot",
  "petalbot",
  "yeti",
  "semrush",
  "phantomjs",
  "headlesschrome",
  "cyberdust",
];

// List of good bot patterns we want to allow for SEO and indexing
const ALLOWED_GOOD_BOTS = [
  "googlebot",
  "bingbot",
  "yandexbot",
  "duckduckbot",
  "slurp", // Yahoo bot
  "baiduspider",
  "sogou",
  "exabot",
  "facebot",
  "ia_archiver", // WayBack Machine
  "twitterbot",
  "facebookexternalhit",
  "slackbot",
  "telegrambot",
  "whatsapp",
  "discordbot",
  "applebot",
  "pinterestbot",
  "linkedinbot",
  "redditbot",
  "tumblr",
  "embedly",
  "outbrain",
  "vkshare",
  "bingpreview",
];

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  const lowercaseUA = userAgent.toLowerCase();

  // 1. Block requests with no User-Agent header (common for simple scraper bots)
  if (!userAgent || userAgent.trim() === "") {
    return new NextResponse(
      JSON.stringify({ error: "Access Denied: Browser verification required." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // 2. Check if the user agent matches any bad bot / automation tool patterns
  const matchesBanned = BANNED_USER_AGENTS.some((pattern) => lowercaseUA.includes(pattern));
  const matchesGoodBot = ALLOWED_GOOD_BOTS.some((pattern) => lowercaseUA.includes(pattern));

  // If matches banned/bot pattern and is not a recognized good search bot, block it
  if (matchesBanned && !matchesGoodBot) {
    console.warn(`[Bot Blocker] Blocked request from User-Agent: "${userAgent}" requesting "${request.nextUrl.pathname}"`);
    return new NextResponse(
      JSON.stringify({ error: "Access Denied: Automated bot traffic detected." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // 3. Block common scraper URL patterns (e.g. attempting to scan for wp-admin, .env, etc.)
  const pathname = request.nextUrl.pathname.toLowerCase();
  const SUSPICIOUS_PATHS = [
    "/wp-admin",
    "/wp-login",
    "/xmlrpc.php",
    "/.env",
    "/.git",
    "/config.json",
    "/admin.php",
    "/config.php",
  ];
  if (SUSPICIOUS_PATHS.some((path) => pathname.includes(path))) {
    const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for") || "unknown";
    console.warn(`[Bot Blocker] Blocked request for suspicious path "${request.nextUrl.pathname}" from IP ${ip}`);
    return new NextResponse(
      JSON.stringify({ error: "Access Denied." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  return NextResponse.next();
}

// Apply middleware only to admin dashboard and admin API routes to save CPU time on public pages
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};

"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Target,
  BookOpen,
  Zap,
  BarChart2,
  Globe,
  Lightbulb,
  Search,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   Types
──────────────────────────────────────────────────────────────────── */
type CheckStatus = "good" | "warn" | "bad" | "info";

interface SEOCheck {
  id: string;
  label: string;
  status: CheckStatus;
  message: string;
  score: number;
  max: number;
}

interface SEOSection {
  title: string;
  icon: React.ReactNode;
  color: string;
  checks: SEOCheck[];
}

export interface SEOAnalyzerProps {
  title: string;
  content: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  focusTopic: string;
  onFocusTopicChange: (v: string) => void;
  featuredImage: string | null;
}

/* ─────────────────────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────────────────────────── */

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 1;
  const vowelGroups = word.match(/[aeiouy]+/g);
  let count = vowelGroups ? vowelGroups.length : 1;
  if (word.endsWith("e") && count > 1) count--;
  return Math.max(1, count);
}

function fleschScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 3);
  const words = text.split(/\s+/).filter(Boolean);
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  if (sentences.length === 0 || words.length === 0) return 0;
  const asl = words.length / sentences.length;
  const asw = syllables / words.length;
  return Math.min(100, Math.max(0, 206.835 - 1.015 * asl - 84.6 * asw));
}

function typeTokenRatio(text: string): number {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;
  const unique = new Set(words);
  return unique.size / words.length;
}

function containsTerm(text: string, term: string): boolean {
  if (!term.trim()) return false;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escaped, "i").test(text);
}

function countOccurrences(text: string, term: string): number {
  if (!term.trim()) return 0;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (text.match(new RegExp(escaped, "gi")) || []).length;
}

function extractHeadings(html: string): { level: number; text: string }[] {
  const matches = [...html.matchAll(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi)];
  return matches.map((m) => ({ level: parseInt(m[1]), text: stripHtml(m[2]) }));
}

function firstNWords(text: string, n: number): string {
  return text.split(/\s+/).filter(Boolean).slice(0, n).join(" ");
}

function avgSentenceLength(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 3);
  if (sentences.length === 0) return 0;
  const words = text.split(/\s+/).filter(Boolean).length;
  return words / sentences.length;
}

function countLinks(html: string): { internal: number; external: number } {
  const links = [...html.matchAll(/<a\s[^>]*href="([^"]*)"[^>]*>/gi)];
  let internal = 0, external = 0;
  links.forEach(([, href]) => {
    if (href.startsWith("http") || href.startsWith("//")) external++;
    else internal++;
  });
  return { internal, external };
}

function hasLists(html: string): boolean {
  return /<ul|<ol|<li/i.test(html);
}

function hasTables(html: string): boolean {
  return /<table/i.test(html);
}

function countImages(html: string): number {
  return (html.match(/<img/gi) || []).length;
}

function countImagesWithAlt(html: string): number {
  const imgs = [...html.matchAll(/<img\s[^>]*/gi)];
  return imgs.filter((m) => /alt=["'][^"']+["']/i.test(m[0])).length;
}

function hasQuestionPatterns(text: string): boolean {
  return /\b(what|how|why|when|where|who|which|can|is|are|does|do)\b.{5,50}\?/i.test(text);
}

function hasDefinitionPattern(text: string): boolean {
  return /\b\w[\w\s]{0,30}?\s+(is|are|refers to|means|defined as)\s/i.test(text);
}

function hasDataPoints(text: string): boolean {
  return /\d+(\.\d+)?(\s*)(kg|m\/s|N|J|Hz|W|Pa|K|eV|km|nm|µm|m\^2|m\^3|°C|°F|%)/i.test(text) ||
    /\d{3,}/.test(text);
}

function keywordDensity(text: string, term: string): number {
  if (!term) return 0;
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;
  const count = countOccurrences(text, term);
  return (count / words.length) * 100;
}

/* ─────────────────────────────────────────────────────────────────
   Core analysis
──────────────────────────────────────────────────────────────────── */
function analyzeContent(props: Omit<SEOAnalyzerProps, "onFocusTopicChange">): SEOSection[] {
  const { title, content, slug, metaTitle, metaDescription, excerpt, focusTopic, featuredImage } = props;

  const plainText = stripHtml(content);
  const wordCount = countWords(plainText);
  const headings = extractHeadings(content);
  const h2s = headings.filter((h) => h.level === 2);
  const h3s = headings.filter((h) => h.level === 3);
  const links = countLinks(content);
  const totalImages = countImages(content);
  const imagesWithAlt = countImagesWithAlt(content);
  const flesch = fleschScore(plainText);
  const ttr = typeTokenRatio(plainText);
  const avgSL = avgSentenceLength(plainText);
  const density = keywordDensity(plainText, focusTopic);
  const first100words = firstNWords(plainText, 100);
  const ft = focusTopic.trim().toLowerCase();

  /* ── Focus Topic ── */
  const focusChecks: SEOCheck[] = [];
  if (!ft) {
    focusChecks.push({ id: "ft-set", label: "Focus topic is set", status: "bad", message: "Enter a focus topic to unlock full SEO analysis.", score: 0, max: 10 });
  } else {
    const inTitle = containsTerm(title, ft);
    focusChecks.push({ id: "ft-title", label: "Focus topic in title", status: inTitle ? "good" : "bad", message: inTitle ? `"${focusTopic}" found in the title.` : `Add "${focusTopic}" to the title for stronger topical relevance.`, score: inTitle ? 10 : 0, max: 10 });

    const inIntro = containsTerm(first100words, ft);
    focusChecks.push({ id: "ft-intro", label: "Focus topic in introduction", status: inIntro ? "good" : "warn", message: inIntro ? `"${focusTopic}" appears in the first 100 words.` : `Use "${focusTopic}" in the first paragraph.`, score: inIntro ? 8 : 0, max: 8 });

    const inMeta = containsTerm(metaDescription, ft);
    focusChecks.push({ id: "ft-meta", label: "Focus topic in meta description", status: inMeta ? "good" : "warn", message: inMeta ? `"${focusTopic}" found in meta description.` : `Include "${focusTopic}" in the meta description to improve CTR.`, score: inMeta ? 6 : 0, max: 6 });

    const slugContains = ft.split(/\s+/).some((w) => slug.includes(w.toLowerCase()));
    focusChecks.push({ id: "ft-slug", label: "Focus topic in URL slug", status: slugContains ? "good" : "warn", message: slugContains ? "Slug contains focus topic words." : `Consider adding "${focusTopic}" words to the URL slug.`, score: slugContains ? 5 : 0, max: 5 });

    const inH2 = h2s.some((h) => containsTerm(h.text, ft));
    focusChecks.push({ id: "ft-h2", label: "Focus topic in an H2 heading", status: inH2 ? "good" : "warn", message: inH2 ? "Focus topic found in a subheading." : `Use "${focusTopic}" in at least one H2 heading.`, score: inH2 ? 6 : 0, max: 6 });

    const densityStatus: CheckStatus = density === 0 ? "bad" : density < 0.5 ? "warn" : density > 3 ? "warn" : "good";
    focusChecks.push({ id: "ft-density", label: `Focus topic density (${density === 0 ? "0" : density.toFixed(1)}%)`, status: densityStatus, message: density === 0 ? `"${focusTopic}" doesn't appear in content.` : density > 3 ? `${density.toFixed(1)}% density is high — use synonyms instead of repetition.` : `${density.toFixed(1)}% density — natural and balanced.`, score: densityStatus === "good" ? 5 : densityStatus === "warn" ? 2 : 0, max: 5 });
  }

  /* ── Content Quality ── */
  const contentChecks: SEOCheck[] = [];

  const wcStatus: CheckStatus = wordCount === 0 ? "bad" : wordCount < 600 ? "bad" : wordCount < 1200 ? "warn" : "good";
  contentChecks.push({ id: "wc", label: `Content length (${wordCount.toLocaleString()} words)`, status: wcStatus, message: wordCount === 0 ? "No content yet." : wordCount < 600 ? `${wordCount} words is too short. Aim for 1,200+ for competitive rankings.` : wordCount < 1200 ? `${wordCount} words — good start. 1,500+ typically outperforms.` : `${wordCount} words — excellent depth.`, score: wordCount >= 2000 ? 10 : wordCount >= 1200 ? 8 : wordCount >= 600 ? 4 : 0, max: 10 });

  const readStatus: CheckStatus = wordCount < 50 ? "info" : flesch >= 60 ? "good" : flesch >= 40 ? "warn" : "bad";
  contentChecks.push({ id: "reading", label: `Reading ease (${wordCount > 50 ? Math.round(flesch) : "—"}/100)`, status: readStatus, message: wordCount < 50 ? "Write more content to measure readability." : flesch >= 60 ? `Score ${Math.round(flesch)} — easy to read for broad audiences.` : flesch >= 40 ? `Score ${Math.round(flesch)} — moderately complex. Consider shorter sentences.` : `Score ${Math.round(flesch)} — difficult. Break up long sentences.`, score: readStatus === "good" ? 8 : readStatus === "warn" ? 4 : 0, max: 8 });

  const slStatus: CheckStatus = wordCount < 30 ? "info" : avgSL <= 20 ? "good" : avgSL <= 28 ? "warn" : "bad";
  contentChecks.push({ id: "sentences", label: `Avg. sentence length (${wordCount > 30 ? Math.round(avgSL) : "—"} words)`, status: slStatus, message: wordCount < 30 ? "Not enough content yet." : avgSL <= 20 ? "Concise sentences — scannable and web-friendly." : avgSL <= 28 ? `${Math.round(avgSL)} words/sentence. Mix in shorter sentences for rhythm.` : `${Math.round(avgSL)} words/sentence is too long. Aim for under 20.`, score: slStatus === "good" ? 6 : slStatus === "warn" ? 3 : 0, max: 6 });

  const ttrStatus: CheckStatus = wordCount < 100 ? "info" : ttr >= 0.45 ? "good" : ttr >= 0.3 ? "warn" : "bad";
  contentChecks.push({ id: "vocab", label: `Semantic richness (${wordCount > 100 ? Math.round(ttr * 100) : "—"}% unique words)`, status: ttrStatus, message: wordCount < 100 ? "Need more content to measure vocabulary diversity." : ttr >= 0.45 ? "Rich vocabulary signals topical depth — great for semantic SEO." : ttr >= 0.3 ? "Moderate vocabulary variety. Expand with related terms and synonyms." : "Low vocabulary diversity — may appear thin to search engines.", score: ttrStatus === "good" ? 7 : ttrStatus === "warn" ? 3 : 0, max: 7 });

  contentChecks.push({ id: "lists", label: "Uses lists or bullet points", status: hasLists(content) ? "good" : "warn", message: hasLists(content) ? "Lists boost featured snippet chances and improve scannability." : "Add bullet or numbered lists to improve scannability and snippet potential.", score: hasLists(content) ? 5 : 0, max: 5 });

  const hasQA = hasQuestionPatterns(plainText);
  const hasDef = hasDefinitionPattern(plainText);
  contentChecks.push({ id: "featured-snippet", label: "Featured snippet optimization", status: (hasQA || hasDef) ? "good" : "warn", message: (hasQA || hasDef) ? "Definitions or Q&A patterns found — strong featured snippet candidate." : "Add clear definitions (\"X is a...\") or Q&A sentences to target featured snippets.", score: (hasQA ? 4 : 0) + (hasDef ? 3 : 0), max: 7 });

  contentChecks.push({ id: "data", label: "Contains data & specific values", status: hasDataPoints(plainText) ? "good" : "warn", message: hasDataPoints(plainText) ? "Specific numbers and units found — signals expertise (E-E-A-T)." : "Add specific values, measurements, or statistics to demonstrate expertise.", score: hasDataPoints(plainText) ? 5 : 0, max: 5 });

  /* ── Structure ── */
  const structureChecks: SEOCheck[] = [];

  structureChecks.push({ id: "h2", label: `H2 headings (${h2s.length} found)`, status: h2s.length >= 3 ? "good" : h2s.length >= 1 ? "warn" : "bad", message: h2s.length >= 3 ? `${h2s.length} H2 headings — well structured for crawlability.` : h2s.length >= 1 ? `Only ${h2s.length} H2. Use 3+ to organize content semantically.` : "No H2 headings — structure your content with section headings.", score: h2s.length >= 3 ? 8 : h2s.length >= 1 ? 4 : 0, max: 8 });

  structureChecks.push({ id: "h3", label: `H3 subheadings (${h3s.length} found)`, status: h3s.length >= 2 ? "good" : h3s.length >= 1 ? "warn" : "info", message: h3s.length >= 2 ? "H3 subheadings create clear content hierarchy." : h3s.length >= 1 ? "Add more H3s under your H2 sections for deeper structure." : "No H3 subheadings. Use H3s inside H2 sections.", score: h3s.length >= 2 ? 5 : h3s.length >= 1 ? 2 : 0, max: 5 });

  structureChecks.push({ id: "internal-links", label: `Internal links (${links.internal})`, status: links.internal >= 3 ? "good" : links.internal >= 1 ? "warn" : "bad", message: links.internal >= 3 ? `${links.internal} internal links — great for topic cluster authority.` : links.internal >= 1 ? `${links.internal} internal link. Add 2–5 links to related posts.` : "No internal links. Link to 2–5 related articles to build topic clusters.", score: links.internal >= 3 ? 8 : links.internal >= 1 ? 4 : 0, max: 8 });

  structureChecks.push({ id: "external-links", label: `External links (${links.external})`, status: links.external >= 1 ? "good" : "info", message: links.external >= 1 ? `${links.external} external link(s) — citing sources builds credibility (E-E-A-T).` : "Link to authoritative external sources (journals, Wikipedia) to boost credibility.", score: links.external >= 1 ? 4 : 0, max: 4 });

  structureChecks.push({ id: "tables", label: "Uses comparison tables", status: hasTables(content) ? "good" : "info", message: hasTables(content) ? "Tables found — great for comparison queries and table featured snippets." : "Tables can capture table featured snippets and improve time-on-page.", score: hasTables(content) ? 3 : 0, max: 3 });

  /* ── Technical ── */
  const techChecks: SEOCheck[] = [];

  const mt = metaTitle || title;
  const mtLen = mt.length;
  const mtStatus: CheckStatus = mtLen === 0 ? "bad" : mtLen < 30 ? "warn" : mtLen <= 60 ? "good" : "warn";
  techChecks.push({ id: "meta-title", label: `Meta title (${mtLen} chars)`, status: mtStatus, message: mtLen === 0 ? "Set a meta title to control how your post appears in search results." : mtLen < 30 ? `Title too short (${mtLen} chars). Aim for 50–60.` : mtLen <= 60 ? `Perfect length (${mtLen} chars) — fits in Google's SERP.` : `Title too long (${mtLen} chars). Google truncates above 60. Trim it.`, score: mtStatus === "good" ? 8 : mtStatus === "warn" ? 4 : 0, max: 8 });

  const mdLen = metaDescription.length;
  const mdStatus: CheckStatus = mdLen === 0 ? "bad" : mdLen < 80 ? "warn" : mdLen <= 160 ? "good" : "warn";
  techChecks.push({ id: "meta-desc", label: `Meta description (${mdLen} chars)`, status: mdStatus, message: mdLen === 0 ? "Write a meta description to control your SERP snippet." : mdLen < 80 ? "Too short — write a compelling 120–160 char description." : mdLen <= 160 ? `Good length (${mdLen} chars). Make it compelling with a clear value prop.` : `Too long (${mdLen} chars) — Google truncates at ~160. Shorten it.`, score: mdStatus === "good" ? 8 : mdStatus === "warn" ? 4 : 0, max: 8 });

  const slugStatus: CheckStatus = !slug ? "bad" : slug.length > 75 ? "warn" : /[A-Z_]/.test(slug) ? "warn" : "good";
  techChecks.push({ id: "slug", label: "URL slug quality", status: slugStatus, message: !slug ? "No slug set — required for the post URL." : slug.length > 75 ? "Slug is too long. Keep it under 75 characters." : "Slug is clean, lowercase, and well-formatted.", score: slugStatus === "good" ? 5 : slugStatus === "warn" ? 2 : 0, max: 5 });

  techChecks.push({ id: "featured-image", label: "Featured image set", status: featuredImage ? "good" : "warn", message: featuredImage ? "Featured image set — improves CTR and social sharing." : "Add a featured image. It improves CTR and enables Open Graph previews.", score: featuredImage ? 6 : 0, max: 6 });

  if (totalImages > 0) {
    const allHaveAlt = imagesWithAlt === totalImages;
    techChecks.push({ id: "img-alt", label: `Image alt text (${imagesWithAlt}/${totalImages})`, status: allHaveAlt ? "good" : imagesWithAlt > 0 ? "warn" : "bad", message: allHaveAlt ? "All images have alt text — great for accessibility and image SEO." : `${totalImages - imagesWithAlt} image(s) missing alt text. Add descriptive alt attributes.`, score: allHaveAlt ? 6 : imagesWithAlt > 0 ? 3 : 0, max: 6 });
  }

  techChecks.push({ id: "excerpt", label: "Excerpt / summary set", status: excerpt.length > 50 ? "good" : excerpt.length > 0 ? "warn" : "info", message: excerpt.length > 50 ? "Excerpt set — used in blog listings and social previews." : excerpt.length > 0 ? "Excerpt is very short. Write 1–2 compelling sentences." : "No excerpt. Add a summary for listing pages.", score: excerpt.length > 50 ? 3 : excerpt.length > 0 ? 1 : 0, max: 3 });

  return [
    { title: "Focus Topic", icon: <Target size={13} />, color: "#2271b1", checks: focusChecks },
    { title: "Content Quality", icon: <BookOpen size={13} />, color: "#00a32a", checks: contentChecks },
    { title: "Content Structure", icon: <BarChart2 size={13} />, color: "#9333ea", checks: structureChecks },
    { title: "Technical SEO", icon: <Zap size={13} />, color: "#e67e22", checks: techChecks },
  ];
}

/* ─────────────────────────────────────────────────────────────────
   Score Ring
──────────────────────────────────────────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#16a34a" : score >= 50 ? "#f59e0b" : "#dc2626";
  const label = score >= 80 ? "Good" : score >= 50 ? "Needs Work" : "Poor";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={72} height={72} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={36} cy={36} r={r} fill="none" stroke="#e2e8f0" strokeWidth={6} />
        <circle cx={36} cy={36} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease" }} />
        <text x={36} y={36} textAnchor="middle" dominantBaseline="central"
          style={{ transform: "rotate(90deg)", transformOrigin: "36px 36px", fontSize: 15, fontWeight: 700, fill: color }}>
          {score}
        </text>
      </svg>
      <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Check Row
──────────────────────────────────────────────────────────────────── */
function CheckRow({ check }: { check: SEOCheck }) {
  const [expanded, setExpanded] = useState(false);
  const iconSize = { size: 13, style: { flexShrink: 0 as const, marginTop: 1 } };
  const icon =
    check.status === "good" ? <CheckCircle2 {...iconSize} style={{ ...iconSize.style, color: "#16a34a" }} />
    : check.status === "warn" ? <AlertCircle {...iconSize} style={{ ...iconSize.style, color: "#f59e0b" }} />
    : check.status === "bad" ? <XCircle {...iconSize} style={{ ...iconSize.style, color: "#dc2626" }} />
    : <Lightbulb {...iconSize} style={{ ...iconSize.style, color: "#64748b" }} />;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", cursor: "pointer", borderRadius: 4, padding: "5px 6px", transition: "background 0.1s ease" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
        {icon}
        <span style={{ fontSize: 12, color: "var(--wp-text)", lineHeight: 1.4, flex: 1 }}>{check.label}</span>
        {expanded
          ? <ChevronUp size={11} style={{ color: "#94a3b8", flexShrink: 0, marginTop: 2 }} />
          : <ChevronDown size={11} style={{ color: "#94a3b8", flexShrink: 0, marginTop: 2 }} />}
      </div>
      {expanded && (
        <p style={{ fontSize: 11, color: "#64748b", marginTop: 5, marginLeft: 20, lineHeight: 1.5, borderLeft: "2px solid #e2e8f0", paddingLeft: 8, marginBottom: 0 }}>
          {check.message}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main SEOAnalyzer component
──────────────────────────────────────────────────────────────────── */
export default function SEOAnalyzer(props: SEOAnalyzerProps) {
  const { focusTopic, onFocusTopicChange } = props;
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Focus Topic": true,
    "Content Quality": true,
    "Content Structure": false,
    "Technical SEO": false,
  });

  const sections = useMemo(
    () => analyzeContent(props),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.title, props.content, props.slug, props.metaTitle, props.metaDescription, props.excerpt, props.focusTopic, props.featuredImage]
  );

  const { totalScore, maxScore } = useMemo(() => {
    let total = 0, max = 0;
    sections.forEach((s) => s.checks.forEach((c) => { total += c.score; max += c.max; }));
    return { totalScore: total, maxScore: max };
  }, [sections]);

  const overallScore = maxScore === 0 ? 0 : Math.round((totalScore / maxScore) * 100);

  const toggleSection = (title: string) =>
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));

  const sectionPct = (checks: SEOCheck[]) => {
    const earned = checks.reduce((s, c) => s + c.score, 0);
    const total = checks.reduce((s, c) => s + c.max, 0);
    return total === 0 ? 0 : Math.round((earned / total) * 100);
  };

  return (
    <div style={{ fontSize: 13 }}>
      {/* Header with score ring */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, padding: "12px 14px", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderRadius: 6, color: "white" }}>
        <ScoreRing score={overallScore} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, margin: "0 0 4px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>SEO Score</p>
          <p style={{ fontSize: 11, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
            {overallScore >= 80 ? "Well optimized. Minor improvements possible."
            : overallScore >= 50 ? "Some issues found. Address warnings to improve."
            : "Needs optimization before publishing."}
          </p>
          {/* Score bar */}
          <div style={{ marginTop: 8, height: 4, background: "#1e293b", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${overallScore}%`, background: overallScore >= 80 ? "#16a34a" : overallScore >= 50 ? "#f59e0b" : "#dc2626", borderRadius: 2, transition: "width 0.5s ease" }} />
          </div>
        </div>
      </div>

      {/* Focus topic input */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>
          <Search size={11} /> Focus Topic
        </label>
        <input
          type="text"
          className="wp-input"
          value={focusTopic}
          onChange={(e) => onFocusTopicChange(e.target.value)}
          placeholder="e.g. conservation of momentum"
          style={{ fontSize: 12 }}
        />
        <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 4, marginBottom: 0 }}>
          The main topic or phrase this article targets
        </p>
      </div>

      {/* Analysis sections */}
      {sections.map((section) => {
        const isOpen = openSections[section.title] ?? false;
        const pct = sectionPct(section.checks);
        const goodCount = section.checks.filter((c) => c.status === "good").length;
        const warnCount = section.checks.filter((c) => c.status === "warn").length;
        const badCount = section.checks.filter((c) => c.status === "bad").length;

        return (
          <div key={section.title} style={{ border: "1px solid var(--wp-border)", borderRadius: 5, marginBottom: 8, overflow: "hidden" }}>
            <div
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#f8fafc", cursor: "pointer", borderBottom: isOpen ? "1px solid var(--wp-border)" : "none", userSelect: "none" }}
              onClick={() => toggleSection(section.title)}
            >
              <span style={{ color: section.color, display: "flex", alignItems: "center" }}>{section.icon}</span>
              <span style={{ fontWeight: 700, fontSize: 12, flex: 1, color: "var(--wp-text)" }}>{section.title}</span>
              {/* Score pill */}
              <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10, background: pct >= 80 ? "#dcfce7" : pct >= 50 ? "#fef9c3" : "#fee2e2", color: pct >= 80 ? "#15803d" : pct >= 50 ? "#854d0e" : "#b91c1c" }}>
                {pct}%
              </span>
              {/* Status dots */}
              <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                {goodCount > 0 && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />}
                {warnCount > 0 && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />}
                {badCount > 0 && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#dc2626", display: "inline-block" }} />}
              </div>
              {isOpen ? <ChevronUp size={12} style={{ color: "#94a3b8" }} /> : <ChevronDown size={12} style={{ color: "#94a3b8" }} />}
            </div>
            {isOpen && (
              <div style={{ padding: "6px 6px 4px" }}>
                {section.checks.map((check) => <CheckRow key={check.id} check={check} />)}
              </div>
            )}
          </div>
        );
      })}

      {/* Semantic SEO tips */}
      <div style={{ marginTop: 10, padding: "10px 12px", background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 5 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
          <Globe size={11} /> Semantic SEO Tips
        </p>
        <ul style={{ padding: "0 0 0 14px", margin: 0, fontSize: 11, color: "#6b21a8", lineHeight: 1.7 }}>
          <li>Cover related subtopics — not just your focus keyword</li>
          <li>Use natural language &amp; answer questions readers ask</li>
          <li>Link to related posts to build topic cluster authority</li>
          <li>Use synonyms instead of repeating the focus keyword</li>
          <li>Add schema markup (Article/FAQ) for rich results</li>
        </ul>
      </div>
    </div>
  );
}

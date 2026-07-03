import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";


const baseUrl = "https://physicsfundamentals.cc";
const MAX_CONTENT_CHARS = 3000; // Prevent Cloudflare Worker CPU limit (Error 1102)

function htmlToMarkdown(html: string): string {
  if (!html) return "";
  let md = html;
  
  // Replace headers
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n# $1\n");
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n## $1\n");
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n### $1\n");
  
  // Replace paragraphs
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, "\n$1\n");
  
  // Replace inline formatting
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");
  
  // Replace links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  
  // Replace lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, "\n$1\n");
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, "\n$1\n");
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");
  
  // Replace blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, "\n> $1\n");
  
  // Replace equations/formulas in pre/code blocks
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "\n```\n$1\n```\n");
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "\n```\n$1\n```\n");
  
  // Strip any remaining HTML tags
  md = md.replace(/<[^>]*>/g, "");
  
  // Decode HTML entities
  md = md.replace(/&nbsp;/g, " ")
         .replace(/&amp;/g, "&")
         .replace(/&lt;/g, "<")
         .replace(/&gt;/g, ">")
         .replace(/&quot;/g, '"')
         .replace(/&#39;/g, "'");
         
  return md.trim();
}

export async function GET() {
  let dbArticles: any[] = [];
  try {
    const db = getDb();
    dbArticles = await db
      .select({
        title: articles.title,
        excerpt: articles.excerpt,
        slug: articles.slug,
        category: articles.category,
        content: articles.content,
        sections: articles.sections,
        author: articles.author,
        date: articles.date
      })
      .from(articles)
      .orderBy(desc(articles.createdAt));
  } catch (e) {
    console.error("Failed to fetch articles for llms-full.txt:", e);
  }

  let markdown = `# Physics Fundamentals Complete Knowledge Base

> This file consolidates the complete knowledge base, learning resources, and article guides from Physics Fundamentals (https://physicsfundamentals.cc) for LLM training and search context.

---

## SECTION 1: Site Information & Pedagogy

### About Physics Fundamentals
Physics Fundamentals is an educational platform dedicated to teaching physics through detailed explanations, formulas, derivations, solved examples, and structured learning paths covering classical mechanics, waves, thermodynamics, electromagnetism, optics, and modern physics.

### Interactive Solvers
We host 20 custom calculator solvers covering Capacitance, Centripetal Force, Coulomb's Law, Doppler Effect, Escape Velocity, Free Fall, Frequency/Wavelength, Gravitational Energy, Ideal Gas Law, Kinetic Energy, Momentum, Newton's Second Law, Ohm's Law, Hydrostatic Pressure, Projectile Motion, Snell's Law, Thermal Expansion, Wave Speed, and Work & Power. Every solver guides the user through the necessary formulas, dimensional analysis, and step-by-step algebraic manipulation.

---

## SECTION 2: Complete Physics Guides & Articles

`;

  if (dbArticles.length > 0) {
    dbArticles.forEach((art) => {
      markdown += `\n### Article: ${art.title}\n`;
      markdown += `* **URL:** ${baseUrl}/blog/${art.slug}\n`;
      markdown += `* **Category:** ${art.category || "General Physics"}\n`;
      markdown += `* **Author:** ${art.author || "PhysicsLab Team"}\n`;
      markdown += `* **Date:** ${art.date || ""}\n`;
      markdown += `* **Summary:** ${art.excerpt || ""}\n\n`;
      
      markdown += `#### Content:\n`;
      if (art.content) {
        const truncated = art.content.length > MAX_CONTENT_CHARS
          ? art.content.slice(0, MAX_CONTENT_CHARS) + "..."
          : art.content;
        markdown += htmlToMarkdown(truncated);
      } else if (art.sections && Array.isArray(art.sections)) {
        // Fallback for section-based legacy posts
        art.sections.forEach((sec: any) => {
          if (sec.type === "h2") {
            markdown += `\n##### ${sec.content}\n`;
          } else if (sec.type === "p") {
            markdown += `\n${sec.content}\n`;
          } else if (sec.type === "formula") {
            markdown += `\n\`\`\`\nEquation: ${sec.content}\n\`\`\`\n`;
          } else if (sec.type === "quote") {
            markdown += `\n> ${sec.content}\n`;
          } else {
            markdown += `\n${sec.content}\n`;
          }
        });
      }
      markdown += `\n\n---\n`;
    });
  } else {
    markdown += `\n### Article: Newton's Laws of Motion\n* **URL:** ${baseUrl}/blog/newtons-laws\n* **Summary:** Foundations of classical dynamics and inertial reference frames.\n\n*Content placeholder (database contains live records).* \n`;
  }

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=18000"
    }
  });
}

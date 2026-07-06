/**
 * Pre-processes HTML content from the database, wrapping LaTeX math
 * expressions in placeholder elements with data-math attributes.
 *
 * This runs server-side on Cloudflare Workers/Pages without importing
 * KaTeX, preventing CPU resource limit errors (Error 1102).
 */
export function renderMath(html: string): string {
  if (!html) return "";
  
  // Fast path: if there are no math delimiters ($), bypass all regexes entirely
  if (!html.includes("$")) {
    return html;
  }

  // Step 1: Unescape double backslashes stored in DB
  let processed = html.replace(/\\\\/g, "\\");

  // Step 2: Block math with $$ delimiters (always run)
  processed = processed.replace(
    /(?:<p[^>]*>\s*)?\$\$([\s\S]*?)\$\$(?:\s*<\/p>)?/g,
    (_match, equation) => {
      const eq = escapeHtml(equation.trim());
      return `<div class="math-block" data-math="${eq}"></div>`;
    }
  );

  // Step 3: Inline math with $ delimiters (always run)
  processed = processed.replace(/\$([^$\n<>]+?)\$/g, (_match, equation) => {
    const eq = equation.trim();
    if (/^\d/.test(eq)) return _match;
    if (!/[a-zA-Z\\]/.test(eq)) return _match;
    const escaped = escapeHtml(eq);
    return `<span class="math-inline" data-math="${escaped}"></span>`;
  });

  // Step 4: Bare block math scan — skip for very large articles to avoid
  // Cloudflare Worker CPU limit (Error 1102). Only run on articles ≤ 60 KB.
  if (processed.length <= 60_000) {
    processed = processed.replace(
      /<p\b[^>]*>([\s\S]*?)<\/p>/gi,
      (fullMatch, inner) => {
        const plainText = inner.replace(/<[^>]+>/g, "").trim();
        if (isBlockLatex(plainText)) {
          const eq = escapeHtml(plainText);
          return `<div class="math-block" data-math="${eq}"></div>`;
        }
        return fullMatch;
      }
    );
  }

  return processed;
}

function isBlockLatex(text: string): boolean {
  if (!/\\[a-zA-Z]+/.test(text)) return false;
  if (text.length > 300) return false;
  if (/\.\s+[A-Z]/.test(text)) return false;
  return true;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

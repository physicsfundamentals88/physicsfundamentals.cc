import katex from "katex";

/**
 * Pre-processes HTML content from the database, rendering LaTeX math
 * expressions with KaTeX server-side so no client-side JS is needed.
 *
 * Handles three formula patterns:
 *  1. Block math with delimiters: $$...$$ (inside or outside <p> tags)
 *  2. Bare block math: <p>f = \frac{1}{T}</p> — paragraphs whose entire
 *     content is a LaTeX expression (starts with a backslash-command or
 *     simple var=expr pattern containing \command)
 *  3. Inline math: $...$ within text
 *  4. Double-escaped backslashes from DB: \\frac → \frac
 */
export function renderMath(html: string): string {
  if (!html) return "";

  // Step 1: Unescape double backslashes stored in DB.
  // DB stores \\frac (two backslashes). KaTeX needs \frac (one backslash).
  let processed = html.replace(/\\\\/g, "\\");

  // Step 2: Render block math $$...$$
  // Strip surrounding <p> tags to avoid invalid <p><div>...</div></p> HTML.
  processed = processed.replace(
    /(?:<p[^>]*>\s*)?\$\$([\s\S]*?)\$\$(?:\s*<\/p>)?/g,
    (_match, equation) => {
      return renderBlock(equation.trim());
    }
  );

  // Step 3: Render bare block math — <p> tags whose ENTIRE text content is
  // a LaTeX expression (contains a \command like \frac, \sqrt, \sum etc.)
  // Pattern: <p> optionally with tags inside, where the visible text
  // looks like LaTeX (contains at least one \letter sequence)
  processed = processed.replace(
    /<p([^>]*)>((?:[^<]|<(?!\/p>))*?)<\/p>/g,
    (fullMatch, attrs, inner) => {
      // Strip HTML tags from inner to get the plain text
      const plainText = inner.replace(/<[^>]+>/g, "").trim();
      // Consider it a block math paragraph if it contains a LaTeX command
      // AND the whole content is formula-like (short, has backslash commands)
      if (isBlockLatex(plainText)) {
        return renderBlock(plainText);
      }
      return fullMatch;
    }
  );

  // Step 4: Render inline math $...$
  processed = processed.replace(/\$([^$\n<>]+?)\$/g, (_match, equation) => {
    const eq = equation.trim();
    // Skip currency-like values (start with digit)
    if (/^\d/.test(eq)) return _match;
    // Must contain at least one letter or backslash to be a formula
    if (!/[a-zA-Z\\]/.test(eq)) return _match;
    return renderInline(eq);
  });

  return processed;
}

/** Returns true if the text looks like a standalone LaTeX block expression */
function isBlockLatex(text: string): boolean {
  // Must contain a backslash command like \frac, \sqrt, \sum, \int etc.
  if (!/\\[a-zA-Z]+/.test(text)) return false;
  // Must not be long prose (formulas are typically short)
  if (text.length > 300) return false;
  // Must not contain full sentences (no period followed by a space then uppercase)
  if (/\.\s+[A-Z]/.test(text)) return false;
  return true;
}

function renderBlock(equation: string): string {
  try {
    const rendered = katex.renderToString(equation, {
      displayMode: true,
      throwOnError: false,
      output: "html",
    });
    return `<div class="math-block">${rendered}</div>`;
  } catch {
    return `<div class="math-block math-error"><code>${equation}</code></div>`;
  }
}

function renderInline(equation: string): string {
  try {
    const rendered = katex.renderToString(equation, {
      displayMode: false,
      throwOnError: false,
      output: "html",
    });
    return `<span class="math-inline">${rendered}</span>`;
  } catch {
    return `<code class="math-inline-error">${equation}</code>`;
  }
}

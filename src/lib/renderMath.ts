import katex from "katex";

/**
 * Pre-processes HTML content from the database, rendering LaTeX math
 * expressions with KaTeX server-side so no client-side JS is needed.
 *
 * Handles:
 *  - Block math: $$...$$ (including wrapped in <p> tags and with CRLF line breaks)
 *  - Inline math: $...$ (skips currency-like patterns)
 *  - Double-escaped backslashes from DB (\\frac → \frac for KaTeX)
 */
export function renderMath(html: string): string {
  if (!html) return "";

  // Step 1: Unescape double backslashes stored in DB.
  // The DB stores \\frac (two backslashes). We need \frac (one backslash) for KaTeX.
  let processed = html.replace(/\\\\/g, "\\");

  // Step 2: Render block math $$...$$
  // Also strip the surrounding <p>...</p> wrapper to avoid <p><div> invalid HTML.
  // Pattern matches:
  //   - Optional leading <p> (with optional whitespace/attributes)
  //   - $$...$$  (allowing newlines, CR+LF, etc.)
  //   - Optional closing </p>
  processed = processed.replace(
    /(?:<p[^>]*>\s*)?\$\$([\s\S]*?)\$\$(?:\s*<\/p>)?/g,
    (_match, equation) => {
      try {
        const rendered = katex.renderToString(equation.trim(), {
          displayMode: true,
          throwOnError: false,
          output: "html",
        });
        return `<div class="math-block">${rendered}</div>`;
      } catch {
        return `<div class="math-block math-error"><code>${equation.trim()}</code></div>`;
      }
    }
  );

  // Step 3: Render inline math $...$
  // Requires at least one letter or backslash so we don't match currency ($10, $USD)
  // Also doesn't cross HTML tag boundaries (no < or > inside)
  processed = processed.replace(/\$([^$\n<>]+?)\$/g, (_match, equation) => {
    const eq = equation.trim();
    // Skip if it starts with a digit (currency-like: $10, $1.5)
    if (/^\d/.test(eq)) return _match;
    // Must contain at least one letter or backslash to be a formula
    if (!/[a-zA-Z\\]/.test(eq)) return _match;
    try {
      const rendered = katex.renderToString(eq, {
        displayMode: false,
        throwOnError: false,
        output: "html",
      });
      return `<span class="math-inline">${rendered}</span>`;
    } catch {
      return `<code class="math-inline-error">${eq}</code>`;
    }
  });

  return processed;
}

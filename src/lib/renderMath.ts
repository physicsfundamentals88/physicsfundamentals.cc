import katex from "katex";

/**
 * Pre-processes HTML content from the database, rendering LaTeX math
 * expressions with KaTeX server-side so no client-side JS is needed.
 *
 * Handles:
 *  - Block math: $$...$$ (anywhere in HTML, including inside <li><p>)
 *  - Inline math: $...$ (not preceded by another $)
 *  - Double-escaped backslashes from DB (\\\\frac → \\frac for KaTeX)
 */
export function renderMath(html: string): string {
  if (!html) return "";

  // Step 1: Unescape double backslashes stored in DB (\\frac → \frac)
  // The DB stores \\frac, JSON.parse turns that into \\frac in the JS string,
  // so we need \\ → \ for KaTeX to parse correctly.
  let processed = html.replace(/\\\\/g, "\\");

  // Step 2: Render block math $$...$$
  // Match $$...$$ anywhere, including inside <p> tags nested in <li>
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_match, equation) => {
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
  });

  // Step 3: Render inline math $...$
  // Use a negative lookbehind to avoid matching $$ again
  // and avoid matching currency amounts like $10 (must have a letter or \)
  processed = processed.replace(/\$([^$\n<>]+?)\$/g, (_match, equation) => {
    // Skip if it looks like a currency value (starts with a digit)
    if (/^\d/.test(equation.trim())) return _match;
    try {
      const rendered = katex.renderToString(equation.trim(), {
        displayMode: false,
        throwOnError: false,
        output: "html",
      });
      return `<span class="math-inline">${rendered}</span>`;
    } catch {
      return `<code class="math-inline-error">${equation.trim()}</code>`;
    }
  });

  return processed;
}

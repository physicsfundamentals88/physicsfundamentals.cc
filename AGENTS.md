<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Repository Context & Agent Memory

This file serves as a memory store for future development sessions on this repository.

## 🛠️ Architecture & Tech Stack
* **Framework**: Next.js (with Cloudflare Pages / OpenNext adapter compatibility).
* **Database**: Drizzle ORM + Cloudflare D1 SQLite database.
  * DB Binding Name: `DB` (configured in `wrangler.toml`).
  * Schema defined in `src/db/schema.ts`.
  * Local DB cache is stored in `.wrangler/state/v3/d1`.
  * Local queries can be run via: `npx wrangler d1 execute physics-blog-db --local --command "YOUR_SQL"`
* **Styles**: TailwindCSS/PostCSS with modern customized themes in `src/app/globals.css`.

## 🚀 Performance & Accessibility Optimizations (June 2026)
* **Goal**: Maintain 95+ Mobile performance and accessibility scores in Lighthouse.
* **Animations**:
  * Avoid importing `framer-motion` in high-priority or below-fold homepage sections.
  * Use plain CSS transitions/animations where possible (defined in `globals.css`) to prevent bundle bloat.
  * Hero particles limited to 8 and orbital rings to 3 to avoid paint-lag.
  * GPU filters like `backdrop-filter: blur()` are removed or minimized on the mobile Navbar.
* **Accessibility**:
  * Skip navigation link (`Skip to main content` pointing to `#main-content`) is active.
  * All decorative SVGs must have `aria-hidden="true"`.
  * All interactives/buttons/links must contain proper `aria-label` or contextual description.
  * Color contrast ratios satisfy WCAG AA (using `#64748b` or darker on white/gray backgrounds).

## 📝 Blog & Math Formula Conventions
* **Blog Posts**:
  * Blog post list is rendered dynamically from D1 in `/blog` via `BlogClient.tsx`.
  * Single post page is at `/blog/[slug]` and uses `PostClient.tsx`.
  * **Title & Excerpt**: We do NOT display `article.excerpt` at the top of the post details page to prevent duplication of introductory paragraphs.
  * **Math Formulas**: Since KaTeX/MathJax is not used on this site, block equations (`$$...$$`) and inline math (`$...$`) are pre-processed on the fly inside `PostClient.tsx` using `processContent()`:
    * Block equations `<p>$$Equation$$</p>` are replaced with `<pre><code>Equation</code></pre>`.
    * Inline equations `$Equation$` are replaced with `<code>Equation</code>`.
    * They are styled via `.article-body pre` in `PostClient.tsx` to display centered, inside light-shaded rounded border boxes.


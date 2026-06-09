import { blogArticles } from "../src/data/blogArticles";

/**
 * Migration Script Instructions:
 * 
 * 1. Ensure you have created your D1 database:
 *    wrangler d1 create physics-blog-db
 * 
 * 2. Update wrangler.toml with your database_id.
 * 
 * 3. Run migrations locally:
 *    npx drizzle-kit generate
 *    npx wrangler d1 migrations apply physics-blog-db --local
 * 
 * 4. To seed your database with existing articles, you can use the CMS or a direct SQL insert.
 *    Below is the SQL to seed your initial 3 articles.
 */

console.log("-- SQL SEED SCRIPT --");
blogArticles.forEach(article => {
  const sql = `INSERT INTO articles (slug, title, excerpt, date, read_time, category, author, author_initials, author_bg, sections, toc) 
VALUES ('${article.slug}', '${article.title}', '${article.excerpt}', '${article.date}', '${article.readTime}', '${article.category}', '${article.author}', '${article.authorInitials}', '${article.authorBg}', '${JSON.stringify(article.sections)}', '${JSON.stringify(article.toc)}');`;
  console.log(sql);
});

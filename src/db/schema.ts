import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  date: text("date").notNull(),
  readTime: text("read_time").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  authorInitials: text("author_initials").notNull(),
  authorBg: text("author_bg").notNull(),
  heroImage: text("hero_image"),
  content: text("content"),
  status: text("status").notNull().default("draft"), // draft, published, scheduled
  scheduledDate: text("scheduled_date"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  siteName: text("site_name"),
  // JSON content
  sections: text("sections", { mode: "json" }).notNull(),
  toc: text("toc", { mode: "json" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const pages = sqliteTable("pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content"),
  status: text("status").notNull().default("draft"), // draft, published
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const searchStats = sqliteTable("search_stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull().unique(), // e.g., "2024-03-20"
  clicks: integer("clicks").notNull(),
  impressions: integer("impressions").notNull(),
  ctr: text("ctr").notNull(),
  position: text("position").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // Hashed
  name: text("name").notNull(),
  role: text("role").notNull().default("admin"), // admin, editor
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type Article = typeof articles.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type SearchStat = typeof searchStats.$inferSelect;
export type User = typeof users.$inferSelect;

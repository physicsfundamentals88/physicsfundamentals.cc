CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`date` text NOT NULL,
	`read_time` text NOT NULL,
	`category` text NOT NULL,
	`author` text NOT NULL,
	`author_initials` text NOT NULL,
	`author_bg` text NOT NULL,
	`hero_image` text,
	`content` text,
	`sections` text NOT NULL,
	`toc` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);
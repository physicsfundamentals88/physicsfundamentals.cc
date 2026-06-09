CREATE TABLE `pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`meta_title` text,
	`meta_description` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pages_slug_unique` ON `pages` (`slug`);--> statement-breakpoint
CREATE TABLE `search_stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`clicks` integer NOT NULL,
	`impressions` integer NOT NULL,
	`ctr` text NOT NULL,
	`position` text NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `search_stats_date_unique` ON `search_stats` (`date`);--> statement-breakpoint
ALTER TABLE `articles` ADD `status` text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE `articles` ADD `scheduled_date` text;--> statement-breakpoint
ALTER TABLE `articles` ADD `meta_title` text;--> statement-breakpoint
ALTER TABLE `articles` ADD `meta_description` text;--> statement-breakpoint
ALTER TABLE `articles` ADD `site_name` text;
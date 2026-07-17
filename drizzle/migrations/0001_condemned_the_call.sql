CREATE TABLE `replies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`review_id` int NOT NULL,
	`admin_id` int NOT NULL,
	`text` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `replies_id` PRIMARY KEY(`id`)
);

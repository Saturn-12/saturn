CREATE TABLE `ideaConnections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`fromIdeaId` int NOT NULL,
	`toIdeaId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ideaConnections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ideas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`tags` text NOT NULL,
	`kind` varchar(80) NOT NULL,
	`color` varchar(32) NOT NULL,
	`imageUrl` text,
	`note` text,
	`status` enum('Raw','Developing','Building','Archived') NOT NULL DEFAULT 'Raw',
	`resource` text,
	`resourceLabel` varchar(255),
	`starred` int NOT NULL DEFAULT 0,
	`positionX` int NOT NULL DEFAULT 4,
	`positionY` int NOT NULL DEFAULT 4,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ideas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `ideaConnections` ADD CONSTRAINT `ideaConnections_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ideaConnections` ADD CONSTRAINT `ideaConnections_fromIdeaId_ideas_id_fk` FOREIGN KEY (`fromIdeaId`) REFERENCES `ideas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ideaConnections` ADD CONSTRAINT `ideaConnections_toIdeaId_ideas_id_fk` FOREIGN KEY (`toIdeaId`) REFERENCES `ideas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ideas` ADD CONSTRAINT `ideas_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
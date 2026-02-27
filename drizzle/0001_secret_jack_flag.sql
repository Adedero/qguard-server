CREATE TABLE "meta" (
	"id" text PRIMARY KEY NOT NULL,
	"usersCount" integer DEFAULT 0 NOT NULL,
	"reportsCount" integer DEFAULT 0 NOT NULL,
	"evidencesCount" integer DEFAULT 0 NOT NULL,
	"filesCount" integer DEFAULT 0 NOT NULL,
	"kitoMembersCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT NOW() NOT NULL,
	"updatedAt" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "extraLocationInfo" DROP NOT NULL;
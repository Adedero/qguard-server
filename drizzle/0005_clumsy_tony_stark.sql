ALTER TABLE "meta" RENAME COLUMN "reportsCount" TO "reports_count";--> statement-breakpoint
ALTER TABLE "meta" RENAME COLUMN "evidencesCount" TO "evidences_count";--> statement-breakpoint
ALTER TABLE "meta" RENAME COLUMN "filesCount" TO "files_count";--> statement-breakpoint
ALTER TABLE "meta" RENAME COLUMN "kitoMembersCount" TO "kito_members_count";--> statement-breakpoint
ALTER TABLE "meta" ADD COLUMN "users_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "meta" DROP COLUMN "usersCount";
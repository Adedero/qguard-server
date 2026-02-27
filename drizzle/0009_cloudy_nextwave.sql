ALTER TABLE "meta" ADD COLUMN "pending_reports_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "meta" ADD COLUMN "approved_reports_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "meta" DROP COLUMN "reports_count";
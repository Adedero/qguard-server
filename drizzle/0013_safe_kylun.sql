ALTER TABLE "evidences" DROP CONSTRAINT "evidences_reportId_reports_id_fk";
--> statement-breakpoint
ALTER TABLE "evidences" ADD CONSTRAINT "evidences_reportId_reports_id_fk" FOREIGN KEY ("reportId") REFERENCES "public"."reports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "timeZone";--> statement-breakpoint
ALTER TABLE "meta" DROP COLUMN "evidences_count";
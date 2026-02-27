ALTER TABLE "evidences" DROP CONSTRAINT "evidences_reportId_reports_id_fk";
--> statement-breakpoint
ALTER TABLE "evidences" ADD CONSTRAINT "evidences_reportId_reports_id_fk" FOREIGN KEY ("reportId") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
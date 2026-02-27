ALTER TABLE "reports_to_kito_members" DROP CONSTRAINT "reports_to_kito_members_report_id_reports_id_fk";
--> statement-breakpoint
ALTER TABLE "reports_to_kito_members" DROP CONSTRAINT "reports_to_kito_members_kito_member_id_kito_members_id_fk";
--> statement-breakpoint
ALTER TABLE "reports_to_kito_members" ADD CONSTRAINT "reports_to_kito_members_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports_to_kito_members" ADD CONSTRAINT "reports_to_kito_members_kito_member_id_kito_members_id_fk" FOREIGN KEY ("kito_member_id") REFERENCES "public"."kito_members"("id") ON DELETE cascade ON UPDATE no action;
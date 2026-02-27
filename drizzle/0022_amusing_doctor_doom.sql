ALTER TABLE "reports" DROP CONSTRAINT "reports_locationId_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "evidences" ADD COLUMN "locationId" text;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_locationId_locations_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidences" ADD CONSTRAINT "evidences_locationId_locations_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;
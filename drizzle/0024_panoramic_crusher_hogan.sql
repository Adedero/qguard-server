ALTER TABLE "reports" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
CREATE INDEX "reports__deleted_at_idx" ON "reports" USING btree ("deletedAt");--> statement-breakpoint
CREATE INDEX "locations__deleted_at_idx" ON "locations" USING btree ("deletedAt");
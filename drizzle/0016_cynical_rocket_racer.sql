ALTER TABLE "reports" ADD COLUMN "approvedAt" timestamp;--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "approvedAt";
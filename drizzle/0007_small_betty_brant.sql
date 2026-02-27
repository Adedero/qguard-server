ALTER TABLE "reports" RENAME COLUMN "extraLocationInfo" TO "locationInfo";--> statement-breakpoint
ALTER TABLE "locations" RENAME COLUMN "address" TO "locationName";--> statement-breakpoint
DROP INDEX "search_index";--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "displayName" text NOT NULL;--> statement-breakpoint
CREATE INDEX "search_index" ON "locations" USING gin ((
        setweight(to_tsvector('english', "name"), 'A') ||
        setweight(to_tsvector('english', "locationName"), 'B') ||
        setweight(to_tsvector('english', "displayName"), 'C')
      ));--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "description";
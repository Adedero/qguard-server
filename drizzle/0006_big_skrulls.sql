CREATE TABLE "locations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"description" text,
	"subregion" text NOT NULL,
	"region" text NOT NULL,
	"country" text NOT NULL,
	"latitude" real,
	"longitude" real,
	"reportsCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT NOW() NOT NULL,
	"updatedAt" timestamp DEFAULT NOW() NOT NULL,
	CONSTRAINT "locations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "locationId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "meta" ADD COLUMN "locations_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX "name" ON "locations" USING btree ("name");--> statement-breakpoint
CREATE INDEX "search_index" ON "locations" USING gin ((
        setweight(to_tsvector('english', "name"), 'A') ||
        setweight(to_tsvector('english', "address"), 'B') ||
        setweight(to_tsvector('english', "description"), 'C')
      ));--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_locationId_locations_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reports_created_at_id_idx" ON "reports" USING btree ("createdAt","id");--> statement-breakpoint
CREATE INDEX "location_id" ON "reports" USING btree ("locationId");--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "locationName";--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "country";--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "region";--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "subregion";--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "address";--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "latitude";--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "longitude";
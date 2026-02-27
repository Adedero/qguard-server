import { createdAt, id, updatedAt } from "#database/utils/_partials.js";
import { relations, sql } from "drizzle-orm";
import { boolean, index, integer, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";
import { reports } from "./report.model.js";
import { evidences } from "./evidence.model.js";

export type LocationModel = typeof locations.$inferSelect;

export const locations = pgTable(
  "locations",
  {
    id,
    name: text().notNull().unique(),
    locationName: text().notNull(),
    displayName: text().notNull(),
    subregion: text().notNull(),
    region: text().notNull(),
    country: text().notNull(),
    latitude: real(),
    longitude: real(),
    reportsCount: integer().notNull().default(0),
    deletedAt: timestamp(),
    createdAt,
    updatedAt
  },
  (t) => [
    index("name").on(t.name),
    index("search_index").using(
      "gin",
      sql`(
        setweight(to_tsvector('english', ${t.name}), 'A') ||
        setweight(to_tsvector('english', ${t.locationName}), 'B') ||
        setweight(to_tsvector('english', ${t.displayName}), 'C')
      )`
    ),
    index("locations__deleted_at_idx").on(t.deletedAt)
  ]
);

export const locationsRelations = relations(locations, ({ many }) => ({
  reports: many(reports),
  evidences: many(evidences)
}));

import { createdAt, id, updatedAt } from "../utils/_partials.js";
import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { reports } from "./report.model.js";
import { relations } from "drizzle-orm";
import { users } from "./user.model.js";
import { locations } from "./location.model.js";

export type EvidenceModel = typeof evidences.$inferSelect;

export const evidences = table("evidences", {
  id,
  userId: t
    .text()
    .notNull()
    .references(() => users.id),
  reportId: t
    .text()
    .references(() => reports.id, { onDelete: "cascade" })
    .notNull(),
  locationId: t
    .text()
    .notNull()
    .references(() => locations.id),
  fileId: t.text().notNull(),
  fileName: t.text().notNull(),
  fileURL: t.text().notNull(),
  fileType: t.text().notNull(),
  fileSize: t.integer().notNull(),
  createdAt,
  updatedAt
});

export const evidencesRelations = relations(evidences, ({ one }) => ({
  uploader: one(users, {
    fields: [evidences.userId],
    references: [users.id]
  }),
  report: one(reports, {
    fields: [evidences.reportId],
    references: [reports.id]
  }),
  location: one(locations, {
    fields: [evidences.locationId],
    references: [locations.id]
  })
}));

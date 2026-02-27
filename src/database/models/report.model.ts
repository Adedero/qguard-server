import { desc, relations } from "drizzle-orm";
import { createdAt, id, updatedAt } from "../utils/_partials.js";
import { primaryKey, pgTable, text, date, index, boolean, timestamp } from "drizzle-orm/pg-core";
import { evidences } from "./evidence.model.js";
import { kitoMembers } from "./kito-member.model.js";
import { locations } from "./location.model.js";
import { users } from "./user.model.js";

export type ReportModel = typeof reports.$inferSelect;
export type ReportModelInsert = typeof reports.$inferInsert;

export const reports = pgTable(
  "reports",
  {
    id,
    locationId: text()
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
    reporterId: text()
      .notNull()
      .references(() => users.id, { onDelete: "no action" }),
    incidentDate: date().notNull(),
    locationInfo: text(),
    description: text().notNull(),
    pendingApproval: boolean().notNull().default(true),
    approvedAt: timestamp(),
    deletedAt: timestamp(),
    createdAt,
    updatedAt
  },
  (table) => [
    index("reports_id_desc_idx").on(table.createdAt, desc(table.id)),
    index("pending_approval_idx").on(table.pendingApproval),
    index("location_id").on(table.locationId),
    index("reports__deleted_at_idx").on(table.deletedAt)
  ]
);

export const reportsRelations = relations(reports, ({ one, many }) => ({
  reporter: one(users, {
    fields: [reports.reporterId],
    references: [users.id]
  }),
  location: one(locations, {
    fields: [reports.locationId],
    references: [locations.id]
  }),
  evidences: many(evidences),
  reportsToKitoMembers: many(reportsToKitoMembers)
}));

// Join Table
export const reportsToKitoMembers = pgTable(
  "reports_to_kito_members",
  {
    reportId: text("report_id")
      .notNull()
      .references(() => reports.id, { onDelete: "cascade" }),
    kitoMemberId: text("kito_member_id")
      .notNull()
      .references(() => kitoMembers.id, { onDelete: "cascade" })
  },
  (table) => [primaryKey({ columns: [table.reportId, table.kitoMemberId] })]
);

export const reportsToKitoMembersRelations = relations(reportsToKitoMembers, ({ one }) => ({
  kitoMember: one(kitoMembers, {
    fields: [reportsToKitoMembers.kitoMemberId],
    references: [kitoMembers.id]
  }),
  report: one(reports, {
    fields: [reportsToKitoMembers.reportId],
    references: [reports.id]
  })
}));

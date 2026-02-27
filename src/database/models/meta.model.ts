import { createdAt, id, updatedAt } from "#database/utils/_partials.js";
import { integer, pgTable } from "drizzle-orm/pg-core";

export type MetaModel = typeof meta.$inferSelect;

export type MetaIncrementFields =
  | "usersCount"
  | "locationsCount"
  | "pendingReportsCount"
  | "approvedReportsCount"
  | "kitoMembersCount";

export const meta = pgTable("meta", {
  id,
  usersCount: integer("users_count").notNull().default(0),
  locationsCount: integer("locations_count").notNull().default(0),
  pendingReportsCount: integer("pending_reports_count").notNull().default(0),
  approvedReportsCount: integer("approved_reports_count").notNull().default(0),
  kitoMembersCount: integer("kito_members_count").notNull().default(0),
  createdAt,
  updatedAt
});

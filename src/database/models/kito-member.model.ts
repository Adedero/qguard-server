import { createdAt, id, updatedAt } from "../utils/_partials.js";
import * as t from "drizzle-orm/pg-core";
import { reportsToKitoMembers } from "./report.model.js";
import { relations } from "drizzle-orm";

export type KitoMemberModel = typeof kitoMembers.$inferSelect;

export const kitoMembers = t.pgTable("kito_members", {
  id,
  fullName: t.text().notNull(),
  aliases: t.text().array().notNull().default([]),
  contacts: t.jsonb().$type<{ id: string; type: string; value: string }[]>().notNull().default([]),
  createdAt,
  updatedAt
});

export const kitoMembersRelations = relations(kitoMembers, ({ many }) => ({
  reportsToKitoMembers: many(reportsToKitoMembers)
}));

import * as t from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../utils/_partials.js";
import { users } from "./user.model.js";
import { relations } from "drizzle-orm";

export const sessions = t.pgTable("sessions", {
  id,
  userId: t
    .text()
    .notNull()
    .references(() => users.id),
  // deviceFingerprint: t.text().notNull(),
  // requiresVerification: t.boolean().notNull().default(false),
  refreshToken: t.text().notNull().unique(), // a hash of the token. not the raw value
  expiresAt: t.timestamp().notNull(),
  lastUsedAt: t.timestamp().notNull(), // update on refresh
  revokedAt: t.timestamp(),
  ipAddress: t.text(),
  userAgent: t.text(),
  createdAt,
  updatedAt
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}))
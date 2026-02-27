import { relations } from "drizzle-orm";
import { createdAt, id, updatedAt } from "../utils/_partials.js";
import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { evidences } from "./evidence.model.js";
import { reports } from "./report.model.js";
import { sessions } from "./session.model.js";

// User table
export type UserModel = typeof users.$inferSelect;

export const users = table(
  "users",
  {
    id,
    firstName: t.text().notNull(),
    lastName: t.text().notNull(),
    email: t.text().notNull().unique(),
    emailVerified: t.boolean().notNull().default(false),
    image: t.jsonb().$type<{ id: string; url: string }>(),
    role: t
      .text({ enum: ["admin", "user"] })
      .notNull()
      .default("user"),
    country: t.text().notNull(),
    region: t.text().notNull(),
    subregion: t.text().notNull(),
    phone: t.text(),
    lastLoginMethod: t.text(),
    banned: t.boolean().notNull().default(false),
    bannedReason: t.text(),
    bannedAt: t.timestamp(),
    banExpiresAt: t.timestamp(),
    lastLoggedInAt: t.timestamp(),
    lastActiveAt: t.timestamp(),
    createdAt,
    updatedAt
  },
  (table) => [t.index("user_email_idx").on(table.email)]
);

export const usersRelations = relations(users, ({ many }) => ({
  reports: many(reports),
  evidences: many(evidences),
  sessions: many(sessions)
}));

import * as t from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../utils/_partials.js";

export const verificationTypeEnum = t.pgEnum("verification-type", [
  "email_verification",
  "password_reset"
]);

export type VerificationModel = typeof verifications.$inferSelect;

export const verifications = t.pgTable(
  "verifications",
  {
    id,
    identifier: t.text().notNull(),
    value: t.text().notNull().unique(), // a hash of the token. not the raw value
    type: verificationTypeEnum().notNull(),
    expiresAt: t.timestamp().notNull(),
    createdAt,
    updatedAt
  },
  (table) => [
    t.index("verification_identifier_idx").on(table.identifier),
    t.uniqueIndex("verification_identifier_type_idx").on(table.identifier, table.type)
  ]
);

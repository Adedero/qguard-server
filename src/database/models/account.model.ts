import * as t from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../utils/_partials.js";
import { users } from "./user.model.js";
import { relations } from "drizzle-orm";

export const accounts = t.pgTable(
  "accounts",
  {
    id,
    userId: t
      .text()
      .notNull()
      .references(() => users.id)
      .unique(),
    providerId: t.text().notNull(),
    password: t.text(),
    createdAt,
    updatedAt
  },
  (table) => [t.index("account_user_id_idx").on(table.userId)]
);
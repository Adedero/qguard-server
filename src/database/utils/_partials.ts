import * as t from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { ulid } from "ulid";

export const id = t
  .text()
  .primaryKey()
  .$defaultFn(() => ulid());

export const createdAt = t
  .timestamp()
  .notNull()
  .default(sql`NOW()`);

export const updatedAt = t
  .timestamp()
  .notNull()
  .default(sql`NOW()`);

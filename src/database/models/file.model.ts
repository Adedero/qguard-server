import * as t from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../utils/_partials.js";

export const fileType = t.pgEnum("asset-type", [
  "image",
  "video",
  "audio",
  "document",
  "archive",
  "other"
]);

export type FileModel = typeof files.$inferSelect;

export const files = t.pgTable(
  "files",
  {
    id,
    filename: t.text().notNull(),
    path: t.text().notNull(),
    url: t.text().notNull().unique(),
    type: fileType().notNull(),
    mimeType: t.text().notNull(),
    ext: t.text().notNull(),
    size: t.integer().notNull(),
    createdAt,
    updatedAt
  },
  (table) => [t.index("file_url_idx").on(table.url)]
);

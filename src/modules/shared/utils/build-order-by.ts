import { asc, desc } from "drizzle-orm";

export function buildOrderBy<T extends Record<string, any>>(
  table: T,
  field: keyof T,
  direction: "asc" | "desc"
) {
  const column = table[field as string];

  return direction === "asc" ? asc(column) : desc(column);
}

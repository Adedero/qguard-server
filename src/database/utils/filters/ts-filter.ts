import type { PgColumn } from "drizzle-orm/pg-core";
import { or, and, ilike, sql, type SQL } from "drizzle-orm";

interface TextSearchFilterOptions {
  strict?: boolean;
}
export const textSearchFilter = (
  query: string | string[] | undefined,
  columns: PgColumn[],
  options: TextSearchFilterOptions = {}
): SQL | undefined => {
  const { strict = true } = options;

  if (!query || columns.length === 0) return undefined;

  const terms = (Array.isArray(query) ? query : [query]).map((q) => q.trim()).filter(Boolean);

  if (!terms.length) return undefined;

  const filters = terms.map((term) => or(...columns.map((col) => ilike(col, `%${term}%`))));

  if (strict) {
    return and(...filters);
  }

  return or(...filters);
};

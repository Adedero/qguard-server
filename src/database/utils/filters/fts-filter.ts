import type { PgColumn } from "drizzle-orm/pg-core";
import { sql, type SQL } from "drizzle-orm";

type TSQueryMode = "to_tsquery" | "plainto_tsquery" | "phraseto_tsquery" | "websearch_to_tsquery";

type RankMode = "ts_rank" | "ts_rank_cd";

interface FTSOptions {
  language?: string; // default: 'english'
  mode?: TSQueryMode; // default: 'websearch_to_tsquery'
  weights?: ("A" | "B" | "C" | "D")[]; // optional per-column weights
  rank?: RankMode; // optional ranking function
}

interface FTSResult {
  where: SQL;
  rank?: SQL;
}

export const fullTextSearchFilter = (
  query: string | undefined,
  columns: PgColumn[],
  options?: FTSOptions
): FTSResult | undefined => {
  if (!query?.trim() || columns.length === 0) return undefined;

  const { language = "english", mode = "plainto_tsquery", weights, rank } = options ?? {};

  // Build tsvector expression
  const vectorParts = columns.map((col, i) => {
    const base = sql`to_tsvector(${language}, coalesce(${col}, ''))`;

    if (weights?.[i]) {
      return sql`setweight(${base}, ${weights[i]})`;
    }

    return base;
  });

  // Concatenate vectors safely
  const combinedVector = vectorParts.reduce((acc, curr) => (acc ? sql`${acc} || ${curr}` : curr));

  // Build query function dynamically
  const tsQuery =
    mode === "to_tsquery"
      ? sql`to_tsquery(${language}, ${query})`
      : mode === "plainto_tsquery"
        ? sql`plainto_tsquery(${language}, ${query})`
        : mode === "phraseto_tsquery"
          ? sql`phraseto_tsquery(${language}, ${query})`
          : sql`websearch_to_tsquery(${language}, ${query})`;

  const where = sql`${combinedVector} @@ ${tsQuery}`;

  if (!rank) {
    return { where };
  }

  const rankExpression =
    rank === "ts_rank_cd"
      ? sql`ts_rank_cd(${combinedVector}, ${tsQuery})`
      : sql`ts_rank(${combinedVector}, ${tsQuery})`;

  return {
    where,
    rank: rankExpression
  };
};

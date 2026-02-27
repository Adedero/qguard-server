import type { Database, DatabaseTransaction } from "#database/index.js";
import { Table } from "#database/models/index.js";
import type { MetaIncrementFields, MetaModel } from "#database/schema.js";
import env from "#lib/env/index.js";
import { eq, sql } from "drizzle-orm";

export type UpdateMetaInput = {
  db: Database | DatabaseTransaction;
  increment?: Partial<Record<MetaIncrementFields, number | undefined>>;
};

export const updateMeta = async (input: UpdateMetaInput) => {
  const { db, increment = {} } = input;

  if (Object.keys(increment).length === 0) return;

  // Build the SQL for each field: field = field + value
  const setQuery: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(increment)) {
    // Only handle numeric increments
    if (typeof value === "number" && value !== 0) {
      const column = Table.meta[key as MetaIncrementFields];
      setQuery[key] = sql`GREATEST(${column} + ${value}, 0)`; // Ensure it doesn't go below 0
    }
  }

  if (Object.keys(setQuery).length === 0) return;

  // Upsert into singleton meta row
  await db
    .insert(Table.meta)
    .values({
      id: env.get("META_ID"), // fixed singleton ID
      ...Object.fromEntries(
        Object.entries(increment).map(([k, v]) => [k, v]) // initial insert values
      )
    })
    .onConflictDoUpdate({
      target: Table.meta.id,
      set: setQuery
    });
};

export const getMeta = async (db: Database): Promise<MetaModel | null> => {
  let [meta] = await db
    .select()
    .from(Table.meta)
    .where(eq(Table.meta.id, env.get("META_ID")))
    .limit(1);

  if (!meta) {
    meta = await db
      .insert(Table.meta)
      .values({
        id: env.get("META_ID")
      })
      .returning()
      .then((rows) => rows[0]);
  }

  // return the single row or null if it doesn't exist
  return meta ?? null;
};

export const Meta = {
  update: updateMeta,
  get: getMeta
};

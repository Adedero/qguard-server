import env from "#lib/env/index.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { Relations, Table } from "./models/index.js";

const db = drizzle(env.get("DATABASE_URL"), {
  schema: { ...Table, ...Relations }
});

export default db;

export type Database = typeof db;
export type DatabaseTransaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

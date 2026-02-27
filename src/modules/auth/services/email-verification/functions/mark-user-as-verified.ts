import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { eq } from "drizzle-orm";

export const markUserAsVerified = async (userId: string) => {
  await db.update(Table.users).set({ emailVerified: true }).where(eq(Table.users.id, userId));
};

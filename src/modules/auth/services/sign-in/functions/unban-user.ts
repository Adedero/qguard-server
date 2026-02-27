import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { eq } from "drizzle-orm";

export async function unbanUser(userId: string) {
  await db
    .update(Table.users)
    .set({ banned: false, bannedReason: null, bannedAt: null, banExpiresAt: null })
    .where(eq(Table.users.id, userId));
}

import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { eq } from "drizzle-orm";

export async function revokeAllUserSessions(userId: string) {
  const now = new Date();
  await db
    .update(Table.sessions)
    .set({
      revokedAt: now,
      updatedAt: now
    })
    .where(eq(Table.sessions.userId, userId));
}

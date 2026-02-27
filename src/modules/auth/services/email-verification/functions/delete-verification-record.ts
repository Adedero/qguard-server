import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { eq } from "drizzle-orm";

export const deleteVerificationRecord = async (id: string) => {
  await db.delete(Table.verifications).where(eq(Table.verifications.id, id));
};

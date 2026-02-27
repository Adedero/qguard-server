import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import type { VerificationModel } from "#database/schema.js";
import { HttpException } from "#errors/http-exception.js";
import { eq, or } from "drizzle-orm";

export const getUserFromVerificationRecord = async (record: VerificationModel) => {
  const results = await db
    .select()
    .from(Table.users)
    .where(or(eq(Table.users.id, record.identifier), eq(Table.users.email, record.identifier)));

  const user = results[0];

  if (!user) {
    throw HttpException.BAD_REQUEST("Invalid token");
  }

  return user;
};

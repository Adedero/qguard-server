import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import type { VerificationModel } from "#database/schema.js";
import { HttpException } from "#errors/http-exception.js";
import { Text } from "#utils/text/index.js";
import { and, eq } from "drizzle-orm";

export const getVerificationRecord = async (
  rawToken: string,
  tokenType: VerificationModel["type"]
) => {
  const hash = Text.sha256(rawToken);

  const result = await db
    .select()
    .from(Table.verifications)
    .where(and(eq(Table.verifications.value, hash), eq(Table.verifications.type, tokenType)));
  const record = result[0];

  if (!record) {
    throw HttpException.BAD_REQUEST("Invalid token");
  }

  return record;
};

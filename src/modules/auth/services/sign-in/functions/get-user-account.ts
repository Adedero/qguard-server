import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { HttpException } from "#errors/http-exception.js";
import { eq } from "drizzle-orm";

export const getUserAccount = async (userId: string) => {
  if (typeof userId !== "string") {
    throw HttpException.BAD_REQUEST("Invalid user ID.");
  }

  const account = (
    await db.select().from(Table.accounts).where(eq(Table.accounts.userId, userId))
  )[0];

  if (!account) {
    // await db.delete(Table.users).where(eq(Table.users.id, userId));
    throw HttpException.NOT_FOUND("Invalid email or password");
  }

  return account;
};

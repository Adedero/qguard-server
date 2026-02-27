import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { eq } from "drizzle-orm";
import z from "zod";

export const userAlreadyExists = async (input: string) => {
  const email = z.email().parse(input);
  const users = await db.select({}).from(Table.users).where(eq(Table.users.email, email));
  return users.length > 0;
};

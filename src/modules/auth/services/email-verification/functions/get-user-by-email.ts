import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import type { UserModel } from "#database/schema.js";
import { HttpException } from "#errors/http-exception.js";
import { eq } from "drizzle-orm";

export interface GetUserByEmailOptions {
  throwOnError?: boolean;
}

export async function getUserByEmail(
  email: string,
  options: { throwOnError: true }
): Promise<UserModel>;

export async function getUserByEmail(
  email: string,
  options?: { throwOnError?: false }
): Promise<UserModel | undefined>;

export async function getUserByEmail(
  email: string,
  options?: GetUserByEmailOptions
): Promise<UserModel | undefined> {
  const throwOnError = options?.throwOnError ?? false;

  const user = await db.query.users.findFirst({
    where: eq(Table.users.email, email)
  });

  if (throwOnError && !user) {
    throw HttpException.NOT_FOUND("User not found");
  }

  return user;
}

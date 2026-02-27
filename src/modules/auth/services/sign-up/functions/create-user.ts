import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { HttpException } from "#errors/http-exception.js";
import type { SignUpSchema } from "../../../schemas/sign-up.schema.js";

export const createUser = async (
  input: Omit<SignUpSchema, "emailVerified" | "sendWelcomeEmail" | "password">
) => {
  const user = (
    await db
      .insert(Table.users)
      .values({ ...input, phone: input.phone || null, image: input.image || null })
      .returning()
  )[0];

  if (!user) {
    throw HttpException.INTERNAL("Failed to create user.");
  }

  return user;
};

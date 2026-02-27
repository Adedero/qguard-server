import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { HttpException } from "#errors/http-exception.js";
import {
  createAccountSchema,
  type CreateAccountSchema
} from "../../../schemas/create-account.schema.js";

export const createAccount = async (input: CreateAccountSchema) => {
  const result = createAccountSchema.safeParse(input);
  if (!result.success) {
    throw HttpException.BAD_REQUEST(
      result.error.issues[0]?.message || "Failed to create user account. Could not validate input."
    );
  }
  const validatedInput = result.data;

  const account = (
    await db
      .insert(Table.accounts)
      .values({
        ...validatedInput,
        providerId: "credential"
      })
      .returning()
  )[0];

  if (!account) {
    throw HttpException.INTERNAL("Failed to create user account");
  }

  return account;
};

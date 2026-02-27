import { Text } from "#utils/text/index.js";
import z from "zod";
import { PasswordService } from "../services/password/index.js";

export type CreateAccountSchema = z.infer<typeof createAccountSchema>;

export const createAccountSchema = z.object({
  userId: z.coerce.string().refine(Text.isULID, "User ID is invalid."),
  password: z.coerce.string().refine(PasswordService.isHash, "Password is not hashed.")
});

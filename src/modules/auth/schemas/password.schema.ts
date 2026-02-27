import { MAX_PASSWORD_LEN, MIN_PASSWORD_LEN } from "#utils/constants.js";
import * as z from "zod";

export type PasswordSchema = z.infer<typeof passwordSchema>;

export const passwordSchema = z
  .string("Password is required")
  .trim()
  .min(MIN_PASSWORD_LEN, `Password must be at least ${MIN_PASSWORD_LEN} characters long.`)
  .max(MAX_PASSWORD_LEN, "Password is too long.")
  .refine(
    (value) => /(?=.*[A-Z])/.test(value),
    "Password must contain at least one uppercase letter."
  )
  .refine(
    (value) => /(?=.*[a-z])/.test(value),
    "Password must contain at least one lowercase letter."
  )
  .refine((value) => /(?=.*\d)/.test(value), "Password must contain at least one number.");

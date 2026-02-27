import { MAX_STR_LEN } from "#utils/constants.js";
import { Text } from "#utils/text/index.js";
// import { TimeZone } from "#utils/time-zone/index.js";
import z from "zod";
import { passwordSchema } from "./password.schema.js";

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const signUpSchema = z.object({
  firstName: z
    .string("First name is required.")
    .nonempty("First name is required.")
    .min(2, "First name is too short.")
    .max(MAX_STR_LEN, "First name is too long."),
  lastName: z
    .string("Last name is required.")
    .nonempty("Last name is required.")
    .min(2, "Last name is too short.")
    .max(MAX_STR_LEN, "Last name is too long."),
  email: z.email("Email is invalid."),
  password: passwordSchema,
  image: z
    .object({
      url: z.url("Invalid image URL."),
      id: z.string("Image id is required")
    })
    .optional()
    .nullable(),
  // timeZone: z
  //   .string("Time zone is required")
  //   .refine((tz) => TimeZone.isTimeZone(tz), "Invalid IANA time zone")
  //   .optional(),
  country: z.string().nonempty("Country is required."),
  region: z.string().nonempty("State or region is required."),
  subregion: z.string().nonempty("Subregion is required."),
  phone: z.string().refine(Text.isPhoneNumber, "Phone number is invalid.").optional().nullable(),
  role: z
    .enum(["admin", "user"], "Role must be either 'admin' or 'user'")
    .optional()
    .default("user"),
  sendWelcomeEmail: z.boolean().optional().default(false),
  emailVerified: z.boolean().optional().default(false)
});

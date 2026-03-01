import z from "zod";
import {
  setInvalidEnumErrorMessage,
  setInvalidVariableErrorMessage,
  setMissingVariableErrorMessage
} from "./utils.js";

export type EnvSchema = z.infer<typeof envSchema>;

export const envSchema = z.object({
  APP_NAME: z.string(setMissingVariableErrorMessage("APP_NAME")),
  APP_FACEBOOK_URL: z.url(setInvalidVariableErrorMessage("APP_FACEBOOK_URL")),
  APP_INSTAGRAM_URL: z.url(setInvalidVariableErrorMessage("QGUARD_INSTAGRAM_URL")),
  APP_X_URL: z.url(setInvalidVariableErrorMessage("APP_X_URL")),
  ALLOWED_ORIGINS: z.preprocess(
    (value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    },
    z
      .array(z.url(setInvalidVariableErrorMessage("ALLOWED_ORIGINS")))
      .min(1, "At least one value in ALLOWED_ORIGINS is required")
  ),
  BASE_URL: z.url(setInvalidVariableErrorMessage("BASE_URL")),
  CLIENT_NAME: z.string(setMissingVariableErrorMessage("CLIENT_NAME")),
  CLIENT_URL: z.url(setInvalidVariableErrorMessage("CLIENT_URL")),
  CLOUDINARY_URL: z.string(setMissingVariableErrorMessage("CLOUDINARY_URL")),
  DATABASE_URL: z.string(setMissingVariableErrorMessage("DATABASE_URL")),
  EMAIL_HOST: z.string(setMissingVariableErrorMessage("EMAIL_HOST")),
  EMAIL_PASSWORD: z.string(setMissingVariableErrorMessage("EMAIL_PASSWORD")),
  EMAIL_PORT: z.coerce.number(setMissingVariableErrorMessage("EMAIL_PORT")),
  EMAIL_SECURE: z
    .string(setMissingVariableErrorMessage("EMAIL_SECURE"))
    .refine(
      (value) => value === "true" || value === "false",
      setInvalidEnumErrorMessage("EMAIL_SECURE", ["true", "false"])
    )
    .transform((value) => value === "true"),
  EMAIL_USER: z.string(setMissingVariableErrorMessage("EMAIL_USER")),
  EXPRESS_JSON_LIMIT: z.string(setMissingVariableErrorMessage("EXPRESS_JSON_LIMIT")),
  JWT_SECRET: z.string(setMissingVariableErrorMessage("JWT_SECRET_ACCESS_TOKEN")),
  META_ID: z.string(setMissingVariableErrorMessage("META_ID")),
  NODE_ENV: z
    .enum(
      ["development", "production", "test"],
      setInvalidEnumErrorMessage("NODE_ENV", ["development", "production", "test"])
    )
    .default("development"),
  PORT: z.coerce.number(setInvalidVariableErrorMessage("PORT")).default(4400),
  REDIS_CLIENT_URL: z.string().default("redis://localhost:6379")
});

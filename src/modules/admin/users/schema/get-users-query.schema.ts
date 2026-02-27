import { baseQuerySchema } from "#modules/shared/schemas/base-query.schema.js";
import z from "zod";

export const getUsersQuerySchema = baseQuerySchema().extend({
  status: z.enum(["all", "active", "inactive", "banned"]).optional().nullable().default("all"),
  role: z.enum(["user", "admin"]).optional().nullable().default("user"),
  last: z.coerce
    .number("Summary period is required")
    .int("Summary period must be an integer")
    .min(1, "Summary period must be at least 1 day")
    .max(100, "Summary period cannot be more than 100 days")
    .optional()
    .default(30)
});

import { QUERY_LIMIT } from "#utils/constants.js";
import { Text } from "#utils/text/index.js";
import z from "zod";

export const cursorSchema = z.object({
  id: z
    .string("Invalid cursor parameter")
    .refine((val) => Text.isULID(val), "Invalid cursor parameter"),
  // createdAt: z.string("Invalid cursor parameter"),
  direction: z.enum(["before", "after"], "Invalid cursor parameter").optional().default("after")
});

export const cursorQuerySchema = z
  .string("Invalid cursor parameter")
  .refine((val) => {
    try {
      const parsed = JSON.parse(Text.decodeBase64(val));
      const { success } = cursorSchema.safeParse(parsed);
      return success;
    } catch {
      return false;
    }
  }, "Invalid cursor parameter")
  .transform((val) => {
    return cursorSchema.parse(JSON.parse(Text.decodeBase64(val)));
  })
  .optional()
  .nullable();

export const orderBySchema = z.enum(["asc", "desc"], "Invalid order by query parameter").optional();

export const orderByFieldSchema = <T extends string>(fields: [T, ...T[]]) =>
  z.enum(fields).optional();

export const orderByFieldValueSchema = z.string().optional();

export type BaseQuerySchemaOptions = {
  queryLimit?: number;
};

export const baseQuerySchema = (options: BaseQuerySchemaOptions = {}) => {
  const { queryLimit = QUERY_LIMIT } = options;

  return z.object({
    search: z.string().optional(),
    limit: z.coerce
      .number("Invalid limit query parameter")
      .int("Limit query paramater must be an integer")
      .min(1, "Limit query parameter must be greater than 0")
      .max(queryLimit, `Limit query parameter must be less than or equal to ${queryLimit}`)
      .optional()
      .default(queryLimit),
    page: z.coerce
      .number("Invalid page query parameter")
      .int("Page query paramater must be an integer")
      .min(1, "Page query parameter must be greater than 0")
      .optional()
      .default(1),
    cursor: cursorQuerySchema,
    createdAtFrom: z.coerce.date().optional(),
    createdAtTo: z.coerce.date().optional()
  });
};

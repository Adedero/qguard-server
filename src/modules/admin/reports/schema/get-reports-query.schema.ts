import { baseQuerySchema } from "#modules/shared/schemas/base-query.schema.js";
import z from "zod";

export const getReportsQuerySchema = baseQuerySchema()
  .extend({
    pendingApproval: z
      .string()
      .transform((val) => val === "true")
      .optional(),
    incidentDateFrom: z.coerce
      .date()
      .optional()
      .transform((val) => val?.toISOString().slice(0, 10)),
    incidentDateTo: z.coerce
      .date()
      .optional()
      .transform((val) => val?.toISOString().slice(0, 10))
  })
  .refine(
    (data) => {
      if (data.incidentDateTo && !data.incidentDateFrom) {
        return false;
      }
      return true;
    },
    {
      message: "incidentDateFrom is required when incidentDateTo is provided",
      path: ["incidentDateFrom"]
    }
  )
  .refine(
    (data) => {
      if (data.incidentDateFrom && data.incidentDateTo) {
        return data.incidentDateFrom <= data.incidentDateTo;
      }
      return true;
    },
    {
      message: "incidentDateFrom cannot be later than incidentDateTo",
      path: ["incidentDateFrom"]
    }
  );

import z from "zod";

export const locationSearchQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90).optional().nullable(),
  lng: z.coerce.number().min(-180).max(180).optional().nullable(),
  search: z.string().optional(),
  criteria: z.enum(["search", "coords", "both"], "Invalid search criteria")
});

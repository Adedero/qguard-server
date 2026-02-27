import { MAX_EVIDENCE_FILES, MAX_STR_LEN, MAX_STR_LEN_EXT } from "#utils/constants.js";
import z from "zod";

export const kitoMemberContactSchema = z
  .object({
    id: z.string("Invalid contact ID").nonempty("Invalid contact ID"),
    type: z.string("Invalid contact type").nonempty("Invalid contact type"),
    value: z.string("Invalid contact value").nonempty("Invalid contact value")
  })
  .refine(
    (obj) => {
      if (obj.type.toLowerCase() === "phone") {
        return /^\+?[1-9]\d{1,14}$/.test(obj.value);
      } else {
        return true;
      }
    },
    { error: "Invalid phone number", path: ["value"] }
  );

export const kitoMemberSchema = z.object({
  id: z.string("Invalid member ID").nonempty("Invalid member ID"),
  fullName: z
    .string("Full name is required")
    .min(2, "Full name is too short")
    .max(MAX_STR_LEN, "Full name is too long"),
  aliases: z.array(z.string("Invalid alias").max(MAX_STR_LEN, "Alias is too long")).default([]),
  contacts: z.array(kitoMemberContactSchema).default([]),
  readonly: z.boolean().default(false)
});

export type ReportInputSchema = z.infer<typeof reportInputSchema>;

export const reportInputSchema = z.object({
  locationId: z.string("Invalid location ID").nonempty("Invalid location ID").optional(),
  incidentDate: z
    .string("Incident date is required")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Invalid incident date")
    .refine((val) => {
      const date = new Date(val);
      return date <= new Date();
    }, "Incident date cannot be in the future")
    .transform((val) => new Date(val).toISOString().slice(0, 10)),
  name: z.string("Location name is required").nonempty("Location name is required"),
  locationName: z
    .string("Search for the location or choose in on the map")
    .nonempty("Search for the location or choose in on the map"),
  displayName: z
    .string("Search for the location or choose in on the map")
    .nonempty("Search for the location or choose in on the map"),
  country: z
    .string("Search for the location or choose in on the map")
    .nonempty("Search for the location or choose in on the map"),
  region: z
    .string("Search for the location or choose in on the map")
    .nonempty("Search for the location or choose in on the map"),
  subregion: z
    .string("Search for the location or choose in on the map")
    .nonempty("Search for the location or choose in on the map"),
  latitude: z
    .number()
    .min(-90, "Search for the location or choose in on the map")
    .max(90, "Search for the location or choose in on the map"),
  longitude: z
    .number()
    .min(-180, "Search for the location or choose in on the map")
    .max(180, "Search for the location or choose in on the map"),
  locationInfo: z
    .string("Invalid extra location info")
    .max(MAX_STR_LEN_EXT, "Extra location info is too long"),
  kitoMembers: z.array(kitoMemberSchema).default([]),
  description: z.string("Description is required").nonempty("Description is required"),
  evidences: z
    .array(
      z.object(
        {
          fileId: z.string("File ID is required").nonempty("File ID is required"),
          fileName: z.string("File name is required").nonempty("File name is required"),
          fileURL: z.string("File URL is required").nonempty("File URL is required"),
          fileSize: z.number("File size is required").min(0, "File size must be greater than 0"),
          fileType: z.string("File type is required").nonempty("File type is required")
        },
        "One or more evidence is invalid"
      )
    )
    .max(MAX_EVIDENCE_FILES, `Maximum ${MAX_EVIDENCE_FILES} evidences allowed`)
    .default([])
});

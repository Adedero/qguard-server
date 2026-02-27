import z from "zod";

export type LocationCreateSchema = z.infer<typeof locationCreateSchema>;

export const locationCreateSchema = z.object({
  name: z.string("Name is required").nonempty("Name is required"),
  locationName: z.string("Location name is required").nonempty("Location name is required"),
  displayName: z.string("Display name is required").nonempty("Display name is required"),
  subregion: z.string("Subregion is required").nonempty("Subregion is required"),
  region: z.string("Region is required").nonempty("Region is required"),
  country: z.string("Country is required").nonempty("Country is required"),
  latitude: z
    .number("Select the location on the map")
    .min(-90, "Select the location on the map")
    .max(90, "Select the location on the map"),
  longitude: z
    .number("Select the location on the map")
    .min(-180, "Select the location on the map")
    .max(180, "Select the location on the map")
});

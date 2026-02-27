import { MAX_STR_LEN } from "#utils/constants.js";
import z from "zod";

export const kitoMemberContactSchema = z
  .object({
    id: z.string("Invalid contact ID").nonempty("Invalid contact ID"),
    type: z.string("Invalid contact type").nonempty("Invalid contact type"),
    value: z.string("Invalid contact value").nonempty("Invalid contact value"),
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

export const kitoMemberInput = z.object({
  fullName: z
    .string("Full name is required")
    .min(1, "Full name is too short")
    .max(MAX_STR_LEN, "Full name is too long"),
  aliases: z.array(z.string("Invalid alias")).default([]),
  contacts: z.array(kitoMemberContactSchema).default([])
});

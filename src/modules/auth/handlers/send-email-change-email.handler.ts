import db from "#database/index.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import z from "zod";
import { EmailVerificationService } from "../services/email-verification/index.js";

export const sendEmailChangeEmail = defineRequestHandler({
  validator: {
    body: z.object({
      oldEmail: z.email("Old email is invalid"),
      newEmail: z.email("New email is invalid")
    })
  },
  async handler(ctx) {
    const { oldEmail, newEmail } = ctx.validated.body;

    const user = await EmailVerificationService.getUserByEmail(oldEmail, { throwOnError: true });
  }
});

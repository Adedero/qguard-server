import { defineRequestHandler } from "#utils/request-handler.js";
import { signUpSchema } from "../schemas/sign-up.schema.js";
import type { VerificationModel } from "#database/models/verification.model.js";
import { EmailVerificationService } from "../services/email-verification/index.js";
import z from "zod";

export const sendVerificationEmail = defineRequestHandler({
  validator: {
    body: signUpSchema.pick({ email: true }).extend({
      callbackURL: z.url("Callback URL is invalid")
    })
  },
  async handler(ctx) {
    const { email, callbackURL } = ctx.validated.body;
    const verificationType: VerificationModel["type"] = "email_verification";

    const user = await EmailVerificationService.getUserByEmail(email, { throwOnError: true });

    const token = await EmailVerificationService.getToken(user.email, verificationType, { throwOnError: true });

    const verificationURL = new URL(callbackURL);
    verificationURL.searchParams.set("token", token.raw);
    verificationURL.searchParams.set("email", user.email);

    await EmailVerificationService.sendMail({
      url: verificationURL.href,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email
    });

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Verification email sent successfully",
      data: { user: { email: user.email } }
    });
  }
});

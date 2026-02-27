import type { VerificationModel } from "#database/schema.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import z from "zod";
import { signUpSchema } from "../schemas/sign-up.schema.js";
import { EmailVerificationService } from "../services/email-verification/index.js";
import { PASSWORD_RESET_TOKEN_EXPIRES_IN_HOURS } from "#utils/constants.js";
import { PasswordResetService } from "../services/password-reset/index.js";

export const sendPasswordResetEmail = defineRequestHandler({
  validator: {
    body: signUpSchema.pick({ email: true }).extend({
      redirectURL: z.url("Invalid redirect URL")
    })
  },
  async handler(ctx) {
    const { email, redirectURL } = ctx.validated.body;
    const verificationType: VerificationModel["type"] = "password_reset";

    const genericResponse = () => {
      ctx.res.status(200).json({
        success: true,
        status: 200,
        message: "If an account with that email exists, a password reset link has been sent.",
        data: {}
      });
    };

    const user = await EmailVerificationService.getUserByEmail(email);
    if (!user || user.banned) {
      genericResponse();
      return;
    }

    const token = await EmailVerificationService.getToken(user.email, verificationType, {
      tokenExpiryInHours: PASSWORD_RESET_TOKEN_EXPIRES_IN_HOURS
    });

    const verificationURL = new URL(redirectURL);
    if (token) {
      verificationURL.searchParams.set("token", token.raw);
    } else {
      verificationURL.searchParams.set("error", "INVALID_TOKEN");
    }

    PasswordResetService.sendResetEmail({
      url: verificationURL.href,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email
    });

    genericResponse();
  }
});

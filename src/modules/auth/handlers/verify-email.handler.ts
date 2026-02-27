import { VERIFICATION_TOKEN_LEN } from "#utils/constants.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import z from "zod";
import { EmailVerificationService } from "../services/email-verification/index.js";

export const verifyEmail = defineRequestHandler({
  validator: {
    query: z.object({
      token: z.string("Invalid token").length(VERIFICATION_TOKEN_LEN, "Invalid token")
    })
  },
  async handler(ctx) {
    const { token } = ctx.validated.query;

    const verification = await EmailVerificationService.getVerificationRecord(
      token,
      "email_verification"
    );
    const user = await EmailVerificationService.getUserFromVerificationRecord(verification);

    if (user.emailVerified) {
      await EmailVerificationService.deleteVerificationRecord(verification.id);
      ctx.res.status(200).json({
        success: true,
        message: "Email verified successfully",
        status: 200,
        data: { user: { email: user.email } }
      });
      return;
    }

    if (!EmailVerificationService.isTokenValid(verification, user.email)) {
      await EmailVerificationService.deleteVerificationRecord(verification.id);
      ctx.res.status(400).json({
        success: false,
        message: "Invalid token",
        status: 400,
        data: { user: { email: user.email } }
      });
      return;
    }

    await Promise.all([
      EmailVerificationService.markUserAsVerified(user.id),
      EmailVerificationService.deleteVerificationRecord(verification.id)
    ]);

    ctx.res.status(200).json({
      success: true,
      message: "Email verified successfully",
      status: 200,
      data: { user: { email: user.email } }
    });
  }
});

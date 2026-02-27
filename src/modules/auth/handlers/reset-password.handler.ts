import { defineRequestHandler } from "#utils/request-handler.js";
import z from "zod";
import { signUpSchema } from "../schemas/sign-up.schema.js";
import { VERIFICATION_TOKEN_LEN } from "#utils/constants.js";
import { EmailVerificationService } from "../services/email-verification/index.js";
import { HttpException } from "#errors/http-exception.js";
import { PasswordResetService } from "../services/password-reset/index.js";

export const resetPassword = defineRequestHandler({
  validator: {
    body: signUpSchema.pick({ password: true }).extend({
      token: z.string().length(VERIFICATION_TOKEN_LEN, "Invalid token")
    })
  },
  async handler(ctx) {
    const { password, token } = ctx.validated.body;

    const verification = await EmailVerificationService.getVerificationRecord(
      token,
      "password_reset"
    );
    const user = await EmailVerificationService.getUserFromVerificationRecord(verification);
    const isValid = EmailVerificationService.isTokenValid(verification, user.email);

    if (!isValid) {
      await EmailVerificationService.deleteVerificationRecord(verification.id);
      throw HttpException.BAD_REQUEST("Invalid token");
    }

    await Promise.all([
      PasswordResetService.resetPassword({ newPassword: password, userId: user.id }),
      PasswordResetService.revokeAllUserSessions(user.id),
      EmailVerificationService.deleteVerificationRecord(verification.id)
    ]);

    ctx.res.status(200).json({
      success: true,
      message: "Password reset successfully",
      status: 200,
      data: { user: { email: user.email } }
    });
  }
});

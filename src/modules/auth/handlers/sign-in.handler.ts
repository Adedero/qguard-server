import { HttpException } from "#errors/http-exception.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { compareAsc } from "date-fns";
import { signUpSchema } from "../schemas/sign-up.schema.js";
import { EmailVerificationService } from "../services/email-verification/index.js";
import { PasswordService } from "../services/password/index.js";
import { SessionService } from "../services/session/index.js";
import { SignInService } from "../services/sign-in/index.js";

export const signIn = defineRequestHandler({
  validator: {
    body: signUpSchema.pick({ email: true, password: true })
  },
  async handler(ctx) {
    const { email, password } = ctx.validated.body;
    const now = new Date();

    const user = await EmailVerificationService.getUserByEmail(email);

    if (!user) {
      throw HttpException.BAD_REQUEST("Invalid email or password");
    }
    if (!user.emailVerified) {
      throw HttpException.BAD_REQUEST("Email verification is required");
    }
    if (user.banned) {
      if (!user.banExpiresAt) {
        throw HttpException.BAD_REQUEST("User banned");
      }
      // if ban is not yet expired
      if (compareAsc(user.banExpiresAt, now) >= 0) {
        throw HttpException.BAD_REQUEST("User banned");
      }
      // remove ban
      await SignInService.unbanUser(user.id);
    }

    const account = await SignInService.getUserAccount(user.id);
    const isPasswordValid = await PasswordService.verify({
      hash: account.password || "",
      password
    });
    if (!isPasswordValid) {
      throw HttpException.BAD_REQUEST("Invalid email or password");
    }

    const { accessToken, refreshToken } = await SignInService.generateAuthTokens({
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      role: user.role,
      banned: user.banned ?? false
    });

    const session = await SessionService.createSession({
      userId: user.id,
      refreshToken,
      ipAddress: ctx.getClientIp(),
      userAgent: ctx.req.headers["user-agent"]
    });

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Sign in successful",
      data: {
        user: {
          ...user,
          accessToken,
          refreshToken
        },
        session
      }
    });
  }
});

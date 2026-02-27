import db from "#database/index.js";
import { HttpException } from "#errors/http-exception.js";
import logger from "#lib/logger/index.js";
import { pick } from "#utils/pick.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { PasswordService } from "../../../services/password/index.js";
import { SignUpService } from "../../../services/sign-up/index.js";
import { Meta } from "#database/utils/meta.js";
import { signUpSchema } from "#modules/auth/schemas/sign-up.schema.js";

export type CreateSignUpHandlerOptions = {
  extended?: boolean; // If true, allows additional fields like role and sendWelcomeEmail in the request body
};

export const createSignUpHandler = (options?: CreateSignUpHandlerOptions) => {
  const { extended = false } = options || {};

  return defineRequestHandler({
    validator: {
      body: signUpSchema
    },
    async handler(ctx) {
      const { sendWelcomeEmail, emailVerified, role, ...rest } = ctx.validated.body;

      if (await SignUpService.userAlreadyExists(rest.email)) {
        throw HttpException.BAD_REQUEST(
          "Account already exists. Use another email or sign in instead."
        );
      }

      const password = await PasswordService.hash(rest.password);

      const userData = {
        ...rest,
        ...(extended ? { role, emailVerified } : ({ role: "user", emailVerified: false } as const))
      };

      const result = await db.transaction(async (tx) => {
        const user = await SignUpService.createUser(userData);
        await SignUpService.createAccount({ userId: user.id, password });
        await Meta.update({
          db: tx,
          increment: { usersCount: 1 }
        });
        return user;
      });

      const minUser = pick(result, ["id", "firstName", "lastName", "email"]);

      if (!extended || (extended && sendWelcomeEmail)) {
        SignUpService.sendWelcomeEmail({
          id: minUser.id,
          email: minUser.email,
          name: `${minUser.firstName} ${minUser.lastName}`
        });
      }

      logger.info(`New user created`, minUser);

      ctx.res.status(201).json({
        success: true,
        status: 201,
        message: "User created",
        data: { user: result }
      });
    }
  });
};

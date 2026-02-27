import db from "#database/index.js";
import { HttpException } from "#errors/http-exception.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import z from "zod";

export const getUserById = defineRequestHandler({
  validator: {
    params: z.object({
      userId: z.string("Invalid user ID").nonempty("Invalid user ID")
    })
  },
  async handler(ctx) {
    const { userId } = ctx.validated.params;

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId)
    });

    if (!user) {
      throw HttpException.NOT_FOUND("User not found");
    }

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "User retrieved",
      data: { user }
    });
  }
});

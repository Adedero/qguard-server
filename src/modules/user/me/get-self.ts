import db from "#database/index.js";
import { HttpException } from "#errors/http-exception.js";
import { defineRequestHandler } from "#utils/request-handler.js";

export const getSelf = defineRequestHandler({
  async handler(ctx) {
    const { id } = ctx.getAuthenticatedUser();

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id)
    });

    if (!user) {
      throw HttpException.NOT_FOUND("User not found");
    }

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Profile retrieved",
      data: { user }
    });
  }
});

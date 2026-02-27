import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { HttpException } from "#errors/http-exception.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { eq } from "drizzle-orm";
import z from "zod";

export const unbanUser = defineRequestHandler({
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

    if (!user?.banned) {
      ctx.res.status(200).json({
        success: true,
        status: 200,
        message: "User unbanned",
        data: { user }
      });
      return;
    }

    const [updatedUser] = await db
      .update(Table.users)
      .set({ banned: false, bannedReason: null, bannedAt: null, banExpiresAt: null })
      .where(eq(Table.users.id, userId))
      .returning();

    if (!updatedUser) {
      throw HttpException.NOT_FOUND("User not found");
    }

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "User unbanned",
      data: { updatedUser }
    });
  }
});

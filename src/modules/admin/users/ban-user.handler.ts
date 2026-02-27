import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { users } from "#database/schema.js";
import { HttpException } from "#errors/http-exception.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { compareAsc } from "date-fns";
import { eq } from "drizzle-orm";
import z from "zod";

export const banUser = defineRequestHandler({
  validator: {
    params: z.object({
      userId: z.string("Invalid user ID").nonempty("Invalid user ID")
    }),
    body: z.object({
      bannedReason: z.string("Enter a reason for the ban").nonempty("Enter a reason for the ban"),
      banExpiresAt: z.coerce
        .date()
        .refine((val) => compareAsc(val, new Date()) === 1, "Ban expiry cannot be in the past")
        .optional()
        .nullable()
    })
  },
  async handler(ctx) {
    const { userId } = ctx.validated.params;
    const { bannedReason, banExpiresAt } = ctx.validated.body;

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId)
    });

    if (user?.banned) {
      ctx.res.status(200).json({
        success: true,
        status: 200,
        message: "User banned",
        data: { user }
      });
      return;
    }

    const [updatedUser] = await db
      .update(Table.users)
      .set({ banned: true, bannedReason, banExpiresAt, bannedAt: new Date() })
      .where(eq(Table.users.id, userId))
      .returning();

    if (!updatedUser) {
      throw HttpException.NOT_FOUND("User not found");
    }

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "User banned",
      data: { user: updatedUser }
    });
  }
});

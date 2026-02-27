import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { HttpException } from "#errors/http-exception.js";
import { signUpSchema } from "#modules/auth/schemas/sign-up.schema.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { eq } from "drizzle-orm";
import z from "zod";

export const createUpdateUserHandler = () => {
  return defineRequestHandler({
    validator: {
      body: signUpSchema.pick({
        firstName: true,
        lastName: true,
        image: true,
        country: true,
        region: true,
        subregion: true,
        phone: true,
        role: true
      }),

      params: z.object({
        userId: z.string("Invalid user ID").nonempty("Invalid user ID").optional()
      })
    },

    async handler(ctx) {
      const authUser = ctx.getAuthenticatedUser();
      const { role, ...data } = ctx.validated.body;
      const { userId = authUser.id } = ctx.validated.params;

      /* ---------- AUTHORIZATION ---------- */

      if (userId !== authUser.id && authUser.role !== "admin") {
        throw HttpException.UNAUTHORIZED("You are not authorized to make this request");
      }

      /* ---------- TRANSACTION ---------- */

      const [updatedUser] = await db
        .update(Table.users)
        .set({
          ...data,
          ...(authUser.role === "admin" && role ? { role } : {})
        })
        .where(eq(Table.users.id, userId))
        .returning();

      if (!updatedUser) {
        throw HttpException.NOT_FOUND("User not found");
      }

      ctx.res.status(200).json({
        success: true,
        status: 200,
        message: "User updated",
        data: { user: updatedUser }
      });
    }
  });
};

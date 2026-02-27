import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { HttpException } from "#errors/http-exception.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { and, eq, isNull } from "drizzle-orm";
import z from "zod";

export const signOutUser = defineRequestHandler({
  validator: {
    params: z.object({
      userId: z.string("Invalid user ID").nonempty("Invalid user ID")
    }),
    body: z.object({
      sessionId: z.string().optional()
    })
  },
  async handler(ctx) {
    const { userId } = ctx.validated.params;
    const { sessionId } = ctx.validated.body;

    const now = new Date();

    if (sessionId) {
      const session = await db.query.sessions.findFirst({
        where: and(eq(Table.sessions.id, sessionId), eq(Table.sessions.userId, userId))
      });

      if (!session) {
        throw HttpException.NOT_FOUND("Session not found");
      }

      await db
        .update(Table.sessions)
        .set({ revokedAt: now, updatedAt: now })
        .where(and(eq(Table.sessions.id, sessionId), eq(Table.sessions.userId, userId)));

      ctx.res.status(200).json({
        success: true,
        status: 200,
        message: "Session signed out successfully",
        data: {}
      });

      return;
    }

    await db
      .update(Table.sessions)
      .set({
        revokedAt: now,
        updatedAt: now
      })
      .where(and(eq(Table.sessions.userId, userId), isNull(Table.sessions.revokedAt)));

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "All sessions signed out successfully",
      data: {}
    });
  }
});

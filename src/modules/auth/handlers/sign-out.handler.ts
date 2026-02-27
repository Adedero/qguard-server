import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { HttpException } from "#errors/http-exception.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { and, eq, isNull } from "drizzle-orm";
import z from "zod";

export const signOut = defineRequestHandler({
  validator: {
    query: z.object({
      sessionId: z.string("Invalid session ID").nonempty("Invalid session ID").optional()
    })
  },
  async handler(ctx) {
    const user = ctx.getAuthenticatedUser();
    const { sessionId } = ctx.validated.query;

    const now = new Date();

    if (sessionId) {
      const session = await db.query.sessions.findFirst({
        where: eq(Table.sessions.id, sessionId)
      });

      if (!session) {
        throw HttpException.NOT_FOUND("Session not found");
      }

      await db
        .update(Table.sessions)
        .set({ revokedAt: now, updatedAt: now })
        .where(eq(Table.sessions.id, sessionId));

      ctx.res.status(200).json({
        success: true,
        status: 200,
        message: "Session signed out successfully",
        data: null
      });

      return;
    }

    await db
      .update(Table.sessions)
      .set({
        revokedAt: now,
        updatedAt: now
      })
      .where(and(eq(Table.sessions.userId, user.id), isNull(Table.sessions.revokedAt)));

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "All sessions signed out successfully",
      data: {}
    });
  }
});

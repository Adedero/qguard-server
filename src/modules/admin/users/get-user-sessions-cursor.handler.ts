import { baseQuerySchema } from "#modules/shared/schemas/base-query.schema.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import z from "zod";
import { and, or, eq, gte, lt, isNotNull, isNull, sql, type SQL } from "drizzle-orm";
import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { CursorPagination } from "#database/utils/pagination/cursor.js";

export const getUserSessionsCursor = defineRequestHandler({
  validator: {
    params: z.object({
      userId: z.string("Invalid user ID").nonempty("Invalid user ID")
    }),
    query: baseQuerySchema()
  },
  async handler(ctx) {
    const { userId } = ctx.validated.params;
    const { limit, cursor } = ctx.validated.query;

    const filters: (SQL | undefined)[] = [];

    filters.push(eq(Table.sessions.userId, userId));

    const cursorFilter = CursorPagination.getCursorFilter(cursor, Table.sessions.id);

    if (cursorFilter) {
      filters.push(cursorFilter);
    }

    const whereClause = filters.length ? and(...filters) : undefined;

    const orderBy = CursorPagination.getOrderBy(cursor, Table.sessions.id);

    const sessions = await db
      .select()
      .from(Table.sessions)
      .where(whereClause)
      .orderBy(...orderBy);

    const result = CursorPagination.processResults(sessions, limit, cursor);

    const payload = {
      sessions: result.data,
      cursor: result.cursors
    };

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "User sessions retrieved",
      data: payload
    });
  }
});

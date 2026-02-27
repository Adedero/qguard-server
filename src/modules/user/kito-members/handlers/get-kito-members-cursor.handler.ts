import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { CursorPagination } from "#database/utils/pagination/cursor.js";
import { baseQuerySchema } from "#modules/shared/schemas/base-query.schema.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { and, ilike, gt, lt, or, sql } from "drizzle-orm";

export const getKitoMembersCursor = defineRequestHandler({
  validator: {
    query: baseQuerySchema()
  },
  async handler(ctx) {
    const { search, limit, cursor } = ctx.validated.query;

    let dbQuery = db
      .select()
      .from(Table.kitoMembers)
      .limit(limit + 1)
      .$dynamic();

    const filters = [];

    if (search?.length) {
      filters.push(
        or(
          ilike(Table.kitoMembers.fullName, `%${search}%`),
          sql`array_to_string(${Table.kitoMembers.aliases}, ' ') ILIKE ${`%${search}%`}`
        )
      );
    }

    const cursorFilter = CursorPagination.getCursorFilter(cursor, Table.kitoMembers.id);

    if (cursorFilter) {
      filters.push(cursorFilter);
    }

    // Apply filters (FIXED: assignment needed)
    if (filters.length > 0) {
      dbQuery.where(and(...filters));
    }

    const orderBy = CursorPagination.getOrderBy(cursor, Table.kitoMembers.id);

    dbQuery.orderBy(...orderBy);

    const rows = await dbQuery;

    const result = CursorPagination.processResults(rows, limit, cursor);

    const { data: kitoMembers, cursors } = result;

    ctx.res.status(200).json({
      success: true,
      data: {
        kitoMembers,
        cursor: cursors
      }
    });
  }
});

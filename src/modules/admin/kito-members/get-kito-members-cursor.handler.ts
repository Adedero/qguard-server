import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { fullTextSearchFilter } from "#database/utils/filters/fts-filter.js";
import { CursorPagination } from "#database/utils/pagination/cursor.js";
import { baseQuerySchema } from "#modules/shared/schemas/base-query.schema.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { and, type SQL } from "drizzle-orm";

export const getKitoMembersCursor = defineRequestHandler({
  validator: {
    query: baseQuerySchema()
  },
  async handler(ctx) {
    const { search, limit, cursor } = ctx.validated.query;

    const dbQuery = db
      .select()
      .from(Table.kitoMembers)
      .limit(limit + 1)
      .$dynamic();

    const filters: SQL[] = [];

    if (search) {
      const searchFilter = fullTextSearchFilter(search, [Table.kitoMembers.fullName]);
      if (searchFilter?.where) {
        filters.push(searchFilter.where);
      }
    }

    const cursorFilter = CursorPagination.getCursorFilter(cursor, Table.kitoMembers.id);
    if (cursorFilter) {
      filters.push(cursorFilter);
    }

    if (filters.length > 0) {
      dbQuery.where(and(...filters));
    }

    const orderBy = CursorPagination.getOrderBy(cursor, Table.kitoMembers.id);
    dbQuery.orderBy(...orderBy);

    const rows = await dbQuery;

    const result = CursorPagination.processResults(rows, limit, cursor);

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Kito members retrieved",
      data: {
        kitoMembers: result.data,
        cursor: result.cursors
      }
    });
  }
});

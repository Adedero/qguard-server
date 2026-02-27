import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { fullTextSearchFilter } from "#database/utils/filters/fts-filter.js";
import { baseQuerySchema } from "#modules/shared/schemas/base-query.schema.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { and, isNull, type SQL } from "drizzle-orm";
import { CursorPagination } from "#database/utils/pagination/cursor.js";

export const getLocationsCursor = defineRequestHandler({
  validator: {
    query: baseQuerySchema()
  },
  async handler(ctx) {
    const { search, cursor, limit } = ctx.validated.query;

    const dbQuery = db
      .select()
      .from(Table.locations)
      .limit(limit + 1)
      .$dynamic();

    const filters: SQL[] = [];

    filters.push(isNull(Table.locations.deletedAt));

    if (search) {
      const searchFilter = fullTextSearchFilter(search, [
        Table.locations.name,
        Table.locations.displayName,
        Table.locations.locationName
      ]);

      if (searchFilter?.where) {
        filters.push(searchFilter.where);
      }
    }

    const cursorFilter = CursorPagination.getCursorFilter(cursor, Table.locations.id);

    if (cursorFilter) {
      filters.push(cursorFilter);
    }

    if (filters.length > 0) {
      dbQuery.where(and(...filters));
    }

    const orderBy = CursorPagination.getOrderBy(cursor, Table.locations.id);
    dbQuery.orderBy(...orderBy);

    const rows = await dbQuery;

    const result = CursorPagination.processResults(rows, limit, cursor);

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Locations retrieved",
      data: {
        locations: result.data,
        cursor: result.cursors
      }
    });
  }
});

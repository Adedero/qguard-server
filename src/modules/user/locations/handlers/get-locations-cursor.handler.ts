import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { baseQuerySchema } from "#modules/shared/schemas/base-query.schema.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { locationSearchQuerySchema } from "../schemas/location-search-query.schema.js";
import { and, type SQL, isNull } from "drizzle-orm";
import { LOCATION_SEARCH_RADIUS_IN_KM } from "#utils/constants.js";
import { radiusFilter } from "#database/utils/filters/radius-filter.js";
import { fullTextSearchFilter } from "#database/utils/filters/fts-filter.js";
import { CursorPagination } from "#database/utils/pagination/cursor.js";

export const getLocationsCursor = defineRequestHandler({
  validator: {
    query: baseQuerySchema().extend(locationSearchQuerySchema.shape)
  },
  async handler(ctx) {
    const { lat, lng, search, limit, cursor, criteria } = ctx.validated.query;

    const dbQuery = db
      .select()
      .from(Table.locations)
      .limit(limit + 1)
      .$dynamic();

    const filters: (SQL | undefined)[] = [];

    filters.push(isNull(Table.locations.deletedAt));

    if (criteria === "coords" && typeof lat === "number" && typeof lng === "number") {
      filters.push(
        radiusFilter({
          lat,
          lng,
          radiusKm: LOCATION_SEARCH_RADIUS_IN_KM,
          latColumn: Table.locations.latitude,
          lngColumn: Table.locations.longitude
        })
      );
    }

    if (criteria === "search" && typeof search === "string" && search.length > 0) {
      const fts = fullTextSearchFilter(search, [
        Table.locations.name,
        Table.locations.locationName,
        Table.locations.displayName
      ]);
      filters.push(fts?.where);
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

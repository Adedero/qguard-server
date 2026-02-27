import db from "#database/index.js";
import { Meta } from "#database/utils/meta.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { and, or, eq, gte, lt, isNotNull, isNull, type SQL } from "drizzle-orm";
import { fullTextSearchFilter } from "#database/utils/filters/fts-filter.js";
import { Table } from "#database/models/index.js";
import { CursorPagination } from "#database/utils/pagination/cursor.js";
import { getUsersQuerySchema } from "./schema/get-users-query.schema.js";

export const getUsersCursor = defineRequestHandler({
  validator: {
    query: getUsersQuerySchema
  },

  async handler(ctx) {
    const { search, limit, cursor, role, status, last } = ctx.validated.query;

    const now = new Date();
    const periodStart = new Date(now.getTime() - last * 24 * 60 * 60 * 1000);

    const filters: (SQL | undefined)[] = [];

    if (role) {
      filters.push(eq(Table.users.role, role));
    }

    /**
     * STATUS FILTER
     */

    if (status === "active") {
      filters.push(
        and(isNotNull(Table.users.lastActiveAt), gte(Table.users.lastActiveAt, periodStart))
      );
    }

    if (status === "inactive") {
      filters.push(or(isNull(Table.users.lastActiveAt), lt(Table.users.lastActiveAt, periodStart)));
    }

    if (status === "banned") {
      filters.push(eq(Table.users.banned, true));
    }

    /**
     * SEARCH FILTER
     */
    if (search) {
      const searchFilter = fullTextSearchFilter(search, [
        Table.users.firstName,
        Table.users.lastName,
        Table.users.email
      ]);

      if (searchFilter?.where) {
        filters.push(searchFilter.where);
      }
    }

    /**
     * CURSOR FILTER
     */
    const cursorFilter = CursorPagination.getCursorFilter(cursor, Table.users.id);

    if (cursorFilter) {
      filters.push(cursorFilter);
    }

    const whereClause = filters.length ? and(...filters) : undefined;

    const orderBy = CursorPagination.getOrderBy(cursor, Table.users.id);

    const [meta, users] = await Promise.all([
      Meta.get(db),

      db
        .select({
          id: Table.users.id,
          firstName: Table.users.firstName,
          lastName: Table.users.lastName,
          email: Table.users.email,
          emailVerified: Table.users.emailVerified,
          banned: Table.users.banned,
          createdAt: Table.users.createdAt,
          lastActiveAt: Table.users.lastActiveAt
        })
        .from(Table.users)
        .where(whereClause)
        .orderBy(...orderBy)
        .limit(limit + 1)
    ]);
    const result = CursorPagination.processResults(users, limit, cursor);

    const payload = {
      users: result.data,
      totalUsers: meta?.usersCount ?? 0,
      cursor: result.cursors
    };

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Users retrieved",
      data: payload
    });
  }
});

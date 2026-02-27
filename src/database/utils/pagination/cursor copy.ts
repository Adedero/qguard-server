import { and, or, eq, gt, gte, lt, lte, asc, desc, type SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { Text } from "#utils/text/index.js";

export interface CursorConfig {
  id: string;
  createdAt: Date | string;
  direction: "after" | "before";
}

export interface CursorPaginationParams<T> {
  limit: number;
  cursor?: CursorConfig | null;
  orderByColumn: PgColumn; // e.g., Table.reports.createdAt
  idColumn: PgColumn; // e.g., Table.reports.id
}

export interface CursorResult<T> {
  data: T[];
  cursors: {
    next: string | null;
    prev: string | null;
  };
}

export class CursorPagination {
  /**
   * Adds cursor-based WHERE conditions to existing filters
   */
  static getCursorFilter(
    cursor: CursorConfig | undefined | null,
    orderByColumn: PgColumn,
    idColumn: PgColumn
  ) {
    if (!cursor) return null;

    const isForward = cursor.direction === "after";
    const { id: cId, createdAt: cDate } = cursor;

    // Convert string to Date if needed for proper comparison
    const cursorDate = typeof cDate === "string" ? new Date(cDate) : cDate;

    if (isForward) {
      // Forward pagination (DESC order): createdAt < cursor OR (createdAt = cursor AND id <= cursor.id)
      return or(
        lt(orderByColumn, cursorDate),
        and(eq(orderByColumn, cursorDate), lte(idColumn, cId))
      );
    } else {
      // Backward pagination (ASC order): createdAt > cursor OR (createdAt = cursor AND id >= cursor.id)
      return or(
        gt(orderByColumn, cursorDate),
        and(eq(orderByColumn, cursorDate), gte(idColumn, cId))
      );
    }
  }

  /**
   * Gets the appropriate ORDER BY clauses based on cursor direction
   */
  static getOrderBy(
    cursor: CursorConfig | undefined | null,
    orderByColumn: PgColumn,
    idColumn: PgColumn
  ): SQL[] {
    const isForward = !cursor || cursor.direction === "after";

    return [
      isForward ? desc(orderByColumn) : asc(orderByColumn),
      isForward ? desc(idColumn) : asc(idColumn)
    ];
  }

  /**
   * Processes raw query results into paginated response with cursors
   */
  static processResults<T extends { id: string; createdAt: Date }>(
    rows: T[],
    limit: number,
    cursor?: CursorConfig | null
  ): CursorResult<T> {
    const isForward = !cursor || cursor.direction === "after";
    const hasMore = rows.length > limit;

    let nextPageCursor: T | null = null;
    let prevPageCursor: T | null = null;

    if (isForward) {
      // For forward pagination
      if (hasMore) {
        // Next cursor points to the first item of the next page
        nextPageCursor = rows[limit] ?? null;
      }
      if (cursor) {
        // Prev cursor points to the first item in the current page
        prevPageCursor = rows[0] ?? null;
      }
    } else {
      // For backward pagination
      if (hasMore) {
        // Prev cursor points to the first item of the previous page
        prevPageCursor = rows[limit] ?? null;
      }
      // Next cursor points to the first item in the current page
      nextPageCursor = rows[0] ?? null;
    }

    // Remove the extra row used for hasMore detection
    if (hasMore) rows.pop();

    // Reverse results if going backwards
    if (!isForward) rows.reverse();

    const cursors = {
      next: nextPageCursor
        ? Text.encodeBase64(
            JSON.stringify({
              id: nextPageCursor.id,
              createdAt: nextPageCursor.createdAt.toISOString(),
              direction: "after"
            })
          )
        : null,
      prev: prevPageCursor
        ? Text.encodeBase64(
            JSON.stringify({
              id: prevPageCursor.id,
              createdAt: prevPageCursor.createdAt.toISOString(),
              direction: "before"
            })
          )
        : null
    };

    return { data: rows, cursors };
  }
}

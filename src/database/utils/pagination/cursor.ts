import { and, or, eq, gt, lt, asc, desc, type SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { Text } from "#utils/text/index.js";

export interface CursorPaginationParams<T> {
  limit: number;
  cursor?: CursorConfig | null;
  orderByColumn: PgColumn; // e.g., Table.reports.createdAt
  idColumn: PgColumn; // e.g., Table.reports.id
}

export interface CursorConfig {
  id: string;
  direction: "after" | "before";
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
   * Adds cursor-based WHERE condition using ONLY the ID
   */
  static getCursorFilter(cursor: CursorConfig | undefined | null, idColumn: PgColumn): SQL | null {
    if (!cursor) return null;

    const isForward = cursor.direction === "after";
    // If we are sorting DESC (newest first), going "forward" means finding smaller IDs
    const op = isForward ? lt : gt;

    return op(idColumn, cursor.id);
  }

  /**
   * Gets the ORDER BY clause based on cursor direction
   */
  static getOrderBy(cursor: CursorConfig | undefined | null, idColumn: PgColumn): SQL[] {
    const isForward = !cursor || cursor.direction === "after";

    // Reverses order if fetching backwards to get the correct slice of data
    return [isForward ? desc(idColumn) : asc(idColumn)];
  }

  /**
   * Processes raw query results into paginated response with cursors
   */
  static processResults<T extends { id: string }>(
    rows: T[],
    limit: number,
    cursor?: CursorConfig | null
  ): CursorResult<T> {
    const isForward = !cursor || cursor.direction === "after";
    const hasMore = rows.length > limit;

    // 1. Strip the extra row FIRST
    if (hasMore) {
      rows.pop();
    }

    // 2. Reverse if going backwards
    if (!isForward) {
      rows.reverse();
    }

    // 3. Determine edge existence
    const hasNextPage = isForward ? hasMore : true;
    const hasPrevPage = isForward ? !!cursor : hasMore;

    // 4. Extract the edge items
    const nextCursorItem = hasNextPage ? rows.at(-1) : null;
    const prevCursorItem = hasPrevPage ? rows.at(0) : null;

    const cursors = {
      next: nextCursorItem
        ? Text.encodeBase64(
            JSON.stringify({
              id: nextCursorItem.id,
              direction: "after"
            })
          )
        : null,
      prev: prevCursorItem
        ? Text.encodeBase64(
            JSON.stringify({
              id: prevCursorItem.id,
              direction: "before"
            })
          )
        : null
    };

    return { data: rows, cursors };
  }
}

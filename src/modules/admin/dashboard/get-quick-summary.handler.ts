import db from "#database/index.js";
import { Meta } from "#database/utils/meta.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import z from "zod";
import { or, count, gte, and, isNull, lt, isNotNull } from "drizzle-orm";
import { Table } from "#database/models/index.js";

export const getQuickSummary = defineRequestHandler({
  validator: {
    query: z.object({
      last: z.coerce
        .number("Summary period is required")
        .int("Summary period must be an integer")
        .min(1, "Summary period must be at least 1 day")
        .max(100, "Summary period cannot be more than 100 days")
    })
  },
  async handler(ctx) {
    const { last } = ctx.validated.query;
    // last 7 days, last 30 days
    const now = new Date();
    const periodStart = new Date(now.getTime() - last * 24 * 60 * 60 * 1000);

    const [meta, [activeResult], [inactiveResult]] = await Promise.all([
      Meta.get(db),

      db
        .select({ count: count() })
        .from(Table.users)
        .where(
          and(isNotNull(Table.users.lastActiveAt), gte(Table.users.lastActiveAt, periodStart))
        ),

      db
        .select({ count: count() })
        .from(Table.users)
        .where(or(isNull(Table.users.lastActiveAt), lt(Table.users.lastActiveAt, periodStart)))
    ]);

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Quick summary retrieved",
      data: {
        totalUsers: meta?.usersCount ?? 0,
        totalReports: (meta?.approvedReportsCount ?? 0) + (meta?.pendingReportsCount ?? 0),
        activeUsers: activeResult?.count ?? 0,
        inactiveUsers: inactiveResult?.count ?? 0
      }
    });
  }
});

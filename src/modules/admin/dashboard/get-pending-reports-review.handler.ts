import { defineRequestHandler } from "#utils/request-handler.js";
import db from "#database/index.js";
import { Meta } from "#database/utils/meta.js";
import z from "zod";
import { gte, and, eq } from "drizzle-orm";
import { Table } from "#database/models/index.js";
import { baseQuerySchema } from "#modules/shared/schemas/base-query.schema.js";


export const getPendingReportsPreview = defineRequestHandler({
  validator: {
    query: baseQuerySchema()
      .pick({ limit: true })
      .extend({
        last: z.coerce
          .number("Summary period is required")
          .int("Summary period must be an integer")
          .min(1, "Summary period must be at least 1 day")
          .max(100, "Summary period cannot be more than 100 days")
      })
  },
  async handler(ctx) {
    const { last, limit } = ctx.validated.query;
    // last 7 days, last 30 days
    const now = new Date();
    const periodStart = new Date(now.getTime() - last * 24 * 60 * 60 * 1000);

    const [meta, pendingReports] = await Promise.all([
      Meta.get(db),

      db.query.reports.findMany({
        where: and(
          eq(Table.reports.pendingApproval, true),
          gte(Table.reports.createdAt, periodStart)
        ),
        limit,
        columns: {
          id: true,
          createdAt: true
        },
        with: {
          reporter: {
            columns: {
              email: true
            }
          }
        }
      })
    ]);

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Quick summary retrieved",
      data: {
        totalPendingReports: meta?.pendingReportsCount ?? 0,
        pendingReports: pendingReports.map((report) => ({
          id: report.id,
          reporter: report.reporter.email
        }))
      }
    });
  }
});

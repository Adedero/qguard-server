import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { Meta } from "#database/utils/meta.js";
import { HttpException } from "#errors/http-exception.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { eq, sql } from "drizzle-orm";
import z from "zod";

export const updateReportStatus = defineRequestHandler({
  validator: {
    params: z.object({
      reportId: z.string("Invalid report ID").nonempty("Invalid report ID")
    }),
    body: z.object({
      status: z.enum(["approved", "rejected"])
    })
  },
  async handler(ctx) {
    const { reportId } = ctx.validated.params;
    const { status } = ctx.validated.body;

    const result = await db.transaction(async (tx) => {
      // Get current state first
      const existing = await tx.query.reports.findFirst({
        where: eq(Table.reports.id, reportId)
      });

      if (!existing) {
        throw HttpException.NOT_FOUND("Report not found");
      }

      const wasApproved = existing.pendingApproval === false;
      const willBeApproved = status === "approved";

      // If nothing changed, just return
      if (wasApproved === willBeApproved) {
        return existing;
      }

      // Update report
      const [report] = await tx
        .update(Table.reports)
        .set({
          pendingApproval: !willBeApproved,
          approvedAt: willBeApproved ? new Date() : null
        })
        .where(eq(Table.reports.id, reportId))
        .returning();

      if (!report) {
        throw HttpException.INTERNAL("Failed to update report");
      }

      // Update location count
      await tx
        .update(Table.locations)
        .set({
          reportsCount: sql`
        ${Table.locations.reportsCount} + ${willBeApproved ? 1 : -1}
      `
        })
        .where(eq(Table.locations.id, report.locationId));

      // Update meta counts
      await Meta.update({
        db: tx,
        increment: willBeApproved
          ? { approvedReportsCount: 1, pendingReportsCount: -1 }
          : { approvedReportsCount: -1, pendingReportsCount: 1 }
      });

      return report;
    });

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: `Report ${status === "approved" ? "approved" : "rejected"}`,
      data: { report: result }
    });
  }
});

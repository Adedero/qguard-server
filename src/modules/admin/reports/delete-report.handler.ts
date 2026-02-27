import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { Meta } from "#database/utils/meta.js";
import { HttpException } from "#errors/http-exception.js";
import { deleteLocalAsset } from "#modules/assets/utils/delete-local-asset.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { eq, sql } from "drizzle-orm";
import z from "zod";

export const deleteReport = defineRequestHandler({
  validator: {
    params: z.object({
      reportId: z.string("Invalid report ID").nonempty("Invalid report ID")
    })
  },
  async handler(ctx) {
    const { reportId } = ctx.validated.params;

    const report = await db.query.reports.findFirst({
      where: (reports, { eq }) => eq(reports.id, reportId),
      columns: {
        id: true
      },
      with: {
        evidences: {
          columns: {
            fileId: true,
            id: true
          }
        }
      }
    });

    if (!report) {
      throw HttpException.NOT_FOUND("Report not found");
    }

    const result = await db.transaction(async (tx) => {
      const [deleted] = await tx
        .delete(Table.reports)
        .where(eq(Table.reports.id, reportId))
        .returning();

      if (deleted && deleted.pendingApproval === false) {
        await tx
          .update(Table.locations)
          .set({
            reportsCount: sql`GREATEST(${Table.locations.reportsCount} - 1, 0)`
          })
          .where(eq(Table.locations.id, deleted.locationId));
      }

      await Meta.update({
        db: tx,
        increment: {
          pendingReportsCount: deleted?.pendingApproval ? -1 : 0,
          approvedReportsCount: deleted && !deleted.pendingApproval ? -1 : 0
        }
      });

      if (report.evidences.length > 0) {
        const evidenceIds = report.evidences.map((e) => e.fileId);
        await deleteLocalAsset(evidenceIds, { db: tx });
      }

      return deleted;
    });

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Report deleted",
      data: { report: result }
    });
  }
});

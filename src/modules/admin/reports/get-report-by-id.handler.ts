import db from "#database/index.js";
import { HttpException } from "#errors/http-exception.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import z from "zod";

export const getReportById = defineRequestHandler({
  validator: {
    params: z.object({
      reportId: z.string("Invalid report ID").nonempty("Invalid report ID")
    })
  },
  async handler(ctx) {
    const { reportId } = ctx.validated.params;

    const report = await db.query.reports.findFirst({
      where: (reports, { and, isNull, eq }) =>
        and(eq(reports.id, reportId), isNull(reports.deletedAt)),
      with: {
        reporter: true,
        location: true,
        evidences: true,
        reportsToKitoMembers: {
          with: {
            kitoMember: true
          }
        }
      }
    });

    if (!report) {
      throw HttpException.NOT_FOUND("Report not found");
    }

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Report retrieved",
      data: {
        report: {
          ...report,
          reportsToKitoMembers: undefined,
          kitoMembers: report.reportsToKitoMembers.map((r) => r.kitoMember)
        }
      }
    });
  }
});

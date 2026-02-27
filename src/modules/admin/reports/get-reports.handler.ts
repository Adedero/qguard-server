import db from "#database/index.js";
import { Meta } from "#database/utils/meta.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { and, eq, gte, isNull, lte, type SQL } from "drizzle-orm";
import { getReportsQuerySchema } from "./schema/get-reports-query.schema.js";
import { fullTextSearchFilter } from "#database/utils/filters/fts-filter.js";
import { Table } from "#database/models/index.js";

export const getReports = defineRequestHandler({
  validator: {
    query: getReportsQuerySchema
  },
  async handler(ctx) {
    const {
      search,
      limit,
      page,
      pendingApproval,
      incidentDateFrom,
      incidentDateTo,
      createdAtFrom,
      createdAtTo
    } = ctx.validated.query;

    const filters: SQL[] = [];

    filters.push(isNull(Table.reports.deletedAt))

    if (incidentDateFrom) {
      filters.push(gte(Table.reports.incidentDate, incidentDateFrom));
      const toDate = incidentDateTo || new Date().toISOString();
      filters.push(lte(Table.reports.incidentDate, toDate));
    }

    if (createdAtFrom) filters.push(gte(Table.reports.createdAt, createdAtFrom));
    if (createdAtTo) filters.push(lte(Table.reports.createdAt, createdAtTo));

    if (typeof pendingApproval === "boolean") {
      filters.push(eq(Table.reports.pendingApproval, pendingApproval));
    }

    if (search) {
      const searchFilter = fullTextSearchFilter(search, [
        Table.locations.locationName,
        Table.users.firstName,
        Table.users.lastName,
        Table.users.email
      ]);
      if (searchFilter?.where) filters.push(searchFilter.where);
    }

    const whereClause = filters.length ? and(...filters) : undefined;

    const [meta, reports] = await Promise.all([
      Meta.get(db),

      db
        .select({
          id: Table.reports.id,
          incidentDate: Table.reports.incidentDate,
          pendingApproval: Table.reports.pendingApproval,
          createdAt: Table.reports.createdAt,

          location: {
            id: Table.locations.id,
            locationName: Table.locations.locationName
          },

          reporter: {
            id: Table.users.id,
            firstName: Table.users.firstName,
            lastName: Table.users.lastName,
            email: Table.users.email
          }
        })
        .from(Table.reports)
        .leftJoin(Table.locations, eq(Table.locations.id, Table.reports.locationId))
        .leftJoin(Table.users, eq(Table.users.id, Table.reports.reporterId))
        .where(whereClause)
        .limit(limit + 1)
        .offset(limit * page)
    ]);

    const hasNextPage = reports.length > limit;
    const payload = {
      reports: reports.slice(0, limit),
      totalPendingReports: meta?.pendingReportsCount ?? 0,
      totalApprovedReports: meta?.approvedReportsCount ?? 0,
      pagination: {
        limit,
        page,
        hasNextPage,
        hasPrevPage: page > 1
      }
    };

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Reports retrieved",
      data: payload
    });
  }
});

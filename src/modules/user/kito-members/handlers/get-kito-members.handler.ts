import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import {
  baseQuerySchema,
  orderByFieldSchema,
  orderBySchema
} from "#modules/shared/schemas/base-query.schema.js";
import { buildOrderBy } from "#modules/shared/utils/build-order-by.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { ilike } from "drizzle-orm";

export const getKitoMembers = defineRequestHandler({
  validator: {
    query: baseQuerySchema().extend({
      orderBy: orderBySchema,
      orderByField: orderByFieldSchema(["fullName"])
    })
  },
  async handler(ctx) {
    const { limit, page, search, orderBy, orderByField } = ctx.validated.query;

    let dbQuery = db
      .select()
      .from(Table.kitoMembers)
      .limit(limit + 1)
      .offset((page - 1) * limit)
      .$dynamic();

    if (search && search.length > 0) {
      dbQuery.where(ilike(Table.kitoMembers.fullName, `%${search}%`));
    }

    if (orderBy && orderByField) {
      dbQuery.orderBy(buildOrderBy(Table.kitoMembers, orderByField, orderBy));
    }

    const [kitoMembers, meta] = await Promise.all([dbQuery, db.query.meta.findFirst()]);

    const data = {
      kitoMembers: kitoMembers.slice(0, limit),
      meta: {
        totalCount: meta?.kitoMembersCount ?? 0,
        pagination: {
          page,
          hasNextPage: kitoMembers.length > limit,
          hasPreviousPage: page > 1,
          totalPages: Math.ceil((meta?.kitoMembersCount ?? 0) / limit)
        }
      }
    };

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Kito members fetched successfully",
      data
    });
  }
});

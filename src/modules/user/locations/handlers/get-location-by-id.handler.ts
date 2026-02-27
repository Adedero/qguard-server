import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { HttpException } from "#errors/http-exception.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { and, eq, isNull } from "drizzle-orm";
import z from "zod";

export const getLocationById = defineRequestHandler({
  validator: {
    params: z.object({
      locationId: z.string("Invalid location ID").nonempty("Invalid location ID")
    })
  },
  async handler(ctx) {
    const { locationId } = ctx.validated.params;

    const location = await db.query.locations.findFirst({
      where: and(eq(Table.locations.id, locationId), isNull(Table.locations.deletedAt))
    });

    if (!location) {
      throw HttpException.NOT_FOUND("Location not found");
    }

    ctx.res.status(200).json({
      success: true,
      message: "Location retrieved",
      data: {
        location
      }
    });
  }
});

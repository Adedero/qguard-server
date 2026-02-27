import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { Meta } from "#database/utils/meta.js";
import { HttpException } from "#errors/http-exception.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { locationCreateSchema } from "./schemas/location-create.schema.js";

export const createLocation = defineRequestHandler({
  validator: {
    body: locationCreateSchema
  },
  async handler(ctx) {
    const data = ctx.validated.body;

    const created = await db.transaction(async (tx) => {
      const [location] = await tx.insert(Table.locations).values(data).returning();
      await Meta.update({
        db: tx,
        increment: {
          locationsCount: 1
        }
      });
      return location;
    });

    if (!created) {
      throw HttpException.INTERNAL("Failed to create location");
    }

    ctx.res.status(201).json({
      success: true,
      status: 201,
      message: "Location created",
      data: { location: created }
    });
  }
});

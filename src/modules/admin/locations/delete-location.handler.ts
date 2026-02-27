import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { HttpException } from "#errors/http-exception.js";
import { PasswordService } from "#modules/auth/services/password/index.js";
import appQueue from "#tasks/queue.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { eq } from "drizzle-orm";
import z from "zod";
import { Meta } from "#database/utils/meta.js";

export const deleteLocation = defineRequestHandler({
  validator: {
    params: z.object({
      locationId: z.string("Invalid location ID").nonempty("Invalid location ID"),
    }),
    query: z.object({
      password: z.string("Invalid password").nonempty("Invalid password")
    })
  },
  async handler(ctx) {
    const user = ctx.getAuthenticatedUser();
    const { locationId } = ctx.validated.params;
    const { password } = ctx.validated.query;

    const isPasswordValid = await PasswordService.confirmUserPassword(user.id, password);
    if (!isPasswordValid) {
      throw HttpException.BAD_REQUEST("Invalid password");
    }

    const isDone = await db.transaction(async (tx) => {
      await tx
        .update(Table.locations)
        .set({ deletedAt: new Date() })
        .where(eq(Table.locations.id, locationId));

      await tx
        .update(Table.reports)
        .set({ deletedAt: new Date() })
        .where(eq(Table.reports.locationId, locationId));

      await Meta.update({
        db: tx,
        increment: {
          locationsCount: -1
        }
      });

      return true;
    });

    if (!isDone) {
      throw HttpException.INTERNAL("Failed to delete location");
    }

    appQueue.addJob("location_delete", { locationId });

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Location and related reports deleted",
      data: {}
    });
  }
});

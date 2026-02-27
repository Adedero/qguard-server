import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { Meta } from "#database/utils/meta.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { inArray } from "drizzle-orm";
import z from "zod";

export const deleteMultipleKitoMembers = defineRequestHandler({
  validator: {
    body: z.object({
      ids: z
        .array(z.string("Invalid kito member ID").nonempty("Invalid kito member ID"))
        .max(100, "Cannot delete more than 100 kito members at a time")
    })
  },
  async handler(ctx) {
    const { ids } = ctx.validated.body;

    await db.transaction(async (tx) => {
      await tx.delete(Table.kitoMembers).where(inArray(Table.kitoMembers.id, ids));
      await Meta.update({
        db: tx,
        increment: {
          kitoMembersCount: -ids.length
        }
      });
    });

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Kito members deleted successfully",
      data: { ids }
    });
  }
});

import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { Meta } from "#database/utils/meta.js";
import { HttpException } from "#errors/http-exception.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import z from "zod";
import { eq } from "drizzle-orm";

export const deleteKitoMember = defineRequestHandler({
  validator: {
    params: z.object({
      kitoMemberId: z.string("Invalid kito member ID").nonempty("Invalid kito member ID")
    })
  },
  async handler(ctx) {
    const { kitoMemberId } = ctx.validated.params;

    const kitoMember = await db.transaction(async (tx) => {
      const [deleted] = await tx
        .delete(Table.kitoMembers)
        .where(eq(Table.kitoMembers.id, kitoMemberId))
        .returning();

      if (deleted) {
        await Meta.update({
          db: tx,
          increment: {
            kitoMembersCount: -1
          }
        });
      }

      return deleted;
    });

    if (!kitoMember) {
      throw HttpException.INTERNAL("Failed to delete Kito member");
    }

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Kito member deleted successfully",
      data: { kitoMember }
    });
  }
});

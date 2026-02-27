import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { Meta } from "#database/utils/meta.js";
import { HttpException } from "#errors/http-exception.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { kitoMemberInput } from "./schemas/kito-members.schema.js";

export const createKitoMember = defineRequestHandler({
  validator: {
    body: kitoMemberInput
  },
  async handler(ctx) {
    const data = ctx.validated.body;

    const kitoMember = await db.transaction(async (tx) => {
      const [created] = await tx.insert(Table.kitoMembers).values(data).returning();

      if (created) {
        await Meta.update({
          db: tx,
          increment: {
            kitoMembersCount: 1
          }
        });
      }

      return created;
    });

    if (!kitoMember) {
      throw HttpException.INTERNAL("Failed to create Kito member");
    }

    ctx.res.status(201).json({
      success: true,
      status: 201,
      message: "Kito member created",
      data: { kitoMember }
    });
  }
});

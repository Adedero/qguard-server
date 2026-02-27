import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { HttpException } from "#errors/http-exception.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import z from "zod";
import { kitoMemberInput } from "./schemas/kito-members.schema.js";
import { eq } from "drizzle-orm";

export const updateKitoMember = defineRequestHandler({
  validator: {
    body: kitoMemberInput,
    params: z.object({
      kitoMemberId: z.string("Invalid kito member ID").nonempty("Invalid kito member ID")
    })
  },
  async handler(ctx) {
    const data = ctx.validated.body;
    const { kitoMemberId } = ctx.validated.params;

    const [kitoMember] = await db
      .update(Table.kitoMembers)
      .set(data)
      .where(eq(Table.kitoMembers.id, kitoMemberId))
      .returning();

    if (!kitoMember) {
      throw HttpException.INTERNAL("Failed to update Kito member");
    }

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Kito member updated",
      data: { kitoMember }
    });
  }
});

import db from "#database/index.js";
import { Meta } from "#database/utils/meta.js";
import { HttpException } from "#errors/http-exception.js";
import { defineRequestHandler } from "#utils/request-handler.js";

export const getMeta = defineRequestHandler({
  async handler(ctx) {
    const meta = await Meta.get(db);

    if (!meta) {
      throw HttpException.NOT_FOUND("Metadata not found");
    }

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Metadata retrieved",
      data: { meta }
    });
  }
});

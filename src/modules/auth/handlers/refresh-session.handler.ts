import { REFRESH_TOKEN_LEN } from "#utils/constants.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import z from "zod";
import { SessionService } from "../services/session/index.js";

export const refreshSession = defineRequestHandler({
  validator: {
    query: z.object({ token: z.string("Invalid token").length(REFRESH_TOKEN_LEN, "Invalid token") })
  },
  async handler(ctx) {
    const { token } = ctx.validated.query;

    const result = await SessionService.refreshSession(token);

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Session refreshed successfully",
      data: result
    });
  }
});

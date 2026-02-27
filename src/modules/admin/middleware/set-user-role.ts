import { defineRequestHandler } from "#utils/request-handler.js";

export const setUserRole = (role: "user" | "admin") =>
  defineRequestHandler({
    async handler(ctx) {
      ctx.req.query.role = role;
      ctx.next();
    }
  });

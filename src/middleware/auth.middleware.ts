import { HttpException } from "#errors/http-exception.js";
import { JWT } from "#utils/jwt/index.js";
import type { Request, RequestHandler } from "express";

interface AuthMiddlewareOptions {
  roles?: string | string[];
}

export function authHandler(options: AuthMiddlewareOptions = {}): RequestHandler {
  let { roles } = options;

  return async (req, res, next) => {
    const { token } = decodeTokenFromBearerAuth(req);
    const payload = JWT.verify(token);

    if (!payload) {
      throw HttpException.UNAUTHORIZED("Unauthorized. Please log in");
    }

    const { role, emailVerified, banned } = payload;

    if (!emailVerified) {
      throw HttpException.UNAUTHORIZED("Email verification required");
    }

    if (banned) {
      throw HttpException.UNAUTHORIZED("User is banned");
    }

    if (roles) {
      if (!Array.isArray(roles)) {
        roles = [roles];
      }

      if (!roles.includes(role)) {
        throw HttpException.FORBIDDEN("Forbidden");
      }
    }

    req.user = payload;

    next();
  };
}

function decodeTokenFromBearerAuth(req: Request) {
  const header = req.headers["authorization"];
  if (!header) {
    throw HttpException.BAD_REQUEST("Missing Authorization header");
  }

  const token = header.split(" ")[1];
  if (!token) {
    throw HttpException.BAD_REQUEST("Invalid Authorization header");
  }

  return { token };
}

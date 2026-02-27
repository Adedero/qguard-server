import env from "#lib/env/index.js";
import type { JWTPayload } from "#types/jwt.type.js";
import { ACCESS_TOKEN_EXPIRES_IN_MS } from "#utils/constants.js";
import jwt from "jsonwebtoken";

export const JWT = {
  async sign<T extends string | object | Buffer<ArrayBufferLike> = any>(
    payload: T,
    options?: jwt.SignOptions
  ): Promise<string> {
    const secret = env.get("JWT_SECRET");
    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        payload,
        secret,
        {
          expiresIn: ACCESS_TOKEN_EXPIRES_IN_MS / 1000,
          algorithm: "HS256",
          ...options
        },
        (error, token) => {
          if (error) {
            reject(error);
          } else {
            resolve(token as string);
          }
        }
      );
    });
  },

  verify(token: string): JWTPayload | null {
    const secret = env.get("JWT_SECRET");
    try {
      const decoded = jwt.verify(token, secret) as JWTPayload;
      return decoded;
    } catch {
      return null;
    }
  }
};

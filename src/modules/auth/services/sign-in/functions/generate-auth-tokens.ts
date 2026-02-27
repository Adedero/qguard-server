import type { JWTPayload } from "#types/jwt.type.js";
import { REFRESH_TOKEN_LEN } from "#utils/constants.js";
import { JWT } from "#utils/jwt/index.js";
import { randomToken } from "#utils/random-string.js";

export const generateAuthTokens = async (payload: JWTPayload) => {
  const accessToken = await JWT.sign(payload);
  const refreshToken = randomToken(REFRESH_TOKEN_LEN);

  return { accessToken, refreshToken };
};

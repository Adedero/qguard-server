import { VERIFICATION_TOKEN_LEN } from "#utils/constants.js";
import { randomToken } from "#utils/random-string.js";
import { Text } from "#utils/text/index.js";
import { addHours } from "date-fns";

export const generateToken = (expiresInHours: number) => {
  const token = randomToken(VERIFICATION_TOKEN_LEN);
  const hash = Text.sha256(token);
  const expiresAt = addHours(new Date(), expiresInHours);

  return {
    value: hash,
    raw: token,
    expiresAt
  };
};

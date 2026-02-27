import isHash from "./lib/is-hash.js";
import { decodeBase64, encodeBase64 } from "./lib/base64.js";
import isPhoneNumber from "./lib/is-phone-number.js";
import isULID from "./lib/is-ulid.js";
import { sha256 } from "./lib/sha256.js";

export const Text = {
  isPhoneNumber,
  isHash,
  isULID,
  sha256,
  encodeBase64,
  decodeBase64
};

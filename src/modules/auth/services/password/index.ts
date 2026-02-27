import { confirmUserPassword } from "./functions/confirm-user-password.js";
import { hash } from "./functions/hash.js";
import { isHash } from "./functions/is-hash.js";
import { verify } from "./functions/verify.js";

export const PasswordService = {
  hash,
  isHash,
  verify,
  confirmUserPassword
};

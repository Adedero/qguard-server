import { generateToken } from "./functions/generate-token.js";
import { getToken } from "./functions/get-token.js";
import { getUserByEmail } from "./functions/get-user-by-email.js";
import { sendMail } from "./functions/send-mail.js";
import { getVerificationRecord } from "./functions/get-verification-record.js";
import { getUserFromVerificationRecord } from "./functions/get-user-from-verification-record.js";
import { deleteVerificationRecord } from "./functions/delete-verification-record.js";
import { isTokenValid } from "./functions/is-token-valid.js";
import { markUserAsVerified } from "./functions/mark-user-as-verified.js";

export const EmailVerificationService = {
  generateToken,
  getToken,
  sendMail,
  getUserByEmail,
  isTokenValid,
  getVerificationRecord,
  getUserFromVerificationRecord,
  deleteVerificationRecord,
  markUserAsVerified
};

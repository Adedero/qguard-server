import { resetPassword } from "./functions/reset-password.js";
import { revokeAllUserSessions } from "./functions/revoke-all-user-sessions.js";
import { sendResetEmail } from "./functions/send-reset-email.js";

export const PasswordResetService = {
  sendResetEmail,
  resetPassword,
  revokeAllUserSessions
};

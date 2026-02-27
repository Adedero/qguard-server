import type { VerificationModel } from "#database/schema.js";

export const isTokenValid = (verificationRecord: VerificationModel, userEmail: string) => {
  if (verificationRecord.identifier !== userEmail) {
    return false;
  }

  if (verificationRecord.expiresAt < new Date()) {
    return false;
  }

  return true;
};

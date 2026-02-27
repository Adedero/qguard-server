import { sendMail } from "#lib/email/index.js";
import { passwordResetEmailTemplate } from "#lib/email/templates/pages/password-reset/index.js";
import { PASSWORD_RESET_TOKEN_EXPIRES_IN_HOURS } from "#utils/constants.js";

export interface SendPasswordResetEmailInput {
  url: string;
  name: string;
  email: string;
}

export async function sendPasswordResetEmail(input: SendPasswordResetEmailInput) {
  const { name, url, email } = input;
  const tokenExpiresInHours = PASSWORD_RESET_TOKEN_EXPIRES_IN_HOURS;

  const html = await passwordResetEmailTemplate({
    name,
    verificationURL: url,
    URLExpiryInHours: tokenExpiresInHours
  });

  await sendMail("support", {
    to: {
      name,
      address: email
    },
    subject: "Reset your password",
    html
  });
}

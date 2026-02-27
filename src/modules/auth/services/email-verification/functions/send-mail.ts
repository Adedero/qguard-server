import { emailVerificationEmailTemplate } from "#lib/email/templates/pages/email-verification/index.js";
import { sendMail as mailTo } from "#lib/email/index.js";
import { VERIFICATION_TOKEN_EXPIRES_IN_HOURS } from "#utils/constants.js";

export interface SendMailOptions {
  url: string;
  name: string;
  email: string;
}
export const sendMail = async (options: SendMailOptions) => {
  const { url, name, email } = options;

  const subject = "Verify your email";

  const html = await emailVerificationEmailTemplate({
    name,
    verificationURL: url,
    URLExpiryInHours: VERIFICATION_TOKEN_EXPIRES_IN_HOURS
  });

  await mailTo("support", {
    to: {
      name,
      address: email
    },
    subject,
    html
  });
};

import { sendMail } from "#lib/email/index.js";
import { welcomeEmailTemplate } from "#lib/email/templates/index.js";
import env from "#lib/env/index.js";

export interface SendWelcomeEmailInput {
  id: string;
  name: string;
  email: string;
}
export async function sendWelcomeEmail(input: SendWelcomeEmailInput) {
  const { name, email } = input;
  const appName = env.get("APP_NAME");

  const html = await welcomeEmailTemplate(name);

  await sendMail("support", {
    to: {
      name,
      address: email
    },
    subject: `Welcome to ${appName}`,
    html
  });
}

import { render } from "@react-email/components";
import EmailVerificationEmail, { type EmailVerificationEmailProps } from "./email-verification.js";

export type { EmailVerificationEmailProps } from "./email-verification.js";

export const emailVerificationEmailTemplate = async (props: EmailVerificationEmailProps) => {
  const html = await render(<EmailVerificationEmail {...props} />);
  return html;
};

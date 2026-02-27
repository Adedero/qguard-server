import { render } from "@react-email/components";
import PasswordResetEmail, { type PasswordResetEmailProps } from "./password-reset.js";

export type { PasswordResetEmailProps } from "./password-reset.js";

export const passwordResetEmailTemplate = async (props: PasswordResetEmailProps) => {
  const html = await render(<PasswordResetEmail {...props} />);
  return html;
};

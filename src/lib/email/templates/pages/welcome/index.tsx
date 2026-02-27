import { render } from "@react-email/components";
import WelcomeEmail from "./welcome.js";

export const welcomeEmailTemplate = async (name: string) => {
  const html = await render(<WelcomeEmail name={name} />);
  return html;
};

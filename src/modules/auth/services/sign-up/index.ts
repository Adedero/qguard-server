import { createAccount } from "./functions/create-account.js";
import { createSignUpHandler } from "./functions/create-sign-up-handler.js";
import { createUser } from "./functions/create-user.js";
import { sendWelcomeEmail } from "./functions/send-welcome-email.js";
import { userAlreadyExists } from "./functions/user-already-exists.js";

export const SignUpService = {
  createUser,
  createAccount,
  sendWelcomeEmail,
  userAlreadyExists,
  createSignUpHandler
};

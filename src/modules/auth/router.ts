import { Router } from "express";
import { signUp } from "./handlers/sign-up.handler.js";
import { sendVerificationEmail } from "./handlers/send-verification-email.handler.js";
import { verifyEmail } from "./handlers/verify-email.handler.js";
import { signIn } from "./handlers/sign-in.handler.js";
import { refreshSession } from "./handlers/refresh-session.handler.js";
import { signOut } from "./handlers/sign-out.handler.js";
import { sendPasswordResetEmail } from "./handlers/send-password-reset-email.handler.js";
import { resetPassword } from "./handlers/reset-password.handler.js";
import { authHandler } from "#middleware/auth.middleware.js";

export default function createAuthRoutes(): Router {
  const router = Router();

  router.post("/sign-up", signUp());
  router.post("/send-verification-email", sendVerificationEmail);
  router.post("/verify-email", verifyEmail);
  router.post("/sign-in", signIn);
  router.post("/send-password-reset-email", sendPasswordResetEmail);
  router.post("/reset-password", resetPassword);
  router.post("/refresh-session", refreshSession);
  router.post("/sign-out", authHandler({ roles: ["user", "admin"] }), signOut);

  return router;
}

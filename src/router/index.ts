import { Router } from "express";
import { authHandler } from "../middleware/auth.middleware.js";
import createAuthRouter from "../modules/auth/router.js";
import createUserRouter from "../modules/user/router.js";
import createAssetRouter from "../modules/assets/router.js";
import createAdminRouter from "../modules/admin/router.js";

export default function createRouter(): Router {
  const router = Router();

  router.use("/auth", createAuthRouter());
  router.use("/assets", authHandler({ roles: ["admin", "user"] }), createAssetRouter());
  router.use("/users/me", authHandler({ roles: ["user"] }), createUserRouter());
  router.use("/admins/me", authHandler({ roles: ["admin"] }), createAdminRouter());

  return router;
}

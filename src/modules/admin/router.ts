import { Router } from "express";
import { getQuickSummary } from "./dashboard/get-quick-summary.handler.js";
import { getPendingReportsPreview } from "./dashboard/get-pending-reports-review.handler.js";
import { getMeta } from "./settings/get-meta.handler.js";
import { getReportsCursor } from "./reports/get-reports-cursor.handler.js";
import { getUsersCursor } from "./users/get-users-cursor.handler.js";
import { setUserRole } from "./middleware/set-user-role.js";
import { createUser } from "./users/create-user.handler.js";
import { getReportById } from "./reports/get-report-by-id.handler.js";
import { updateReportStatus } from "./reports/update-report-status.handler.js";
import { deleteReport } from "./reports/delete-report.handler.js";
import { getUserById } from "./users/get-user-by-id.handler.js";
import { banUser } from "./users/ban-user.handler.js";
import { unbanUser } from "./users/unban-user.handler.js";
import { signOutUser } from "./users/sign-out-user.handler.js";
import { getUserSessionsCursor } from "./users/get-user-sessions-cursor.handler.js";
import { createUpdateUserHandler } from "#modules/shared/utils/create-update-user-handler.js";
import { getLocationsCursor } from "./locations/get-locations-cursor.handler.js";
import { createLocation } from "./locations/create-location.handler.js";
import { deleteLocation } from "./locations/delete-location.handler.js";
import { getKitoMembersCursor } from "./kito-members/get-kito-members-cursor.handler.js";
import { createKitoMember } from "./kito-members/create-kito-member.handler.js";
import { updateKitoMember } from "./kito-members/update-kito-member.handler.js";
import { deleteKitoMember } from "./kito-members/delete-kito-member.handler.js";
import { deleteMultipleKitoMembers } from "./kito-members/delete-multiple-kito-members.handler.js";

export default function createAdminRouter(): Router {
  const router = Router();

  router.get("/dashboard/quick-summary", getQuickSummary);
  router.get("/dashboard/pending-reports-preview", getPendingReportsPreview);

  router.get("/reports/cursor", getReportsCursor);
  router.get("/reports/:reportId", getReportById);
  router.put("/reports/:reportId/status", updateReportStatus);
  router.delete("/reports/:reportId", deleteReport);

  router.get("/users/cursor", setUserRole("user"), getUsersCursor);
  router.post("/users", createUser());
  router.get("/users/:userId", getUserById);
  router.put("/users/:userId", createUpdateUserHandler());
  router.post("/users/:userId/ban", banUser);
  router.post("/users/:userId/unban", unbanUser);
  router.post("/users/:userId/sign-out", signOutUser);
  router.get("/users/:userId/sessions/cursor", getUserSessionsCursor);

  router.get("/locations/cursor", getLocationsCursor);
  router.post("/locations", createLocation);
  router.delete("/locations/:locationId", deleteLocation);

  router.get("/admins/cursor", setUserRole("admin"), getUsersCursor);

  router.get("/kito-members/cursor", getKitoMembersCursor);
  router.post("/kito-members", createKitoMember);
  router.put("/kito-members/:kitoMemberId", updateKitoMember);
  router.delete("/kito-members/:kitoMemberId", deleteKitoMember);
  router.post("/kito-members/delete", deleteMultipleKitoMembers);

  router.get("/meta", getMeta);

  return router;
}

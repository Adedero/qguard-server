import { Router } from "express";
import { getKitoMembers } from "./kito-members/handlers/get-kito-members.handler.js";
import { getKitoMembersCursor } from "./kito-members/handlers/get-kito-members-cursor.handler.js";
import { createReport } from "./reports/handlers/create-report.handler.js";
import { getLocationsCursor } from "./locations/handlers/get-locations-cursor.handler.js";
import { getLocationById } from "./locations/handlers/get-location-by-id.handler.js";
import { getReportsCursor } from "./reports/handlers/get-reports-cursor.hadler.js";
import { createUpdateUserHandler } from "#modules/shared/utils/create-update-user-handler.js";
import { getSelf } from "./me/get-self.js";

export default function createUserRouter(): Router {
  const router = Router();

  router.get("/locations/cursor", getLocationsCursor);
  router.get("/locations/:locationId", getLocationById);

  router.post("/reports", createReport);
  router.get("/reports/cursor", getReportsCursor);

  router.get("/kito-members", getKitoMembers);
  router.get("/kito-members/cursor", getKitoMembersCursor);

  router.get("/", getSelf);
  router.put("/", createUpdateUserHandler());

  return router;
}

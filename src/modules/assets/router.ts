import { Router } from "express";
import { uploadLocal } from "./handlers/upload-local.handler.js";
import { deleteLocal } from "./handlers/delete-local.handler.js";
import { uploadRemote } from "./handlers/upload-remote.handler.js";
import { deleteRemote } from "./handlers/delete-remote.handler.js";

export default function createAssetRouter(): Router {
  const router = Router();

  router.post("/upload/local", uploadLocal);
  router.post("/delete/local", deleteLocal);
  router.post("/upload/remote", uploadRemote);
  router.post("/delete/remote", deleteRemote)

  return router;
}

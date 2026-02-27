import { Router } from "express";
import { uploadLocal } from "./handlers/upload-local.handler.js";
import { deleteLocal } from "./handlers/delete-local.handler.js";

export default function createAssetRouter(): Router {
  const router = Router();

  router.post("/upload/local", uploadLocal);
  router.post("/delete/local", deleteLocal);

  return router;
}

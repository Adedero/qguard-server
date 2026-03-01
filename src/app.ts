import helmet from "helmet";
import env from "#lib/env/index.js";
import { xss } from "express-xss-sanitizer";
import express, { type Express } from "express";
import createRouter from "./router/index.js";
import CORS from "#middleware/cors.middleware.js";
import SIRV from "#middleware/sirv.middleware.js";
import swaggerUI from "#middleware/swagger.middleware.js";
import { errorHandler, notFoundHandler } from "#middleware/error.middleware.js";
import compression from "compression";
import logger from "#lib/logger/index.js";

export function createApp(): Express {
  const app = express();
  /* Middleware */
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
  app.use(CORS());
  app.options("/{*splat}", CORS());
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(compression());
  app.use(express.static("public"));
  app.use(express.json({ limit: env.get("EXPRESS_JSON_LIMIT") }));
  app.use(express.urlencoded({ extended: false }));
  app.use(xss());
  // SIRV(app);
  swaggerUI(app);
  app.use("/api", createRouter());
  app.use(notFoundHandler());
  app.use(errorHandler());
  return app;
}

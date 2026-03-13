import env from "#lib/env/index.js";
import logger from "#lib/logger/index.js";
import cors from "cors";

const ALLOWED_ORIGINS = env.get("ALLOWED_ORIGINS");

export default function CORS(): ReturnType<typeof cors> {
  return cors({
    origin: (origin, callback) => {
      logger.info(`CORS origin: ${origin}`);

      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`))
      }
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  });
}

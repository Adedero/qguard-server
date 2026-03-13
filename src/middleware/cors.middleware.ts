import env from "#lib/env/index.js";
import logger from "#lib/logger/index.js";
import cors from "cors";

export default function CORS(): ReturnType<typeof cors> {
  const ALLOWED_ORIGINS = env.get("ALLOWED_ORIGINS");

  return cors({
    origin: (origin, callback) => {
      logger.info(`CORS request from origin: ${origin}`);

      if (!origin) {
        return callback(null, true);
      }

      const isAllowed = ALLOWED_ORIGINS.some((allowedOrigin) => {
        // Remove trailing slashes for comparison
        const normalizedAllowed = String(allowedOrigin).replace(/\/$/, "");
        const normalizedOrigin = String(origin).replace(/\/$/, "");
        return normalizedAllowed === normalizedOrigin;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked for origin: ${origin}. Allowed: ${ALLOWED_ORIGINS.join(", ")}`);
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200,
  });
}

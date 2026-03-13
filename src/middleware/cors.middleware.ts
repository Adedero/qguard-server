import env from "#lib/env/index.js";
import cors from "cors";

export default function CORS(): ReturnType<typeof cors> {
  return cors({
    origin: env.get("ALLOWED_ORIGINS"),
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200
  });
}

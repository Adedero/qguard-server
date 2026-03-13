import env from "#lib/env/index.js";
import cors from "cors";
console.log("Allowed origins:", env.get("ALLOWED_ORIGINS"));
export default function CORS(): ReturnType<typeof cors> {
  return cors({
    origin: env.get("ALLOWED_ORIGINS"),
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 204
  });
}

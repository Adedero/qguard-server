import env from "#lib/env/index.js";
import { createTransport } from "./utils.js";

export type TransportName = keyof typeof transports;

export const transports = {
  support: {
    name: "QGuard Support",
    email: "support@qguard.com",
    transport: createTransport({
      host: env.get("EMAIL_HOST"),
      port: env.get("EMAIL_PORT"),
      email: env.get("EMAIL_USER"),
      password: env.get("EMAIL_PASSWORD"),
      secure: env.get("EMAIL_SECURE")
    })
  }
} as const;

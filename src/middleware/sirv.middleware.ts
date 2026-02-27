import sirv, { type Options } from "sirv";
import type { Express } from "express";
import compression from "compression";
import { resolve } from "node:path";

export default function SIRV(app: Express) {
  const options: Options | undefined =
    process.env.NODE_ENV === "production"
      ? {
          maxAge: 31536000, // 1Y
          immutable: true
        }
      : undefined;

  const assets = sirv(resolve(process.cwd(), "public"), options);
  app.use(compression());
  app.use(assets);
}

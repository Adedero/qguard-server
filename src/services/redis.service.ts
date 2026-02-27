import env from "#lib/env/index.js";
import logger from "#lib/logger/index.js";
import { createClient } from "redis";

let client: ReturnType<typeof createClient> | null = null;

export default async function Redis(url: string = env.get("REDIS_CLIENT_URL")) {
  if (client) {
    return client;
  }

  client = await createClient({ url })
    .once("connect", () => {
      logger.info(`Redis Client running on ${env.get("REDIS_CLIENT_URL")}`);
    })
    .on("error", (err) => {
      logger.error("Redis Client Error", err);
    })
    .connect();

  return client;
}

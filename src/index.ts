import { createApp } from "#app";
import { createServer } from "node:http";
import env from "#lib/env/index.js";
import logger from "#lib/logger/index.js";
import { createProcessListeners, createServerListeners } from "#utils/server.js";
import { run as runTasks } from "#tasks/index.js";

async function main() {
  try {
    env.init();
    runTasks();

    const app = createApp();
    const server = createServer(app);
    const baseURL: string = env.get("BASE_URL");
    const port: number = env.get("PORT");

    createServerListeners(server);
    createProcessListeners(server);

    // --- START SERVER ---
    server.listen(port, () => {
      logger.info(`Server running on ${baseURL} | port: ${port}`);
    });
  } catch (error) {
    logger.fatal("Failed to start server:", error);
  }
}

main();

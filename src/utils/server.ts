import type { Server } from "node:http";
import env from "#lib/env/index.js";
import logger from "#lib/logger/index.js";

export function createServerListeners(server: Server) {
  const port: number = env.get("PORT");

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      logger.error(`Port ${port} is already in use.`, error);
    } else if (error.code === "EACCES") {
      logger.error(`Permission denied for port ${port}.`);
    } else {
      logger.error("Server encountered an error:", error);
    }
    process.exit(1);
  });

  server.on("close", () => {
    logger.warn("Server has been closed.");
  });
}

export function createProcessListeners(server: Server) {
  process.on("uncaughtException", (err) => {
    logger.fatal("Uncaught Exception:", err);
  });
  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Promise Rejection:", reason);
  });
  process.on("SIGINT", () => {
    logger.info("SIGINT received. Shutting down...");
    server.close(() => process.exit(0));
  });
  process.on("SIGTERM", () => {
    logger.info("SIGTERM received. Gracefully shutting down...");
    server.close(() => process.exit(0));
  });
}

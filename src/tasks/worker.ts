import env from "#lib/env/index.js";
import logger from "#lib/logger/index.js";
import { QUEUE_NAME } from "./queue.js";
import {
  sendPasswordResetEmail,
  type SendPasswordResetEmailInput
} from "./functions/send-password-reset-email.js";
import { sendWelcomeEmail, type SendWelcomeEmailInput } from "./functions/send-welcome-email.js";
import { Job, Worker } from "bullmq";
import { deleteLocation } from "#modules/shared/utils/delete-location.js";

export type AppWorkerJobName = "welcome" | "password_reset" | "location_delete";

export const appWorker = new Worker(
  QUEUE_NAME,
  async (job) => {
    const { data } = job;

    switch (job.name) {
      case "welcome":
        await sendWelcomeEmail(data as SendWelcomeEmailInput);
        logger.info(`Welcome email sent to ${data.name}<${data.email}>`);
        break;

      case "password_reset":
        await sendPasswordResetEmail(data as SendPasswordResetEmailInput);
        logger.info(`Password reset email sent to ${data.name}<${data.email}>`);
        break;

      case "location_delete":
        await deleteLocation(data.locationId);
        break;

      default:
        throw new Error(`Unknown email type: ${job.name}`);
    }
  },
  {
    connection: {
      url: env.get("REDIS_CLIENT_URL"),
      maxRetriesPerRequest: null
    },
    concurrency: 5,
    limiter: {
      max: 100, // Max 100 emails
      duration: 60_000 // per minute (rate limiting)
    },
    lockDuration: 120_000,
    maxStalledCount: 1
  }
);

appWorker.on("failed", (job: Job | undefined, err: Error) => {
  logger.error(`App Job with ID: ${job?.id} failed`, err);
});

appWorker.on("error", (err) => {
  logger.error("App Worker Error", err);
});

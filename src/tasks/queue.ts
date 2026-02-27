import env from "#lib/env/index.js";
import { Queue, type JobsOptions } from "bullmq";
import type { AppWorkerJobName } from "./worker.js";

export const QUEUE_NAME = "app";
class AppQueue {
  private readonly queue: Queue;

  constructor() {
    this.queue = new Queue(QUEUE_NAME, {
      connection: {
        url: env.get("REDIS_CLIENT_URL")
      }
    });
  }

  /**
   * Expose the raw BullMQ queue when needed
   * (dashboards, schedulers, etc.)
   */
  raw(): Queue {
    return this.queue;
  }

  async addJob<T = unknown>(name: AppWorkerJobName, data: T, options: JobsOptions = {}) {
    return this.queue.add(name, data, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2_000
      },
      removeOnComplete: true,
      removeOnFail: {
        age: 24 * 3600 // keep up to 24 hours
      },
      ...options
    });
  }
}

const appQueue = new AppQueue();

export default appQueue;
export { AppQueue };

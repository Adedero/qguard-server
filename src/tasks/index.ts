import { appWorker } from "./worker.js";

export function run() {
  if (!appWorker.isRunning()) {
    appWorker.run();
  }
}

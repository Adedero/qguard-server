import appQueue from "#tasks/queue.js";
import type { SendMailOptions } from "../../email-verification/functions/send-mail.js";

export function sendResetEmail(options: SendMailOptions) {
  appQueue.addJob("password_reset", options);
}

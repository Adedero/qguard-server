import type { UserModel } from "#database/models/user.model.js";
import appQueue from "#tasks/queue.js";

export const sendWelcomeEmail = async (input: { id: string; name: string; email: string }) => {
  appQueue.addJob("welcome", input);
};

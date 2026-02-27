import { Logger } from "./lib/logger.js";

const logger = Logger.getInstance();

export default logger;
export { Logger };
export type { LoggerOptions, LoggerError } from "./types/logger.type.js";

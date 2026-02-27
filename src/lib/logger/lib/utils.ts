import winston from "winston";
import type { LoggerError } from "../types/logger.type.js";

// Helper to ensure Error objects are fully serialized (message/stack are usually non-enumerable)
export const enumerateErrorFormat = winston.format((info) => {
  let formattedError: LoggerError | null = null;

  if (info.error instanceof Error) {
    formattedError = enumerateError(info.error);
  }
  return formattedError ? { ...info, error: formattedError } : info;
});

export function enumerateError(error: Error, seen = new WeakSet<Error>()) {
  if (seen.has(error)) {
    return { message: "[Circular Reference]", name: error.name };
  }
  seen.add(error);

  const result: {
    message: string;
    name: string;
    stack?: string;
    [x: string]: any;
  } = {
    message: error.message,
    name: error.name,
    stack: error.stack
  };

  if (error.cause) {
    result.cause = error.cause instanceof Error ? enumerateError(error.cause, seen) : error.cause;
  }

  // Capture any additional properties
  Object.keys(error).forEach((key) => {
    if (!["message", "name", "stack", "cause"].includes(key)) {
      const value = (error as any)[key];
      result[key] = value instanceof Error ? enumerateError(value, seen) : value;
    }
  });

  return result;
}

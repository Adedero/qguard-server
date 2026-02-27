import fs from "node:fs";
import path from "node:path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import type { LoggerOptions } from "../types/logger.type.js";
import { enumerateErrorFormat } from "./utils.js";

export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;
  private logsDir = "";
  private outputFormat: "text" | "json" = "text";

  // Define custom levels to match your requirements
  private customLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4
  };

  private customColors: { [key: string]: string } = {
    fatal: "magenta",
    error: "red",
    warn: "yellow",
    info: "blue",
    debug: "green"
  };

  private constructor(options: LoggerOptions = {}) {
    const { rootDir, format = "text" } = options;
    this.outputFormat = format;
    this.logsDir = rootDir ?? path.resolve("logs");

    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }

    // Tell winston about our colors
    winston.addColors(this.customColors);

    // Base format: Timestamp + Error Object Handling
    const baseFormat = winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      enumerateErrorFormat()
    );

    // 1. Define Console Transport Format
    let consoleFormat: winston.Logform.Format;

    if (this.outputFormat === "json") {
      consoleFormat = winston.format.combine(baseFormat, winston.format.json());
    } else {
      consoleFormat = winston.format.combine(
        baseFormat,
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message, error, ...meta }) => {
          // Base log message
          let logMsg = `${timestamp} [${level}]: ${message}`;

          // Handle Error Display in Text Mode
          if (error) {
            if (typeof error === "object" && "stack" in error && error.stack) {
              logMsg += `\n${error.stack}`;
            } else {
              logMsg += `\nError Object: ${JSON.stringify(error, null, 2)}`;
            }
          }

          // Handle remaining metadata (if any)
          if (Object.keys(meta).length > 0) {
            logMsg += `\n${JSON.stringify(meta, null, 2)}`;
          }

          return logMsg;
        })
      );
    }

    // 2. Define File Transport Format (Always JSON for parsability)
    const fileFormat = winston.format.combine(baseFormat, winston.format.json());

    this.logger = winston.createLogger({
      levels: this.customLevels,
      level: process.env.LOG_LEVEL || "debug",
      transports: [
        new winston.transports.Console({
          format: consoleFormat
        }),
        // Add File Transports only in Production (or as configured)
        ...(process.env.NODE_ENV === "production"
          ? [
              new DailyRotateFile({
                filename: path.join(this.logsDir, "info-%DATE%.log"),
                datePattern: "YYYY-MM-DD",
                zippedArchive: true,
                maxSize: "5m",
                maxFiles: "30d",
                level: "info",
                format: fileFormat
              }),
              new DailyRotateFile({
                filename: path.join(this.logsDir, "error-%DATE%.log"),
                datePattern: "YYYY-MM-DD",
                zippedArchive: true,
                maxSize: "5m",
                maxFiles: "90d",
                level: "error",
                format: fileFormat
              })
            ]
          : [])
      ]
    });
  }

  public static initialize(options?: LoggerOptions): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(options);
    }
    return Logger.instance;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public info(message: string, meta?: Record<string, any>): void {
    this.logger.info(message, meta);
  }

  public warn(message: string, meta?: Record<string, any>): void {
    this.logger.warn(message, meta);
  }

  public debug(message: string, meta?: Record<string, any>): void {
    this.logger.debug(message, meta);
  }

  /**
   * Logs an error.
   * @param message - The error message
   * @param error - The actual error object (Error instance or custom object)
   * @param meta - Additional metadata
   */
  public error(message: string, error?: unknown, meta?: Record<string, any>): void {
    // Preserve the error exactly as is within the metadata
    const logMeta = { ...meta };

    if (error !== undefined && error !== null) {
      logMeta.error = error;
    }

    this.logger.error(message, logMeta);
  }

  public fatal(
    message: string,
    error?: unknown,
    meta?: Record<string, any>,
    exit: boolean = true
  ): void {
    const logMeta = { ...meta };

    if (error !== undefined && error !== null) {
      logMeta.error = error;
    }

    this.logger.log("fatal", message, logMeta);

    if (exit) {
      // Allow the stream to flush before exiting
      // (using slight delay or event listener to ensure log write)
      this.logger.on("finish", () => {
        process.exit(1);
      });
      this.logger.end();
    }
  }

  public setLevel(level: string): void {
    this.logger.level = level;
  }
}

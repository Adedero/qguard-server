export interface LoggerOptions {
  rootDir?: string;
  format?: "text" | "json";
  level?: "fatal" | "error" | "warn" | "info" | "debug";
}

export interface LoggerError {
  message: string;
  name: string;
  stack?: string;
  [key: string]: any;
}

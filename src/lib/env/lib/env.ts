import dotenv from "dotenv";
import { envSchema, type EnvSchema } from "./env.schema.js";

export class Env {
  private vars!: EnvSchema;
  private noVarsErrorMessage = "ENV variables not loaded. Did you forget to call env.init()?";

  constructor() {
    this.init();
  }

  init() {
    if (process.env.NODE_ENV !== "production") {
      dotenv.config({ quiet: true });
    }
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
      throw new Error(result.error.issues[0]?.message ?? "Unknown ENV validation error");
    }
    this.vars = result.data;
  }

  get<K extends keyof typeof this.vars>(
    key: K,
    defaultValue?: (typeof this.vars)[K]
  ): (typeof this.vars)[K] {
    if (!this.vars) {
      throw new Error(this.noVarsErrorMessage);
    }
    return this.vars[key] ?? defaultValue;
  }

  getAll(): EnvSchema {
    if (!this.vars) {
      throw new Error(this.noVarsErrorMessage);
    }
    return this.vars;
  }

  has(key: string): boolean {
    if (!this.vars) {
      throw new Error(this.noVarsErrorMessage);
    }
    return (this.vars as Record<string, unknown>)[key] ? true : false;
  }

  isEnv(environment: EnvSchema["NODE_ENV"]): boolean {
    return this.vars["NODE_ENV"] === environment;
  }
}

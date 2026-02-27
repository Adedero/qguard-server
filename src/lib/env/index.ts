import { Env } from "./lib/env.js";

const env = new Env();

export default env;
export { Env };
export { envSchema, type EnvSchema } from "./lib/env.schema.js";

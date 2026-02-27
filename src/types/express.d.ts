import { Request } from "express";
import type { JWTPayload } from "./jwt.type.ts";

declare global {
  namespace Express {
    export interface User extends JWTPayload {}

    export interface Request {
      user?: User;
    }
  }
}

export {};

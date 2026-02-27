import { HttpException } from "#errors/http-exception.js";
import env from "#lib/env/index.js";
import logger from "#lib/logger/index.js";
import type { ErrorRequestHandler, RequestHandler } from "express";

export function errorHandler(): ErrorRequestHandler {
  return (err, req, res, next) => {
    const error = HttpException.from(err);
    if (env.isEnv("development")) {
      logger.error("Unhandled Exception", error);
    }
    res.status(error.statusCode).json(error.toJSON());
  };
}

export function notFoundHandler(): RequestHandler {
  return (req) => {
    const { path, method } = req;
    throw HttpException.NOT_FOUND(`Not found: ${method.toUpperCase()} ${path}`);
  };
}

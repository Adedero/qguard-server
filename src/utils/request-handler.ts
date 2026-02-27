import { HttpException } from "#errors/http-exception.js";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { ZodType, z } from "zod";
import { getClientIp } from "request-ip";

/**
 * Base context that's always available
 */
export interface BaseContext {
  req: Request;
  res: Response;
  next: NextFunction;
  getAuthenticatedUser: () => Express.User;
  getClientIp: () => string | null;
}

/**
 * Validator configuration
 */
export type ValidatorConfig = Partial<{
  body: ZodType;
  params: ZodType;
  query: ZodType;
  headers: ZodType;
}>;

/**
 * Extract validated types from validator config
 */
type ValidatedData<V extends ValidatorConfig> = {
  validated: {
    [K in keyof V]: V[K] extends ZodType ? z.infer<V[K]> : never;
  };
};

/**
 * Context enhancement function
 */
type ContextEnhancer<TExtra extends Record<string, any>> = (
  ctx: BaseContext
) => TExtra | Promise<TExtra>;

/**
 * Merge base context + validated data + custom context
 */
type HandlerContext<
  V extends ValidatorConfig | undefined,
  E extends Record<string, any> | undefined
> = BaseContext &
  (V extends ValidatorConfig ? ValidatedData<V> : {}) &
  (E extends Record<string, any> ? E : {});

/**
 * Controller definition options
 */
interface ControllerOptions<
  V extends ValidatorConfig | undefined = undefined,
  E extends Record<string, any> | undefined = undefined
> {
  validator?: V;
  context?: ContextEnhancer<NonNullable<E>>;
  handler: (ctx: HandlerContext<V, E>) => void | Promise<void>;
}

/**
 * Define a type-safe controller
 */
export function defineRequestHandler<
  V extends ValidatorConfig | undefined = undefined,
  E extends Record<string, any> | undefined = undefined
>(options: ControllerOptions<V, E>): RequestHandler {
  const { validator, context: contextEnhancer, handler } = options;

  return async (req, res, next) => {
    try {
      const baseCtx: BaseContext = {
        req,
        res,
        next,
        getAuthenticatedUser: () => getAuthenticatedUser(req),
        getClientIp: () => getClientIp(req)
      };
      const ctx: any = { ...baseCtx };

      if (validator) {
        ctx.validated = {};

        for (const key of Object.keys(validator) as (keyof ValidatorConfig)[]) {
          const schema = validator[key];
          if (!schema) continue;

          const data = req[key as keyof Request];
          const result = await schema.safeParseAsync(data);

          if (!result.success) {
            return res.status(400).json({
              success: false,
              status: 400,
              message: result.error.issues[0]?.message ?? `${key} validation failed`,
              error: {
                issues: result.error.issues,
                validationTarget: key
              }
            });
          }

          ctx.validated[key] = result.data;
        }
      }

      if (contextEnhancer) {
        const extra = await contextEnhancer(baseCtx);
        Object.assign(ctx, extra);
      }

      await handler(ctx);
    } catch (err) {
      next(err);
    }
  };
}

function getAuthenticatedUser(req: Request) {
  const user = req.user;
  if (!user) {
    throw new HttpException(401, "Unauthorized");
  }
  return user;
}

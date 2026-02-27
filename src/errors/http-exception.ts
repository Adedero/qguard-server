/**
 * Represents an HTTP-level exception with an associated status code,
 * an optional machine-readable error code, and optional additional data.
 *
 * This class extends the built-in Error so it can be thrown and will
 * include a stack trace. It provides several helper static constructors
 * for common HTTP error responses (e.g. BAD_REQUEST, NOT_FOUND).
 *
 * @template T Type of the optional `data` payload attached to the error.
 * @extends {Error}
 *
 * @example
 * // throw a 404
 * throw HttpException.NOT_FOUND('User not found');
 *
 * @example
 * // throw a custom error with data
 * throw new HttpException(422, 'Validation failed', { data: { field: 'email' }, errorCode: 'VALIDATION_ERROR' });
 */
export class HttpException<T = unknown> extends Error {
  public statusCode: number;
  public message: string;
  public errorCode?: string;
  public data?: T;

  /**
   * Create a new HttpException
   *
   * @param {number} statusCode HTTP status code (e.g. 404)
   * @param {string} message Human-readable error message
   * @param {{data?: T, errorCode?: string}} [options] Optional extra info
   */
  constructor(
    statusCode: number,
    message: string,
    options: {
      data?: T;
      errorCode?: string;
    } = {}
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = options.data;
    this.errorCode = options.errorCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpException);
    }
  }

  static BAD_REQUEST<T = unknown>(message: string, data?: T) {
    return new HttpException<T>(400, message, {
      data,
      errorCode: "BAD_REQUEST"
    });
  }

  static UNAUTHORIZED(message = "Unauthorized") {
    return new HttpException(401, message, { errorCode: "UNAUTHORIZED" });
  }

  static FORBIDDEN(message = "Forbidden") {
    return new HttpException(403, message, { errorCode: "FORBIDDEN" });
  }

  static NOT_FOUND(message = "Resource not found") {
    return new HttpException(404, message, { errorCode: "NOT_FOUND" });
  }

  static CONFLICT(message = "Conflict occurred") {
    return new HttpException(409, message, { errorCode: "CONFLICT" });
  }

  static INTERNAL<T>(message = "Internal server error", data?: T) {
    return new HttpException<T>(500, message, {
      data,
      errorCode: "INTERNAL_SERVER_ERROR"
    });
  }

  /**
   * Convert an arbitrary exception/throwable into an HttpException instance.
   * If the provided value is already an HttpException it is returned as-is.
   * Errors are converted into a 500 INTERNAL error containing the original
   * error name and stack in `data` when available.
   *
   * @param {unknown} exception The caught value to normalize
   * @returns {HttpException} Normalized HttpException
   */
  static from(exception: unknown): HttpException {
    if (exception instanceof HttpException) {
      return exception;
    }
    if (exception instanceof Error) {
      const { message, name, stack, cause } = exception;
      return new HttpException(500, message, {
        errorCode: name,
        data: {
          stack,
          cause
        }
      });
    }
    if (typeof exception === "object" && exception !== null && "message" in exception) {
      return this.INTERNAL(String(exception.message));
    }
    return this.INTERNAL(String(exception));
  }

  /**
   * Serialize the exception for JSON responses.
   * The returned shape is intended for API responses and contains
   * `success: false` plus the status, message and optional details.
   *
   * @returns {{success: false, statusCode: number, message: string, errorCode?: string, data?: T, stack?: string}}
   */
  toJSON(): {
    success: false;
    statusCode: number;
    message: string;
    errorCode?: string;
    data?: T;
    stack?: string;
  } {
    return {
      success: false,
      statusCode: this.statusCode,
      message: this.message,
      ...(this.errorCode && { errorCode: this.errorCode }),
      ...(this.data && { data: this.data }),
      ...(process.env.NODE_ENV === "development" && { stack: this.stack })
    };
  }
}

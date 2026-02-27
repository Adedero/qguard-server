/**
 * Converts any thrown value into a proper Error instance.
 * - Preserves original error via `cause`
 * - Handles nested `{ error }` shapes
 * - Handles AggregateError
 * - Safely stringifies circular objects
 * - Preserves name, stack, and common metadata
 */
export function toError(input: unknown, defaultMessage?: string): Error {
  // 1. Already an Error
  if (input instanceof Error) {
    return input;
  }

  // 2. Handle AggregateError explicitly
  if (input instanceof AggregateError) {
    return new AggregateError(
      input.errors.map((err) => toError(err, defaultMessage)),
      input.message,
      { cause: input }
    );
  }

  // 3. Handle common `{ error: ... }` wrapper pattern
  if (typeof input === "object" && input !== null && "error" in input) {
    return toError((input as { error: unknown }).error);
  }

  // 4. Extract message from object-like values
  if (isObjectWithMessage(input)) {
    const err = new Error(input.message, { cause: input });

    if (typeof input.name === "string") {
      err.name = input.name;
    }

    if (typeof input.stack === "string") {
      err.stack = input.stack;
    }

    copyCommonProps(input, err);

    return err;
  }

  // 5. Primitive handling
  if (input == null) {
    return new Error(`Unknown error (captured: ${input})`);
  }

  if (typeof input === "string") {
    return new Error(input);
  }

  if (typeof input === "number" || typeof input === "boolean") {
    return new Error(String(input));
  }

  if (defaultMessage) {
    return new Error(defaultMessage, { cause: input });
  }

  // 6. Safe stringify fallback
  return new Error(safeStringify(input), { cause: input });
}

/* ---------------- Helpers ---------------- */

function isObjectWithMessage(value: unknown): value is {
  message: string;
  name?: string;
  stack?: string;
  code?: unknown;
  status?: unknown;
} {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof (value as any).message === "string"
  );
}

function copyCommonProps(from: Record<string, unknown>, to: Error) {
  const knownProps = ["code", "status", "statusCode", "details"];

  for (const key of knownProps) {
    if (key in from) {
      (to as any)[key] = from[key];
    }
  }
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    try {
      return String(value);
    } catch {
      return "Unknown error (unserializable value)";
    }
  }
}

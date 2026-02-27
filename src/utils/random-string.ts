import { randomBytes } from "crypto";

export type RandomStringType =
  | "numeric"
  | "num"
  | "alphabetic"
  | "alpha"
  | "uppercase"
  | "alphanumeric"
  | "alphanum";

const CHAR_SETS = {
  numeric: "0123456789",
  num: "0123456789",
  alphabetic: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  alphanum: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
} as const;

const DEFAULT_STR_LENGTH = 16;

/**
 * Generates a cryptographically secure random character from the given charset
 * using rejection sampling to avoid modulo bias
 */
function getUnbiasedRandomChar(charset: string): string {
  const charsetLength = charset.length;

  // Handle edge cases
  if (charsetLength === 0) {
    throw new Error("Charset cannot be empty");
  }
  if (charsetLength === 1 && typeof charset[0] === "string") {
    return charset[0];
  }

  // Calculate bytes needed to represent any index in the charset
  const bytesNeeded = Math.ceil(Math.log2(charsetLength) / 8);

  // Calculate the largest valid value (multiple of charsetLength)
  const maxValidValue = Math.floor(256 ** bytesNeeded / charsetLength) * charsetLength;

  // Safety limit to prevent infinite loops (though extremely unlikely)
  const maxAttempts = 1000;
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;

    const bytes = randomBytes(bytesNeeded);
    let randomValue = 0;

    // Convert bytes to integer
    for (let i = 0; i < bytesNeeded; i++) {
      const byte = bytes[i];
      if (typeof byte !== "number") {
        // edge case; may never happen with crypto.randomBytes
        continue;
      }
      randomValue = (randomValue << 8) | byte;
    }

    // Accept value if it's within valid range (rejection sampling)
    if (randomValue < maxValidValue) {
      return charset[randomValue % charsetLength]!;
    }
  }

  // Fallback (should never happen with crypto.randomBytes)
  throw new Error("Failed to generate unbiased random character after max attempts");
}

/**
 * Generates a cryptographically secure random string
 *
 * @param lengthOrPattern - Either a number for length, or a pattern string where:
 *   - '9' = random digit
 *   - 'A' = random uppercase letter
 *   - 'a' = random letter (upper or lower)
 *   - Any other character is kept as-is
 * @param type - Character set to use (default: alphanumeric)
 * @returns Randomly generated string
 *
 * @example
 * randomString(16) // "aB3xK9mP2nQ7sL1v"
 * randomString(16, "numeric") // "4829371056283947"
 * randomString("99-AAA-999") // "42-XYZ-817"
 */
export function randomString(
  lengthOrPattern?: number | string,
  type: RandomStringType = "alphanumeric"
): string {
  // Handle pattern string
  if (typeof lengthOrPattern === "string") {
    return lengthOrPattern.replace(/[9aA]/g, (match) => {
      let charset = "";
      if (match === "9") charset = CHAR_SETS.numeric;
      else if (match === "A") charset = CHAR_SETS.uppercase;
      else if (match === "a") charset = CHAR_SETS.alphabetic;
      return getUnbiasedRandomChar(charset);
    });
  }

  // Handle length-based generation
  const length = lengthOrPattern ?? DEFAULT_STR_LENGTH;

  if (length <= 0) {
    throw new Error("Length must be greater than 0");
  }
  if (length > 10000) {
    throw new Error("Length too large (max 10000 for safety)");
  }

  const charset = CHAR_SETS[type];

  // Optimize: generate all random bytes at once
  const bytesNeeded = Math.ceil(Math.log2(charset.length) / 8);
  const totalBytes = bytesNeeded * length * 2; // *2 for rejection sampling buffer
  const randomBytesBuffer = randomBytes(totalBytes);

  let result = "";
  let byteOffset = 0;

  for (let i = 0; i < length; i++) {
    const charsetLength = charset.length;
    const maxValidValue = Math.floor(256 ** bytesNeeded / charsetLength) * charsetLength;

    // Try to get a valid character
    let found = false;
    while (byteOffset + bytesNeeded <= totalBytes && !found) {
      let randomValue = 0;

      for (let j = 0; j < bytesNeeded; j++) {
        randomValue = (randomValue << 8) | randomBytesBuffer[byteOffset + j]!;
      }

      byteOffset += bytesNeeded;

      if (randomValue < maxValidValue) {
        result += charset[randomValue % charsetLength];
        found = true;
      }
    }

    // Fallback if we ran out of buffer (shouldn't happen often)
    if (!found) {
      result += getUnbiasedRandomChar(charset);
    }
  }

  return result;
}

// Utility functions for common use cases
export function randomId(length: number = 16): string {
  return randomString(length, "alphanumeric");
}

export function randomNumeric(length: number = 6): string {
  return randomString(length, "numeric");
}

export function randomToken(length: number = 32): string {
  return randomString(length, "alphanumeric");
}

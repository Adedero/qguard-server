/**
 * Checks if a value is a valid ULID (Universally Unique Lexicographically Sortable Identifier).
 *
 * ULID Specification:
 * - 26 characters long
 * - Case-insensitive Base32 encoding (Crockford's Base32)
 * - Characters: 0-9, A-Z (excluding I, L, O, U to avoid confusion)
 * - Format: TTTTTTTTTTRRRRRRRRRRRRRRRR
 *   - T (10 chars): Timestamp (48 bits)
 *   - R (16 chars): Randomness (80 bits)
 * - Timestamp must be valid (not exceed max timestamp: 281474976710655 or 2^48-1)
 *
 * @example
 * isUlid("01ARZ3NDEKTSV4RRFFQ69G5FAV") // true
 * isUlid("01arz3ndektsv4rrffq69g5fav") // true (case-insensitive)
 * isUlid("01ARZ3NDEKTSV4RRFFQ69G5FA")  // false (too short)
 * isUlid("01ARZ3NDEKTSV4RRFFQ69G5FAVX") // false (too long)
 * isUlid("01ARZ3NDEKTSV4RRFFQ69G5FAI") // false (contains 'I')
 * isUlid("ZZZZZZZZZZZZZZZZZZZZZZZZZZ") // false (timestamp too large)
 */
export default function isULID(val: unknown): boolean {
  if (typeof val !== "string") {
    return false;
  }

  const trimmed = val.trim();

  // 1. Length check: Must be exactly 26 characters
  if (trimmed.length !== 26) {
    return false;
  }

  // 2. Character check: Only Crockford's Base32 alphabet
  // Valid chars: 0-9, A-Z (excluding I, L, O, U)
  // This is case-insensitive
  if (!/^[0-7]/.test(trimmed)) {
    return false;
  }
  const validCharsRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
  if (!validCharsRegex.test(trimmed)) {
    return false;
  }

  // 3. Timestamp validation: First 10 characters represent timestamp
  // Maximum valid timestamp is 7ZZZZZZZZZ (281474976710655 in decimal)
  const timestampPart = trimmed.substring(0, 10).toUpperCase();

  if (timestampPart === "0000000000") return false;
  // Check if timestamp exceeds maximum value
  // The maximum ULID timestamp is "7ZZZZZZZZZ"
  if (timestampPart > "7ZZZZZZZZZ") {
    return false;
  }

  return true;
}

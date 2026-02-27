/**
 * Checks if a value is a valid phone number string.
 * * Validation Rules:
 * 1. Must be a string.
 * 2. Can contain allowed formatting chars: spaces, dashes, dots, parentheses.
 * 3. Must have between 7 and 15 digits (E.164 standard).
 * 4. Can start with '+' (but '+' cannot appear elsewhere).
 * * @example
 * isPhoneNumber("+1 (555) 123-4567") // true
 * isPhoneNumber("123-4567")          // true
 * isPhoneNumber("abc-1234")          // false
 */

export default function isPhoneNumber(val: unknown): boolean {
  if (typeof val !== "string") return false;

  const trimmed = val.trim();
  if (!trimmed) return false;

  // Only allow digits and common formatting characters
  if (/[^0-9+\s\-().]/.test(trimmed)) return false;

  // '+' may only appear once and only at the start
  if ((trimmed.match(/\+/g)?.length ?? 0) > 1) return false;
  if (trimmed.includes("+") && !trimmed.startsWith("+")) return false;

  // Remove formatting characters
  const cleanNumber = trimmed.replace(/[\s\-().]/g, "");

  // E.164: optional '+' followed by 7–15 digits
  return /^(\+)?\d{7,15}$/.test(cleanNumber);
}

import crypto from "node:crypto";

/**
 * Generates a SHA256 hash for the given content.
 * @param {string} content The input string to hash.
 * @returns {string} The SHA256 hash in hexadecimal format.
 */
export function sha256(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

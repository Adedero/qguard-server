export function isUploadPathValid(input: string): boolean {
  if (!input) return false;

  // Disallow traversal
  if (input.includes("..")) return false;

  // Disallow absolute paths or protocols
  if (input.startsWith("/") || input.includes("://")) return false;

  // Allow letters, numbers, dash, underscore, slash
  return /^[a-zA-Z0-9/_-]+$/.test(input);
}

/**
 * Checks if a string is an Argon2 hash.
 * Format: $argon2{type}$v={version}$m={memory},t={iterations},p={parallelism}${salt}${hash}
 */
export const isHash = (val: unknown): boolean => {
  if (typeof val !== "string") return false;

  const trimmed = val.trim();
  if (!trimmed) return false;

  const bcryptRegex = /^\$2[aby]\$\d{2}\$.{53}$/;
  return bcryptRegex.test(trimmed);

  // const argon2Regex =
  //   /^\$argon2(id|i|d)\$v=\d+\$m=\d+,t=\d+,p=\d+\$[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+$/;

  // return argon2Regex.test(trimmed);
};

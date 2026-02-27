/**
 * Checks if a string appears to be a hashed value.
 * Supports: Bcrypt, Argon2, PBKDF2, SHA-256, SHA-512, MD5.
 * NOTE: This does NOT verify the hash or its security.
 */
export default function isHash(val: unknown): boolean {
  if (typeof val !== "string") return false;

  // 1. Bcrypt
  const bcryptRegex = /^\$2[abxy]\$.{56}$/;
  if (bcryptRegex.test(val)) return true;

  // 2. Argon2
  const argon2Regex = /^\$(argon2i|argon2d|argon2id)\$v=\d+\$m=\d+,t=\d+,p=\d+\$.+/;
  if (argon2Regex.test(val)) return true;

  // 3. PBKDF2
  const pbkdf2Regex = /^pbkdf2_.+/;
  if (pbkdf2Regex.test(val)) return true;

  // 4. SHA-256 (hex)
  const sha256Regex = /^[a-f0-9]{64}$/i;
  if (sha256Regex.test(val)) return true;

  // 5. SHA-512 (hex)
  const sha512Regex = /^[a-f0-9]{128}$/i;
  if (sha512Regex.test(val)) return true;

  // 6. MD5 (hex, legacy)
  const md5Regex = /^[a-f0-9]{32}$/i;
  if (md5Regex.test(val)) return true;

  return false;
}

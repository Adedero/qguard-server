/**
 * Check if a file's MIME type or extension is allowed
 * @param ext file extension without dot (e.g., "jpg")
 * @param mime file MIME type (e.g., "image/jpeg")
 * @param allowedTypes array of allowed extensions or MIME types (e.g., ["jpg", "png", "image/gif"])
 */
export function isFileTypeAllowed(
  ext?: string,
  mime?: string,
  allowedTypes: string[] = []
): boolean {
  if (!allowedTypes || allowedTypes.length === 0) return true;

  const normalizedExt = ext?.toLowerCase();
  const normalizedMime = mime?.toLowerCase();

  return allowedTypes.some((type) => {
    const t = type.toLowerCase().trim();

    // 1. Exact MIME match
    if (normalizedMime && t === normalizedMime) return true;

    // 2. Exact extension match (with or without dot)
    if (normalizedExt) {
      if (t.startsWith(".")) {
        if (`.${normalizedExt}` === t) return true;
      } else {
        if (normalizedExt === t) return true;
      }
    }

    // 3. Wildcard MIME (image/*)
    if (t.endsWith("/*") && normalizedMime) {
      const base = t.slice(0, -2);
      if (normalizedMime.startsWith(base + "/")) return true;
    }

    return false;
  });
}

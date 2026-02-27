/**
 * Checks if a value is a valid IANA time zone string (e.g. "America/New_York", "UTC").
 */
export default function isTimeZone(val: unknown): boolean {
  if (typeof val !== "string" || !val) {
    return false;
  }

  try {
    Intl.DateTimeFormat(undefined, { timeZone: val });
    return true;
  } catch (error) {
    return false;
  }
}

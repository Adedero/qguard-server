/**
 * Picks specific keys from an object and returns a new object with only those keys.
 * * @param obj - The source object.
 * @param keys - An array of keys to extract.
 * @returns A new object containing only the picked keys.
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  // Create the result object cast to the return type
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    // Runtime safety: ensure key actually exists on object before assignment
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }

  return result;
}

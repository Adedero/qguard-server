/**
 * Creates a shallow copy of the object and removes the specified keys.
 * * @param obj - The source object.
 * @param keys - An array of keys to exclude.
 * @returns A new object with the specified keys removed.
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  // 1. Create a shallow copy to avoid mutating the original object
  const result = { ...obj };

  // 2. Iterate and delete
  for (const key of keys) {
    delete result[key];
  }

  // 3. Cast the result to the narrowed type
  return result as Omit<T, K>;
}

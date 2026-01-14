/**
 * Recursively converts an array of keys into a deeply nested object with the provided value.
 *
 * The value is placed at the deepest level, with each key creating a new nested level.
 * Used to convert flat tag arrays into nested token structures.
 *
 * @param keys Array of keys to create nesting levels with
 * @param value The value to place at the deepest level
 * @returns A nested object structure
 *
 * @example
 * ```ts
 * keysToObj(["blue", "dark", "1"], { value: "#0000ff" })
 * // => { blue: { dark: { 1: { value: "#0000ff" } } } }
 *
 * keysToObj(["gray"], { value: "#666666" })
 * // => { gray: { value: "#666666" } }
 *
 * keysToObj([], { value: "#ffffff" })
 * // => { value: "#ffffff" }
 * ```
 *
 * @internal
 */
export function keysToObj(keys: string[], value: any): any {
  if (keys.length === 0) return value;

  const key = keys[0];
  const obj: any = keysToObj(keys.slice(1), value);

  return { [key]: obj };
}

/**
 * Type guard to check if a value is a plain object (not null, undefined, array, or primitive).
 *
 * Used for safe recursive object merging to avoid treating arrays and functions as objects.
 *
 * @param value The value to check
 * @returns True if value is a plain object, false otherwise
 *
 * @example
 * ```ts
 * isObject({}) // => true
 * isObject(null) // => false
 * isObject([]) // => false
 * isObject("string") // => false
 * ```
 *
 * @internal
 */
export function isObject(value: any): boolean {
  return (
    value !== null &&
    value !== undefined &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

/**
 * Recursively merges multiple source objects into a target object.
 *
 * Nested objects are deeply merged, while primitive values are overridden.
 * This is essential for combining token definitions from multiple color scales
 * into a single semantic token structure.
 *
 * @param target The target object to merge into
 * @param sources Variable number of source objects to merge from
 * @returns The merged target object
 *
 * @example
 * ```ts
 * mergeObjs(
 *   { blue: { 1: { value: "#0000ff" } } },
 *   { blue: { 2: { value: "#0000cc" } } },
 *   { red: { 1: { value: "#ff0000" } } }
 * )
 * // => {
 * //   blue: {
 * //     1: { value: "#0000ff" },
 * //     2: { value: "#0000cc" }
 * //   },
 * //   red: { 1: { value: "#ff0000" } }
 * // }
 * ```
 *
 * @internal
 */
export function mergeObjs(target: any, ...sources: any[]): any {
  if (!sources.length) return target;

  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });

        mergeObjs(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeObjs(target, ...sources);
}

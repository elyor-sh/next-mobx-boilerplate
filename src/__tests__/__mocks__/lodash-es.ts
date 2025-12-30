/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Mock for lodash-es to avoid ES module issues in Jest
 */

export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== "object" || typeof b !== "object") return false;

  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!isEqual((a as any)[key], (b as any)[key])) return false;
  }

  return true;
}

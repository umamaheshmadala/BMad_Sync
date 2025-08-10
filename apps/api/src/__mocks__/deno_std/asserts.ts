export function assert(condition: unknown, message?: string): void {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

export function assertEquals<T>(actual: T, expected: T, message?: string): void {
  // Use Jest's expect under the hood for richer diffs when available
  // Fallback to strict check if expect is not present
  if (typeof (globalThis as any).expect === "function") {
    (globalThis as any).expect(actual).toEqual(expected);
  } else if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(message || `Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
  }
}

export function assertStrictEquals<T>(actual: T, expected: T, message?: string): void {
  if (typeof (globalThis as any).expect === "function") {
    (globalThis as any).expect(actual).toBe(expected);
  } else if (actual !== expected) {
    throw new Error(message || `Expected ${String(actual)} to strictly equal ${String(expected)}`);
  }
}




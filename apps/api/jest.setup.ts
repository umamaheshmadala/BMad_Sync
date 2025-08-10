// Polyfill minimal Deno globals used in tests
if (!(globalThis as any).Deno) {
  (globalThis as any).Deno = {} as any;
}

if (typeof (globalThis as any).Deno.env === 'undefined') {
  (globalThis as any).Deno.env = {} as any;
}

if (typeof (globalThis as any).Deno.env.toObject !== 'function') {
  (globalThis as any).Deno.env.toObject = () => ({ ...process.env });
}

(globalThis as any).Deno.env.get = (key: string) => {
  try {
    const envObj = (globalThis as any).Deno.env.toObject?.();
    if (envObj && typeof envObj === 'object' && key in envObj) {
      return envObj[key];
    }
  } catch {
    // ignore and fallback
  }
  return (process.env as any)[key];
};

// Map Deno.test to Jest's test function for compatibility with Deno-style tests
if (typeof (globalThis as any).Deno.test !== 'function') {
  (globalThis as any).Deno.test = (name: string, fn: () => unknown | Promise<unknown>) => {
    (globalThis as any).test(name, fn as any);
  };
}



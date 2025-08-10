type Func<TArgs extends any[] = any[], TReturn = any> = (...args: TArgs) => TReturn;

export function stub<T extends object, K extends keyof T>(obj: T, key: K, impl: T[K] extends Func ? T[K] : any): void {
  const original = obj[key] as any;
  (stubbedRegistry as any).push({ obj, key, original });
  (obj as any)[key] = impl as any;
}

export function restore(): void {
  while (stubbedRegistry.length) {
    const { obj, key, original } = stubbedRegistry.pop()!;
    (obj as any)[key] = original;
  }
}

const stubbedRegistry: Array<{ obj: any; key: PropertyKey; original: any }> = [];




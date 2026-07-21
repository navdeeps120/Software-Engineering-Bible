export interface SebObject {
  own: Map<PropertyKey, unknown>;
  prototype: SebObject | null;
}

export function createObject(prototype: SebObject | null = null): SebObject {
  return { own: new Map(), prototype };
}

export function getProperty(object: SebObject, key: PropertyKey): unknown {
  let current: SebObject | null = object;
  const visited = new Set<SebObject>();
  while (current !== null) {
    if (visited.has(current)) throw new TypeError("prototype cycle detected");
    visited.add(current);
    if (current.own.has(key)) return current.own.get(key);
    current = current.prototype;
  }
  return undefined;
}

export function setProperty(object: SebObject, key: PropertyKey, value: unknown): void {
  object.own.set(key, value);
}

export function instanceOf(object: SebObject, constructorPrototype: SebObject): boolean {
  let current = object.prototype;
  while (current !== null) {
    if (current === constructorPrototype) return true;
    current = current.prototype;
  }
  return false;
}

type Constructor<T extends object, A extends unknown[]> = (this: T, ...args: A) => void | object;

export function construct<T extends object, A extends unknown[]>(
  constructor: Constructor<T, A>,
  prototype: object,
  ...args: A
): T {
  const instance = Object.create(prototype) as T;
  const result = constructor.apply(instance, args);
  return (typeof result === "object" && result !== null ? result : instance) as T;
}

export function bind<TThis, A extends unknown[], R>(
  fn: (this: TThis, ...args: A) => R,
  thisArg: TThis,
  ...bound: Partial<A>
): (...rest: unknown[]) => R {
  return (...rest: unknown[]) => fn.apply(thisArg, [...bound, ...rest] as A);
}

export type Primitive = null | undefined | string | number | bigint | boolean | symbol;

export function isPrimitive(value: unknown): value is Primitive {
  return value === null || (typeof value !== "object" && typeof value !== "function");
}

export function toPrimitive(
  input: object,
  hint: "default" | "number" | "string" = "default",
): Primitive {
  const exotic = (input as { [Symbol.toPrimitive]?: (hint: string) => unknown })[
    Symbol.toPrimitive
  ];
  if (exotic !== undefined) {
    const result = exotic.call(input, hint);
    if (!isPrimitive(result)) throw new TypeError("@@toPrimitive must return a primitive");
    return result;
  }

  const order = hint === "string" ? ["toString", "valueOf"] : ["valueOf", "toString"];
  for (const name of order) {
    const method = (input as Record<string, unknown>)[name];
    if (typeof method === "function") {
      const result = method.call(input);
      if (isPrimitive(result)) return result;
    }
  }
  throw new TypeError("Cannot convert object to primitive value");
}

export function toNumber(value: unknown): number {
  if (typeof value === "bigint" || typeof value === "symbol") {
    throw new TypeError(`Cannot convert ${typeof value} to number`);
  }
  if (typeof value === "object" && value !== null) return toNumber(toPrimitive(value, "number"));
  return Number(value);
}

export function abstractEqual(left: unknown, right: unknown): boolean {
  if (typeof left === typeof right) return Object.is(left, right) || left === right;
  if ((left === null && right === undefined) || (left === undefined && right === null)) return true;
  if (typeof left === "number" && typeof right === "string") return abstractEqual(left, toNumber(right));
  if (typeof left === "string" && typeof right === "number") return abstractEqual(toNumber(left), right);
  if (typeof left === "boolean") return abstractEqual(toNumber(left), right);
  if (typeof right === "boolean") return abstractEqual(left, toNumber(right));
  if (typeof left === "object" && left !== null && isPrimitive(right)) {
    return abstractEqual(toPrimitive(left), right);
  }
  if (typeof right === "object" && right !== null && isPrimitive(left)) {
    return abstractEqual(left, toPrimitive(right));
  }
  return false;
}

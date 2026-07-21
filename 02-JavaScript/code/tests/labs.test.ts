import { describe, expect, it, vi } from "vitest";
import { abstractEqual, toNumber, toPrimitive } from "../src/coercion.js";
import {
  bind,
  construct,
  createObject,
  getProperty,
  instanceOf,
  setProperty,
} from "../src/object-model.js";
import { SebPromise } from "../src/promise.js";
import { EventEmitter } from "../src/event-emitter.js";
import { mapLimit } from "../src/concurrency.js";
import { ModuleGraph } from "../src/module-graph.js";
import { effect, reactive } from "../src/reactive.js";

describe("coercion", () => {
  it("follows primitive hooks and simplified equality", () => {
    const value = { valueOf: () => 7 };
    expect(toPrimitive(value, "number")).toBe(7);
    expect(toNumber(" 42 ")).toBe(42);
    expect(abstractEqual("1", 1)).toBe(true);
    expect(abstractEqual(null, undefined)).toBe(true);
    expect(abstractEqual(false, 0)).toBe(true);
  });

  it("rejects non-primitive conversion results", () => {
    expect(() =>
      toPrimitive({ valueOf: () => ({}), toString: () => ({}) } as object),
    ).toThrow(TypeError);
  });
});

describe("object model", () => {
  it("looks up inherited properties", () => {
    const root = createObject();
    setProperty(root, "kind", "root");
    const child = createObject(root);
    expect(getProperty(child, "kind")).toBe("root");
    expect(instanceOf(child, root)).toBe(true);
  });

  it("teaches new and bind mechanics", () => {
    const prototype = { greet() { return "hello"; } };
    function Person(this: { name: string }, name: string): void {
      this.name = name;
    }
    const person = construct(Person, prototype, "Ada");
    expect(person.name).toBe("Ada");
    const add = function (this: { base: number }, n: number) {
      return this.base + n;
    };
    expect(bind(add, { base: 2 }, 3)()).toBe(5);
  });
});

describe("SebPromise", () => {
  it("chains asynchronously and assimilates thenables", async () => {
    const order: string[] = [];
    const promise = SebPromise.resolve(2).then((value) => {
      order.push("reaction");
      return value * 3;
    });
    order.push("sync");
    await expect(promise).resolves.toBe(6);
    expect(order).toEqual(["sync", "reaction"]);
  });

  it("propagates rejection and catches executor errors", async () => {
    const promise = new SebPromise<number>(() => {
      throw new Error("boom");
    }).catch((error) => (error as Error).message.length);
    await expect(promise).resolves.toBe(4);
  });
});

describe("EventEmitter", () => {
  it("supports on, once, off, and isolated errors", () => {
    type Events = { data: number };
    const emitter = new EventEmitter<Events>();
    const values: number[] = [];
    const off = emitter.on("data", (value) => values.push(value));
    emitter.once("data", () => {
      throw new Error("listener failure");
    });
    expect(emitter.emit("data", 1)).toHaveLength(1);
    expect(emitter.emit("data", 2)).toHaveLength(0);
    off();
    expect(values).toEqual([1, 2]);
  });
});

describe("mapLimit", () => {
  it("preserves order and bounds active operations", async () => {
    let active = 0;
    let maximum = 0;
    const result = await mapLimit([1, 2, 3, 4], 2, async (value) => {
      active++;
      maximum = Math.max(maximum, active);
      await Promise.resolve();
      active--;
      return value * 2;
    });
    expect(result).toEqual([2, 4, 6, 8]);
    expect(maximum).toBeLessThanOrEqual(2);
  });
});

describe("ModuleGraph", () => {
  it("orders dependencies and reports cycles", () => {
    const graph = new ModuleGraph();
    graph.add({ id: "shared", dependencies: [] });
    graph.add({ id: "feature", dependencies: ["shared"] });
    graph.add({ id: "app", dependencies: ["feature"] });
    expect(graph.loadOrder("app")).toEqual(["shared", "feature", "app"]);

    const cyclic = new ModuleGraph();
    cyclic.add({ id: "a", dependencies: ["b"] });
    cyclic.add({ id: "b", dependencies: ["a"] });
    expect(() => cyclic.loadOrder("a")).toThrow("cycle");
  });
});

describe("reactivity", () => {
  it("reruns an effect after a tracked property changes", async () => {
    const state = reactive({ count: 0 });
    const seen: number[] = [];
    effect(() => seen.push(state.count));
    state.count = 1;
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));
    expect(seen).toEqual([0, 1]);
  });
});

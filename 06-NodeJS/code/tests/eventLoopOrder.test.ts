import { describe, expect, it } from "vitest";
import { recordSchedulingOrder } from "../src/eventLoopOrder.js";

describe("recordSchedulingOrder", () => {
  it("orders promise microtasks before nextTick (ESM module-evaluation quirk), and setImmediate before a same-cycle setTimeout", async () => {
    const order = await recordSchedulingOrder();
    // In a CommonJS script's true top level, nextTick would win. Here it
    // does not, because this module (and the ESM loader that evaluated it)
    // is itself driven by a Promise chain — see the doc comment in
    // eventLoopOrder.ts for the full mechanism.
    expect(order).toEqual(["sync:start", "sync:end", "promise", "nextTick", "setImmediate", "setTimeout"]);
  });

  it("is deterministic across repeated runs", async () => {
    const first = await recordSchedulingOrder();
    const second = await recordSchedulingOrder();
    expect(second).toEqual(first);
  });
});

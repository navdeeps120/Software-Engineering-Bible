/**
 * eventLoopOrder.ts
 *
 * Teaches the *relative* ordering of Node's scheduling primitives:
 *
 *   1. `process.nextTick()`   — Node's own callback queue, drained by
 *      `processTicksAndRejections()`.
 *   2. Promise microtasks    — V8's microtask queue, drained by the same
 *      function via an explicit `runMicrotasks()` call.
 *   3. `setImmediate()`      — runs in the "check" phase of the event loop.
 *   4. `setTimeout(fn, 0)`   — runs in the "timers" phase.
 *
 * ## The nextTick vs. Promise gotcha this lab documents
 *
 * The commonly repeated claim "`process.nextTick()` always runs before
 * Promise microtasks" is only true when the scheduling call happens
 * *outside* of any currently-draining microtask job — e.g. directly in a
 * CommonJS script's top-level, synchronous code. Node's internal loop is
 * roughly:
 *
 * ```js
 * do {
 *   while (nextTickQueue.length) runOneNextTickCallback();
 *   runMicrotasks(); // a single V8 call that drains ALL microtasks,
 *                     // including ones enqueued *while* it is running
 * } while (nextTickQueue.length);
 * ```
 *
 * If you call `process.nextTick()` *from inside* a microtask that is
 * already executing (any `.then()` callback, or any code after an `await`,
 * or — critically for this lab — **any top-level code in an ES module**,
 * because ESM module evaluation is itself driven by the loader's internal
 * Promise chain), your new nextTick callback cannot preempt the
 * `runMicrotasks()` call already in progress. A `Promise.resolve().then()`
 * registered at the same moment *does* join that in-progress drain and
 * therefore runs first. Once `runMicrotasks()` finally returns, control
 * goes back to the outer `do/while`, which is only then able to run the
 * queued nextTick callback.
 *
 * This is why this module's exported order is:
 * `["sync:start", "sync:end", "promise", "nextTick", "setImmediate", "setTimeout"]`
 * — the reverse of the CJS-textbook order — and it is fully deterministic
 * *for this package* (`"type": "module"`, consumed as ESM by every test).
 * You can flip it back by copy-pasting the same scheduling calls into a
 * plain CommonJS script's true top level.
 *
 * The `setImmediate` vs. `setTimeout(fn, 0)` ordering is a *separate*,
 * well-known non-determinism: at a module's top level it depends on timer
 * precision, but it becomes deterministic once both are scheduled from
 * inside a real I/O completion callback (Node's poll phase hands off to
 * check/setImmediate before wrapping around to timers/setTimeout). This lab
 * pins that by scheduling both from inside an `fs.readFile` completion.
 * https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export type SchedulingLabel =
  | "sync:start"
  | "sync:end"
  | "nextTick"
  | "promise"
  | "setImmediate"
  | "setTimeout";

/**
 * Runs one deterministic round of scheduling and returns the labels in the
 * order their callbacks actually executed.
 *
 * Expected (and asserted in tests) order, given this module is ESM:
 *   ["sync:start", "sync:end", "promise", "nextTick", "setImmediate", "setTimeout"]
 */
export async function recordSchedulingOrder(): Promise<SchedulingLabel[]> {
  const order: SchedulingLabel[] = [];
  order.push("sync:start");

  const finished = new Promise<void>((resolve) => {
    let remaining = 4; // nextTick, promise, setImmediate, setTimeout
    const mark = (label: SchedulingLabel): void => {
      order.push(label);
      remaining -= 1;
      if (remaining === 0) resolve();
    };

    // Both queued here, in this order — yet `promise` wins, because this
    // whole function body is itself running as ESM module-graph-driven code
    // (see the module doc comment above for why that flips the "textbook"
    // nextTick-before-promise ordering).
    process.nextTick(() => mark("nextTick"));
    Promise.resolve().then(() => mark("promise"));

    // Reading this very module's source is a real (fast) I/O operation.
    // Scheduling setImmediate/setTimeout from inside its completion callback
    // pins both to the same poll -> check -> timers hand-off, which is the
    // one context where their relative order is spec-guaranteed.
    void readFile(fileURLToPath(import.meta.url)).then(() => {
      setTimeout(() => mark("setTimeout"), 0);
      setImmediate(() => mark("setImmediate"));
    });
  });

  order.push("sync:end");
  await finished;
  return order;
}

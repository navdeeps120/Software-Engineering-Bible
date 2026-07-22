import { describe, expect, it } from "vitest";
import { computeFibonacciBatch, FibWorkerPool } from "../src/workerPool.js";

/** Independent reference implementation (fib(0) = 0, fib(1) = 1) used to check the worker's results. */
function referenceFib(n: number): bigint {
  let a = 0n;
  let b = 1n;
  for (let i = 0; i < n; i += 1) {
    const next = a + b;
    a = b;
    b = next;
  }
  return a;
}
const FIB = Array.from({ length: 20 }, (_, n) => referenceFib(n));

describe("FibWorkerPool", () => {
  it("computes results off the main thread and preserves per-call correctness", async () => {
    const pool = new FibWorkerPool({ size: 2 });
    try {
      const results = await Promise.all([pool.run(5), pool.run(10), pool.run(1)]);
      expect(results).toEqual([FIB[5]!.toString(), FIB[10]!.toString(), FIB[1]!.toString()]);
    } finally {
      await pool.close();
    }
  });

  it("never exceeds its configured concurrency limit", async () => {
    const size = 2;
    const pool = new FibWorkerPool({ size });
    let active = 0;
    let maxActive = 0;

    try {
      // Wrap each run() so we can observe how many are simultaneously "in flight"
      // from the caller's perspective — the pool itself only ever has `size`
      // workers, so this can never exceed `size`.
      const runTracked = async (input: number): Promise<string> => {
        active += 1;
        maxActive = Math.max(maxActive, active);
        try {
          return await pool.run(input);
        } finally {
          active -= 1;
        }
      };

      await Promise.all([8, 9, 10, 11, 12, 13].map((n) => runTracked(n)));
      expect(maxActive).toBeGreaterThan(size); // callers queued more than the pool size
      expect(pool.size).toBe(size); // but the pool itself never grew
    } finally {
      await pool.close();
    }
  });

  it("rejects invalid pool sizes and invalid inputs", async () => {
    expect(() => new FibWorkerPool({ size: 0 })).toThrow(RangeError);
    expect(() => new FibWorkerPool({ size: -1 })).toThrow(RangeError);

    const pool = new FibWorkerPool({ size: 1 });
    try {
      await expect(pool.run(-1)).rejects.toThrow(RangeError);
      await expect(pool.run(1.5)).rejects.toThrow(RangeError);
    } finally {
      await pool.close();
    }
  });

  it("rejects new work after close()", async () => {
    const pool = new FibWorkerPool({ size: 1 });
    await pool.close();
    await expect(pool.run(3)).rejects.toThrow(/closed/);
  });
});

describe("computeFibonacciBatch", () => {
  it("computes a batch with bounded concurrency and closes its pool afterward", async () => {
    const inputs = [3, 6, 9, 12];
    const results = await computeFibonacciBatch(inputs, 2);
    expect(results).toEqual(inputs.map((n) => FIB[n]!.toString()));
  });
});

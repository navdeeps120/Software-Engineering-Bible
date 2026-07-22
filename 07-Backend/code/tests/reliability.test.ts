import { describe, expect, it, vi } from "vitest";
import { fullJitterDelay, IdempotencyStore, retryWithJitter, RetryExhaustedError, TimeoutError, withTimeout } from "../src/reliability.js";

describe("withTimeout", () => {
  it("resolves with the underlying value when it settles before the deadline", async () => {
    await expect(withTimeout(Promise.resolve("ok"), 50)).resolves.toBe("ok");
  });

  it("rejects with TimeoutError when the promise never settles before the deadline, using an injected timer", () => {
    let scheduled: (() => void) | undefined;
    const fakeSetTimeout = ((handler: () => void) => {
      scheduled = handler;
      return 1 as unknown as ReturnType<typeof setTimeout>;
    }) as typeof setTimeout;
    const fakeClearTimeout = (() => {}) as typeof clearTimeout;

    const never = new Promise<string>(() => {}); // deliberately never settles
    const result = withTimeout(never, 10, { setTimeoutFn: fakeSetTimeout, clearTimeoutFn: fakeClearTimeout });
    scheduled?.(); // fire the deadline synchronously and deterministically, no real timers involved

    return expect(result).rejects.toBeInstanceOf(TimeoutError);
  });

  it("propagates the underlying rejection reason unchanged when it rejects before the deadline", async () => {
    await expect(withTimeout(Promise.reject(new Error("boom")), 50)).rejects.toThrow("boom");
  });

  it("validates ms", () => {
    expect(() => withTimeout(Promise.resolve(1), 0)).toThrow(RangeError);
    expect(() => withTimeout(Promise.resolve(1), -5)).toThrow(RangeError);
  });
});

describe("fullJitterDelay", () => {
  it("is bounded by min(maxDelayMs, baseDelayMs * 2^(attempt-1))", () => {
    const random = () => 0.999999;
    expect(fullJitterDelay(1, 100, 10_000, random)).toBeLessThanOrEqual(100);
    expect(fullJitterDelay(2, 100, 10_000, random)).toBeLessThanOrEqual(200);
    expect(fullJitterDelay(10, 100, 1_000, random)).toBeLessThanOrEqual(1_000); // capped by maxDelayMs
  });

  it("is deterministic for a fixed random() source", () => {
    const random = () => 0.5;
    expect(fullJitterDelay(3, 100, 10_000, random)).toBe(Math.floor(0.5 * 400));
  });

  it("rejects a non-positive attempt", () => {
    expect(() => fullJitterDelay(0, 100, 1_000)).toThrow(RangeError);
  });
});

describe("retryWithJitter", () => {
  it("returns the result on the first successful attempt without sleeping", async () => {
    const sleep = vi.fn(async () => {});
    const result = await retryWithJitter(async () => "ok", {
      attempts: 3,
      baseDelayMs: 10,
      maxDelayMs: 100,
      sleep,
    });
    expect(result).toBe("ok");
    expect(sleep).not.toHaveBeenCalled();
  });

  it("retries a retryable failure and eventually succeeds", async () => {
    let calls = 0;
    const sleep = vi.fn(async () => {});
    const result = await retryWithJitter(
      async () => {
        calls += 1;
        if (calls < 3) throw new Error("transient");
        return "ok";
      },
      { attempts: 5, baseDelayMs: 10, maxDelayMs: 100, sleep, random: () => 0 },
    );
    expect(result).toBe("ok");
    expect(calls).toBe(3);
    expect(sleep).toHaveBeenCalledTimes(2);
  });

  it("throws RetryExhaustedError after exhausting all attempts on a retryable error", async () => {
    const sleep = vi.fn(async () => {});
    await expect(
      retryWithJitter(
        async () => {
          throw new Error("always fails");
        },
        { attempts: 3, baseDelayMs: 10, maxDelayMs: 100, sleep, random: () => 0 },
      ),
    ).rejects.toBeInstanceOf(RetryExhaustedError);
    expect(sleep).toHaveBeenCalledTimes(2); // slept between attempts 1->2 and 2->3, not after the last failure
  });

  it("re-throws immediately for a non-retryable error, without sleeping or exhausting attempts", async () => {
    const sleep = vi.fn(async () => {});
    let calls = 0;
    await expect(
      retryWithJitter(
        async () => {
          calls += 1;
          throw new Error("terminal");
        },
        { attempts: 5, baseDelayMs: 10, maxDelayMs: 100, sleep, isRetryable: () => false },
      ),
    ).rejects.toThrow("terminal");
    expect(calls).toBe(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it("validates attempts", async () => {
    await expect(retryWithJitter(async () => "x", { attempts: 0, baseDelayMs: 1, maxDelayMs: 1 })).rejects.toThrow(RangeError);
  });
});

describe("IdempotencyStore", () => {
  it("returns undefined for a never-set key", () => {
    const store = new IdempotencyStore<string>();
    expect(store.get("missing")).toBeUndefined();
  });

  it("setOnce records a value retrievable via get()", () => {
    const store = new IdempotencyStore<string>();
    store.setOnce("key-1", "result-1");
    expect(store.get("key-1")).toBe("result-1");
  });

  it("setOnce throws on a second call for the same (unexpired) key", () => {
    const store = new IdempotencyStore<string>();
    store.setOnce("key-1", "result-1");
    expect(() => store.setOnce("key-1", "result-2")).toThrow();
  });

  it("expires records after ttlMs using the injected clock", () => {
    let now = 0;
    const store = new IdempotencyStore<string>({ ttlMs: 100, now: () => now });
    store.setOnce("key-1", "result-1");
    now = 100;
    expect(store.get("key-1")).toBeUndefined();
  });

  it("getOrCompute runs compute() exactly once for concurrent callers racing the same key (singleflight)", async () => {
    const store = new IdempotencyStore<number>();
    let computeCalls = 0;
    let resolveCompute!: (value: number) => void;
    const compute = () =>
      new Promise<number>((resolve) => {
        computeCalls += 1;
        resolveCompute = resolve;
      });

    const first = store.getOrCompute("charge-1", compute);
    const second = store.getOrCompute("charge-1", compute); // races in before the first resolves
    expect(computeCalls).toBe(1); // second call joined the in-flight promise instead of calling compute() again

    resolveCompute(42);
    await expect(first).resolves.toBe(42);
    await expect(second).resolves.toBe(42);
    expect(store.get("charge-1")).toBe(42);
  });

  it("getOrCompute replays the cached value on a later call without invoking compute() again", async () => {
    const store = new IdempotencyStore<number>();
    let computeCalls = 0;
    await store.getOrCompute("charge-1", async () => {
      computeCalls += 1;
      return 1;
    });
    await store.getOrCompute("charge-1", async () => {
      computeCalls += 1;
      return 2;
    });
    expect(computeCalls).toBe(1);
  });

  it("validates ttlMs", () => {
    expect(() => new IdempotencyStore({ ttlMs: 0 })).toThrow(RangeError);
  });
});

import { describe, expect, it } from "vitest";
import { JobQueue, type JobQueueOptions } from "../src/jobQueue.js";

function immediateQueue(overrides: Partial<JobQueueOptions> = {}): JobQueue {
  return new JobQueue({ concurrency: 2, sleep: async () => {}, retryDelayMs: () => 0, ...overrides });
}

describe("JobQueue", () => {
  it("processes an enqueued job with its registered handler", async () => {
    const queue = immediateQueue();
    const seen: unknown[] = [];
    queue.register<string>("greet", async (job) => {
      seen.push(job.payload);
    });

    queue.enqueue("greet", "world");
    await queue.onIdle();

    expect(seen).toEqual(["world"]);
    expect(queue.results).toEqual([{ id: "job_1", type: "greet", status: "succeeded", attempts: 1 }]);
  });

  it("respects the concurrency limit: no more than N jobs run at once", async () => {
    const queue = new JobQueue({ concurrency: 2, sleep: async () => {} });
    let concurrentNow = 0;
    let maxConcurrent = 0;
    const pendingResolvers: Array<() => void> = [];

    queue.register<number>("slow", async () => {
      concurrentNow += 1;
      maxConcurrent = Math.max(maxConcurrent, concurrentNow);
      await new Promise<void>((resolve) => pendingResolvers.push(resolve));
      concurrentNow -= 1;
    });

    queue.enqueue("slow", 1);
    queue.enqueue("slow", 2);
    queue.enqueue("slow", 3); // must wait: concurrency cap is 2

    // enqueue() dispatches synchronously up to each handler's first await,
    // so both concurrency-1 jobs have already registered their resolver by
    // the time the synchronous enqueue() calls above return.
    expect(queue.inFlight).toBe(2);
    expect(queue.pending).toBe(1);

    // Release jobs one at a time. Each release only *schedules* the
    // handler's continuation as a microtask, so give it a couple of ticks
    // to run, free its concurrency slot, and pump job 3 in (which pushes
    // its own resolver onto the same array) before releasing the next one.
    while (queue.inFlight > 0 || queue.pending > 0) {
      pendingResolvers.shift()?.();
      await Promise.resolve();
      await Promise.resolve();
    }

    await queue.onIdle();
    expect(maxConcurrent).toBeLessThanOrEqual(2);
    expect(queue.results).toHaveLength(3);
  });

  it("retries a failing job up to maxAttempts, then records it as failed", async () => {
    const queue = new JobQueue({ concurrency: 1, maxAttempts: 3, sleep: async () => {}, retryDelayMs: () => 0 });
    let calls = 0;
    queue.register("always-fails", async () => {
      calls += 1;
      throw new Error(`attempt ${calls}`);
    });

    queue.enqueue("always-fails", null);
    await queue.onIdle();

    expect(calls).toBe(3);
    expect(queue.results).toEqual([
      expect.objectContaining({ type: "always-fails", status: "failed", attempts: 3 }),
    ]);
  });

  it("succeeds on a later attempt after transient failures, without exceeding maxAttempts", async () => {
    const queue = new JobQueue({ concurrency: 1, maxAttempts: 5, sleep: async () => {}, retryDelayMs: () => 0 });
    let calls = 0;
    queue.register("flaky", async () => {
      calls += 1;
      if (calls < 3) throw new Error("transient");
    });

    queue.enqueue("flaky", null);
    await queue.onIdle();

    expect(calls).toBe(3);
    expect(queue.results).toEqual([expect.objectContaining({ status: "succeeded", attempts: 3 })]);
  });

  it("processes jobs in FIFO order when never retried", async () => {
    const queue = new JobQueue({ concurrency: 1, sleep: async () => {} });
    const order: number[] = [];
    queue.register<number>("record", async (job) => {
      order.push(job.payload as number);
    });

    queue.enqueue("record", 1);
    queue.enqueue("record", 2);
    queue.enqueue("record", 3);
    await queue.onIdle();

    expect(order).toEqual([1, 2, 3]);
  });

  it("throws at enqueue time if no handler is registered for the job type", () => {
    const queue = immediateQueue();
    expect(() => queue.enqueue("unregistered", {})).toThrow(RangeError);
  });

  it("throws on registering two handlers for the same job type", () => {
    const queue = immediateQueue();
    queue.register("dup", async () => {});
    expect(() => queue.register("dup", async () => {})).toThrow();
  });

  it("validates constructor options", () => {
    expect(() => new JobQueue({ concurrency: 0 })).toThrow(RangeError);
    expect(() => new JobQueue({ concurrency: 1, maxAttempts: 0 })).toThrow(RangeError);
  });

  it("onIdle() resolves immediately when the queue is already empty", async () => {
    const queue = immediateQueue();
    await expect(queue.onIdle()).resolves.toBeUndefined();
  });
});

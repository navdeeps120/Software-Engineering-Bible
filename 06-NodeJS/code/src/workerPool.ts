/**
 * workerPool.ts
 *
 * Teaches the core `worker_threads` pooling mechanism: a fixed number of
 * long-lived workers, a FIFO task queue, and message-passing to dispatch
 * work and collect results. This is the pattern every "worker pool" npm
 * package implements under the hood.
 *
 * The worker body is an inline `eval` string rather than a separate compiled
 * file, so the lab has no build step and works directly against the TS
 * source under `tsx`/`vitest`. `new Worker(code, { eval: true })` runs
 * `code` as a CommonJS script (Node injects `require` for eval'd code, just
 * like the classic `node -e "..."` one-liners), independent of this
 * package's own `"type": "module"` setting.
 *
 * The CPU-ish workload is an iterative Fibonacci computation — cheap enough
 * to keep the test suite fast, expensive enough to demonstrate genuine
 * off-main-thread execution and queueing under a concurrency limit.
 */
import { Worker } from "node:worker_threads";

const WORKER_SOURCE = `
const { parentPort } = require("node:worker_threads");

function fib(n) {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError("n must be a non-negative integer");
  }
  let a = 0n;
  let b = 1n;
  for (let i = 0; i < n; i += 1) {
    const next = a + b;
    a = b;
    b = next;
  }
  return a.toString();
}

parentPort.on("message", (input) => {
  try {
    parentPort.postMessage({ ok: true, value: fib(input) });
  } catch (error) {
    parentPort.postMessage({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
});
`;

type WorkerResponse = { ok: true; value: string } | { ok: false; error: string };

interface PendingJob {
  input: number;
  resolve: (value: string) => void;
  reject: (reason: unknown) => void;
}

export interface WorkerPoolOptions {
  /** Number of workers running concurrently; also the concurrency limit. */
  size: number;
}

/**
 * A fixed-size pool of `worker_threads` workers. `run()` queues work when
 * every worker is busy and dispatches it as soon as one frees up, so no more
 * than `size` computations ever run concurrently.
 */
export class FibWorkerPool {
  private readonly workers: Worker[] = [];
  private readonly idle: Worker[] = [];
  private readonly queue: PendingJob[] = [];
  private readonly inFlight = new Map<Worker, PendingJob>();
  private closed = false;

  constructor(options: WorkerPoolOptions) {
    if (!Number.isInteger(options.size) || options.size < 1) {
      throw new RangeError(`pool size must be a positive integer, got ${options.size}`);
    }

    for (let i = 0; i < options.size; i += 1) {
      const worker = new Worker(WORKER_SOURCE, { eval: true });

      worker.on("message", (message: WorkerResponse) => {
        const job = this.inFlight.get(worker);
        this.inFlight.delete(worker);
        if (job) {
          if (message.ok) job.resolve(message.value);
          else job.reject(new Error(message.error));
        }
        this.releaseWorker(worker);
      });

      worker.on("error", (error: Error) => {
        const job = this.inFlight.get(worker);
        this.inFlight.delete(worker);
        job?.reject(error);
        this.releaseWorker(worker);
      });

      this.workers.push(worker);
      this.idle.push(worker);
    }
  }

  /** Number of workers in the pool (== the concurrency limit). */
  get size(): number {
    return this.workers.length;
  }

  /** Number of tasks waiting for a free worker. */
  get queued(): number {
    return this.queue.length;
  }

  /**
   * Runs one Fibonacci computation on the pool, queueing behind other work
   * if every worker is currently busy. Returns the result as a decimal
   * string because `bigint` cannot cross the structured-clone boundary as a
   * plain JSON-shaped value in every Node version this lab targets.
   */
  run(input: number): Promise<string> {
    if (this.closed) {
      return Promise.reject(new Error("worker pool is closed"));
    }
    if (!Number.isInteger(input) || input < 0) {
      return Promise.reject(new RangeError(`input must be a non-negative integer, got ${input}`));
    }

    return new Promise<string>((resolve, reject) => {
      this.queue.push({ input, resolve, reject });
      this.dispatch();
    });
  }

  private dispatch(): void {
    while (!this.closed && this.idle.length > 0 && this.queue.length > 0) {
      const worker = this.idle.shift();
      const job = this.queue.shift();
      if (!worker || !job) break;
      this.inFlight.set(worker, job);
      worker.postMessage(job.input);
    }
  }

  private releaseWorker(worker: Worker): void {
    if (this.closed) return;
    this.idle.push(worker);
    this.dispatch();
  }

  /** Terminates every worker. In-flight and queued jobs are rejected. */
  async close(): Promise<void> {
    if (this.closed) return;
    this.closed = true;

    const shutdownError = new Error("worker pool closed before task completed");
    for (const job of this.queue.splice(0, this.queue.length)) {
      job.reject(shutdownError);
    }
    for (const job of this.inFlight.values()) {
      job.reject(shutdownError);
    }
    this.inFlight.clear();

    await Promise.all(this.workers.map((worker) => worker.terminate()));
  }
}

/**
 * Convenience wrapper: computes `fib(n)` for every input with a bounded
 * concurrency of `concurrency` workers, then tears the pool down. Results
 * are returned in input order (each Promise resolves independently of
 * completion order).
 */
export async function computeFibonacciBatch(
  inputs: readonly number[],
  concurrency: number,
): Promise<string[]> {
  const pool = new FibWorkerPool({ size: concurrency });
  try {
    return await Promise.all(inputs.map((input) => pool.run(input)));
  } finally {
    await pool.close();
  }
}

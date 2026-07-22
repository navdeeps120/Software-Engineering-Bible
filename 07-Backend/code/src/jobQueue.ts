/**
 * jobQueue.ts
 *
 * An in-process FIFO job queue with a concurrency limit and per-job
 * retries — the mechanism underneath any "background jobs" library, minus
 * the durable broker. See
 * [[07-Backend/07-Caching-Jobs-and-Messaging/Background Jobs and Workers]].
 *
 * Mechanism: `enqueue()` pushes a job and calls `pump()`, which pulls jobs
 * off the front of the queue while fewer than `concurrency` are in flight.
 * A failed job that hasn't exhausted `maxAttempts` is pushed back onto the
 * **tail** of the queue (simple FIFO retry, no priority re-ordering) after
 * an optional delay.
 *
 * Intentional simplification: in-memory only — a crash loses every queued
 * and in-flight job. Real systems need a durable broker (SQS, a DB-backed
 * outbox table, Kafka) for at-least-once delivery across process restarts;
 * see
 * [[07-Backend/07-Caching-Jobs-and-Messaging/Message Queue Client Patterns]]
 * and
 * [[07-Backend/07-Caching-Jobs-and-Messaging/Transactional Outbox and Inbox Patterns]].
 */

export interface Job<T = unknown> {
  id: string;
  type: string;
  payload: T;
  attempts: number;
}

export type JobHandler<T = unknown> = (job: Job<T>) => Promise<void>;

export interface JobQueueOptions {
  /** Maximum jobs processed concurrently. */
  concurrency: number;
  /** Maximum attempts per job (including the first). Defaults to 3. */
  maxAttempts?: number;
  sleep?: (ms: number) => Promise<void>;
  /** Delay before re-enqueueing a failed job, given its (1-based) attempt number that just failed. Defaults to `() => 0` (immediate retry) so tests stay fast by default. */
  retryDelayMs?: (attempt: number) => number;
  idFactory?: () => string;
}

export interface JobResult {
  id: string;
  type: string;
  status: "succeeded" | "failed";
  attempts: number;
  error?: unknown;
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class JobQueue {
  private readonly handlers = new Map<string, JobHandler>();
  private readonly queue: Job[] = [];
  private active = 0;
  private readonly concurrency: number;
  private readonly maxAttempts: number;
  private readonly sleep: (ms: number) => Promise<void>;
  private readonly retryDelayMs: (attempt: number) => number;
  private readonly idFactory: () => string;
  private idCounter = 0;
  private drainWaiters: Array<() => void> = [];
  readonly results: JobResult[] = [];

  constructor(options: JobQueueOptions) {
    if (!Number.isInteger(options.concurrency) || options.concurrency < 1) {
      throw new RangeError(`concurrency must be a positive integer, got ${options.concurrency}`);
    }
    this.concurrency = options.concurrency;
    this.maxAttempts = options.maxAttempts ?? 3;
    if (!Number.isInteger(this.maxAttempts) || this.maxAttempts < 1) {
      throw new RangeError(`maxAttempts must be a positive integer, got ${options.maxAttempts}`);
    }
    this.sleep = options.sleep ?? defaultSleep;
    this.retryDelayMs = options.retryDelayMs ?? (() => 0);
    this.idFactory = options.idFactory ?? (() => `job_${(this.idCounter += 1)}`);
  }

  /** Registers the handler for a job type. Exactly one handler per type — registering twice is a configuration bug. */
  register<T>(type: string, handler: JobHandler<T>): void {
    if (this.handlers.has(type)) throw new Error(`handler already registered for job type: ${JSON.stringify(type)}`);
    this.handlers.set(type, handler as JobHandler);
  }

  /** Enqueues a job of `type`, throwing if no handler is registered for it (fail at enqueue time, not silently at drain time). */
  enqueue<T>(type: string, payload: T): string {
    if (!this.handlers.has(type)) throw new RangeError(`no handler registered for job type: ${JSON.stringify(type)}`);
    const id = this.idFactory();
    this.queue.push({ id, type, payload, attempts: 0 });
    this.pump();
    return id;
  }

  get pending(): number {
    return this.queue.length;
  }

  get inFlight(): number {
    return this.active;
  }

  private pump(): void {
    while (this.active < this.concurrency && this.queue.length > 0) {
      const job = this.queue.shift();
      if (!job) break;
      this.active += 1;
      void this.runJob(job);
    }
  }

  private async runJob(job: Job): Promise<void> {
    const handler = this.handlers.get(job.type);
    job.attempts += 1;
    try {
      if (!handler) throw new Error(`no handler registered for job type: ${JSON.stringify(job.type)}`);
      await handler(job);
      this.results.push({ id: job.id, type: job.type, status: "succeeded", attempts: job.attempts });
    } catch (error) {
      if (job.attempts >= this.maxAttempts) {
        this.results.push({ id: job.id, type: job.type, status: "failed", attempts: job.attempts, error });
      } else {
        const delay = this.retryDelayMs(job.attempts);
        if (delay > 0) await this.sleep(delay);
        this.queue.push(job);
      }
    } finally {
      this.active -= 1;
      this.pump();
      if (this.queue.length === 0 && this.active === 0) {
        const waiters = this.drainWaiters;
        this.drainWaiters = [];
        waiters.forEach((resolve) => resolve());
      }
    }
  }

  /** Resolves once no jobs are pending or in flight. A snapshot: further `enqueue()` calls after this resolves can reopen work. */
  onIdle(): Promise<void> {
    if (this.queue.length === 0 && this.active === 0) return Promise.resolve();
    return new Promise((resolve) => this.drainWaiters.push(resolve));
  }
}

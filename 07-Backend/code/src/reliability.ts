/**
 * reliability.ts
 *
 * Three reliability primitives from
 * [[07-Backend/06-Reliability-and-Abuse-Resistance/Timeouts Cancellation and Deadlines]]
 * and
 * [[07-Backend/06-Reliability-and-Abuse-Resistance/Retries Jitter and Idempotent Handlers]]:
 *
 *  - `withTimeout` — races a promise against a deadline.
 *  - `retryWithJitter` — bounded retries with **full jitter** exponential
 *    backoff (AWS's well-known algorithm), classifying errors as
 *    retryable/terminal via a caller-supplied predicate.
 *  - `IdempotencyStore` — a `(key) -> result` cache with **singleflight**
 *    semantics: concurrent callers for the same in-flight key await the
 *    same promise instead of re-running the underlying operation, which is
 *    what actually prevents duplicate side effects for concurrently
 *    retried requests (not just sequential ones).
 *
 * Every timing dependency (`sleep`, `now`, `random`) is injectable so tests
 * are fully deterministic and never race real timers — see the design rule
 * in the README.
 */

export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`operation timed out after ${ms}ms`);
    this.name = "TimeoutError";
  }
}

export interface WithTimeoutOptions {
  setTimeoutFn?: (handler: () => void, ms: number) => ReturnType<typeof setTimeout>;
  clearTimeoutFn?: (handle: ReturnType<typeof setTimeout>) => void;
}

/**
 * Races `promise` against a `ms`-millisecond deadline. Rejects with
 * `TimeoutError` if the deadline elapses first.
 *
 * Intentional simplification: this cannot *cancel* an arbitrary Promise —
 * JS promises have no built-in cancellation. If `promise` eventually
 * settles after the timeout fires, its result/rejection is simply ignored
 * here. Real cancellable I/O should thread an `AbortSignal` through the
 * underlying operation instead; see
 * [[06-NodeJS/07-Timers-Events-and-IPC/AbortSignal Propagation Across Node APIs]].
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, options: WithTimeoutOptions = {}): Promise<T> {
  if (!Number.isFinite(ms) || ms <= 0) throw new RangeError(`ms must be a positive finite number, got ${ms}`);
  const setTimeoutFn = options.setTimeoutFn ?? setTimeout;
  const clearTimeoutFn = options.clearTimeoutFn ?? clearTimeout;

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeoutFn(() => reject(new TimeoutError(ms)), ms);
    promise.then(
      (value) => {
        clearTimeoutFn(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeoutFn(timer);
        reject(error);
      },
    );
  });
}

export interface RetryOptions {
  /** Total attempts including the first, non-retry call. Must be >= 1. */
  attempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  /** Defaults to "everything is retryable" — pass a real classifier for production use (see the note's retryable-status table). */
  isRetryable?: (error: unknown) => boolean;
  sleep?: (ms: number) => Promise<void>;
  /** Returns a float in [0, 1). Defaults to `Math.random`; inject a seeded generator for deterministic tests. */
  random?: () => number;
}

export class RetryExhaustedError extends Error {
  readonly cause: unknown;
  constructor(attempts: number, cause: unknown) {
    super(`retry exhausted after ${attempts} attempt(s)`);
    this.name = "RetryExhaustedError";
    this.cause = cause;
  }
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** AWS "full jitter" backoff: a uniformly random delay between 0 and `min(maxDelayMs, baseDelayMs * 2^(attempt-1))`. */
export function fullJitterDelay(attempt: number, baseDelayMs: number, maxDelayMs: number, random: () => number = Math.random): number {
  if (!Number.isInteger(attempt) || attempt < 1) throw new RangeError(`attempt must be a positive integer, got ${attempt}`);
  if (!Number.isFinite(baseDelayMs) || baseDelayMs <= 0) throw new RangeError("baseDelayMs must be a positive finite number");
  if (!Number.isFinite(maxDelayMs) || maxDelayMs <= 0) throw new RangeError("maxDelayMs must be a positive finite number");
  const cap = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
  return Math.floor(random() * cap);
}

/**
 * Retries `operation` up to `options.attempts` times. An error for which
 * `isRetryable` returns `false` is re-thrown immediately (never treated as
 * "exhausted"); running out of attempts on a retryable error throws
 * `RetryExhaustedError` wrapping the last cause.
 */
export async function retryWithJitter<T>(operation: (attempt: number) => Promise<T>, options: RetryOptions): Promise<T> {
  if (!Number.isInteger(options.attempts) || options.attempts < 1) {
    throw new RangeError(`attempts must be a positive integer, got ${options.attempts}`);
  }
  const isRetryable = options.isRetryable ?? (() => true);
  const sleep = options.sleep ?? defaultSleep;
  const random = options.random ?? Math.random;

  for (let attempt = 1; attempt <= options.attempts; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      if (!isRetryable(error)) throw error;
      if (attempt === options.attempts) throw new RetryExhaustedError(attempt, error);
      const delay = fullJitterDelay(attempt, options.baseDelayMs, options.maxDelayMs, random);
      await sleep(delay);
    }
  }
  // Unreachable: the loop above always returns or throws. Kept for TS control-flow analysis.
  throw new RetryExhaustedError(options.attempts, undefined);
}

export interface IdempotencyStoreOptions {
  /** Defaults to 24h, matching typical `Idempotency-Key` retention windows. */
  ttlMs?: number;
  now?: () => number;
}

interface IdempotencyRecord<T> {
  value: T;
  createdAt: number;
}

/**
 * `(key) -> result` store implementing the idempotency-key mechanism from
 * [[07-Backend/01-HTTP-APIs-and-Contracts/Idempotency Keys and Safe Retries]]:
 * a completed result is replayed for the TTL window, and concurrent misses
 * for the same key join a single in-flight computation rather than
 * duplicating side effects.
 */
export class IdempotencyStore<T> {
  private readonly records = new Map<string, IdempotencyRecord<T>>();
  private readonly inFlight = new Map<string, Promise<T>>();
  private readonly ttlMs: number;
  private readonly now: () => number;

  constructor(options: IdempotencyStoreOptions = {}) {
    this.ttlMs = options.ttlMs ?? 24 * 60 * 60 * 1000;
    if (!Number.isFinite(this.ttlMs) || this.ttlMs <= 0) throw new RangeError("ttlMs must be a positive finite number");
    this.now = options.now ?? Date.now;
  }

  /** Returns the cached value for `key`, or `undefined` if absent/expired. */
  get(key: string): T | undefined {
    const record = this.records.get(key);
    if (!record) return undefined;
    if (this.now() - record.createdAt >= this.ttlMs) {
      this.records.delete(key);
      return undefined;
    }
    return record.value;
  }

  /** Records `value` for `key`. Throws if `key` is already recorded (and not yet expired) — a silent overwrite would mean two different responses for the same idempotency key. */
  setOnce(key: string, value: T): void {
    if (this.get(key) !== undefined) {
      throw new Error(`idempotency key already recorded: ${JSON.stringify(key)}`);
    }
    this.records.set(key, { value, createdAt: this.now() });
  }

  /**
   * Returns the cached result for `key` if present; otherwise runs
   * `compute()` exactly once and caches its result, no matter how many
   * concurrent callers race in for the same key (they all await the same
   * in-flight promise).
   */
  async getOrCompute(key: string, compute: () => Promise<T>): Promise<T> {
    const cached = this.get(key);
    if (cached !== undefined) return cached;

    const pending = this.inFlight.get(key);
    if (pending) return pending;

    const promise = compute()
      .then((value) => {
        this.setOnce(key, value);
        return value;
      })
      .finally(() => {
        this.inFlight.delete(key);
      });
    this.inFlight.set(key, promise);
    return promise;
  }

  get size(): number {
    return this.records.size;
  }
}

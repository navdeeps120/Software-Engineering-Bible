/**
 * rateLimit.ts
 *
 * An in-memory **token bucket** rate limiter, keyed per caller (IP, API
 * key, tenant — whatever `keyFn` derives). See
 * [[07-Backend/06-Reliability-and-Abuse-Resistance/Rate Limiting and Quotas]].
 *
 * Token bucket mechanics: each key gets a bucket of `capacity` tokens that
 * refill continuously at `refillPerSec` tokens/second, capped at
 * `capacity`. Consuming `cost` tokens (default 1) succeeds iff the bucket
 * currently holds at least `cost` — this allows bursts up to `capacity`
 * while bounding the sustained rate to `refillPerSec`.
 *
 * Intentional simplification: this is a single-process, in-memory limiter.
 * A real multi-instance deployment needs a shared store (Redis + a Lua
 * script for atomicity, typically) — the *algorithm* taught here is
 * identical; only the storage backend changes. See
 * [[08-Databases/README|Databases]] for that layer.
 */
import type { NextFunction, Request, RequestHandler, Response } from "express";

export interface TokenBucketOptions {
  /** Maximum tokens (== maximum burst size) a bucket can hold. */
  capacity: number;
  /** Steady-state refill rate, in tokens per second. */
  refillPerSec: number;
  now?: () => number;
}

interface BucketState {
  tokens: number;
  lastRefillMs: number;
}

export interface ConsumeResult {
  allowed: boolean;
  /** Tokens remaining in the bucket immediately after this attempt. */
  remaining: number;
  /** Milliseconds until enough tokens would be available for this same request, if denied (0 if allowed). */
  retryAfterMs: number;
}

export class TokenBucketLimiter {
  private readonly buckets = new Map<string, BucketState>();
  private readonly capacity: number;
  private readonly refillPerSec: number;
  private readonly now: () => number;

  constructor(options: TokenBucketOptions) {
    if (!Number.isFinite(options.capacity) || options.capacity <= 0) {
      throw new RangeError(`capacity must be a positive finite number, got ${options.capacity}`);
    }
    if (!Number.isFinite(options.refillPerSec) || options.refillPerSec <= 0) {
      throw new RangeError(`refillPerSec must be a positive finite number, got ${options.refillPerSec}`);
    }
    this.capacity = options.capacity;
    this.refillPerSec = options.refillPerSec;
    this.now = options.now ?? Date.now;
  }

  private refill(state: BucketState): void {
    const nowMs = this.now();
    const elapsedSec = Math.max(0, nowMs - state.lastRefillMs) / 1000;
    state.tokens = Math.min(this.capacity, state.tokens + elapsedSec * this.refillPerSec);
    state.lastRefillMs = nowMs;
  }

  /** Attempts to consume `cost` tokens (default 1) for `key`, lazily creating a full bucket on first use. */
  tryConsume(key: string, cost = 1): ConsumeResult {
    if (typeof key !== "string" || key.length === 0) throw new TypeError("key must be a non-empty string");
    if (!Number.isFinite(cost) || cost <= 0) throw new RangeError(`cost must be a positive finite number, got ${cost}`);

    let state = this.buckets.get(key);
    if (!state) {
      state = { tokens: this.capacity, lastRefillMs: this.now() };
      this.buckets.set(key, state);
    }
    this.refill(state);

    if (state.tokens >= cost) {
      state.tokens -= cost;
      return { allowed: true, remaining: state.tokens, retryAfterMs: 0 };
    }

    const deficit = cost - state.tokens;
    const retryAfterMs = Math.ceil((deficit / this.refillPerSec) * 1000);
    return { allowed: false, remaining: state.tokens, retryAfterMs };
  }

  /** Drops a key's bucket entirely (it will be recreated at full capacity on next use). */
  reset(key: string): void {
    this.buckets.delete(key);
  }

  get bucketCount(): number {
    return this.buckets.size;
  }
}

/**
 * Express middleware wrapping a `TokenBucketLimiter`. Denied requests get a
 * `429` `application/problem+json` response with `Retry-After`, matching
 * the product-policy contract from
 * [[07-Backend/03-Validation-Errors-and-Versioning/Problem Details and Error Envelopes]].
 */
export function rateLimitMiddleware(limiter: TokenBucketLimiter, keyFn: (req: Request) => string, cost = 1): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = limiter.tryConsume(keyFn(req), cost);
    res.setHeader("X-RateLimit-Remaining", String(Math.floor(result.remaining)));
    if (!result.allowed) {
      const retryAfterSec = Math.ceil(result.retryAfterMs / 1000);
      res.setHeader("Retry-After", String(retryAfterSec));
      res.status(429).type("application/problem+json").json({
        type: "https://errors.example.com/problems/rate-limited",
        title: "Too Many Requests",
        status: 429,
        detail: `retry after ${retryAfterSec}s`,
      });
      return;
    }
    next();
  };
}

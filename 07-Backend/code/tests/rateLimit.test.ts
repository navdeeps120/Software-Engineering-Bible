import { describe, expect, it } from "vitest";
import { rateLimitMiddleware, TokenBucketLimiter } from "../src/rateLimit.js";

describe("TokenBucketLimiter", () => {
  it("allows requests up to capacity, then denies the next one", () => {
    let now = 0;
    const limiter = new TokenBucketLimiter({ capacity: 3, refillPerSec: 1, now: () => now });
    expect(limiter.tryConsume("client-1").allowed).toBe(true);
    expect(limiter.tryConsume("client-1").allowed).toBe(true);
    expect(limiter.tryConsume("client-1").allowed).toBe(true);
    const denied = limiter.tryConsume("client-1");
    expect(denied.allowed).toBe(false);
    expect(denied.remaining).toBe(0);
  });

  it("refills tokens over time according to refillPerSec, using the injected clock", () => {
    let now = 0;
    const limiter = new TokenBucketLimiter({ capacity: 2, refillPerSec: 1, now: () => now });
    limiter.tryConsume("client-1");
    limiter.tryConsume("client-1");
    expect(limiter.tryConsume("client-1").allowed).toBe(false);

    now += 1_000; // 1 token refills after 1s at refillPerSec=1
    const result = limiter.tryConsume("client-1");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBeCloseTo(0, 5);
  });

  it("never refills above capacity even after a long idle period", () => {
    let now = 0;
    const limiter = new TokenBucketLimiter({ capacity: 2, refillPerSec: 10, now: () => now });
    limiter.tryConsume("client-1");
    now += 60_000; // way more than enough time to overflow the bucket if unbounded
    const result = limiter.tryConsume("client-1");
    expect(result.remaining).toBeLessThanOrEqual(2);
  });

  it("reports a positive retryAfterMs when denied", () => {
    let now = 0;
    const limiter = new TokenBucketLimiter({ capacity: 1, refillPerSec: 2, now: () => now });
    limiter.tryConsume("client-1");
    const denied = limiter.tryConsume("client-1");
    expect(denied.allowed).toBe(false);
    expect(denied.retryAfterMs).toBeGreaterThan(0);
  });

  it("tracks buckets independently per key", () => {
    let now = 0;
    const limiter = new TokenBucketLimiter({ capacity: 1, refillPerSec: 1, now: () => now });
    expect(limiter.tryConsume("a").allowed).toBe(true);
    expect(limiter.tryConsume("b").allowed).toBe(true); // independent bucket, not sharing "a"'s exhausted tokens
  });

  it("reset() restores a key's bucket to full capacity", () => {
    let now = 0;
    const limiter = new TokenBucketLimiter({ capacity: 1, refillPerSec: 1, now: () => now });
    limiter.tryConsume("client-1");
    expect(limiter.tryConsume("client-1").allowed).toBe(false);
    limiter.reset("client-1");
    expect(limiter.tryConsume("client-1").allowed).toBe(true);
  });

  it("validates constructor options", () => {
    expect(() => new TokenBucketLimiter({ capacity: 0, refillPerSec: 1 })).toThrow(RangeError);
    expect(() => new TokenBucketLimiter({ capacity: 1, refillPerSec: 0 })).toThrow(RangeError);
  });

  it("validates tryConsume arguments", () => {
    const limiter = new TokenBucketLimiter({ capacity: 1, refillPerSec: 1 });
    expect(() => limiter.tryConsume("")).toThrow(TypeError);
    expect(() => limiter.tryConsume("k", 0)).toThrow(RangeError);
  });
});

describe("rateLimitMiddleware", () => {
  function fakeResponse() {
    const headers: Record<string, string> = {};
    const state = { status: 0, contentType: "", body: undefined as unknown };
    const res = {
      setHeader(name: string, value: string) {
        headers[name] = value;
      },
      status(code: number) {
        state.status = code;
        return this;
      },
      type(value: string) {
        state.contentType = value;
        return this;
      },
      json(payload: unknown) {
        state.body = payload;
        return this;
      },
    };
    return { res, state, headers };
  }

  it("calls next() and sets a remaining-tokens header when allowed", () => {
    let now = 0;
    const limiter = new TokenBucketLimiter({ capacity: 2, refillPerSec: 1, now: () => now });
    const middleware = rateLimitMiddleware(limiter, () => "client-1");
    const { res, headers } = fakeResponse();
    const calls: unknown[] = [];

    middleware({} as never, res as never, ((err?: unknown) => calls.push(err)) as never);

    expect(calls).toEqual([undefined]);
    expect(headers["X-RateLimit-Remaining"]).toBe("1");
  });

  it("responds 429 with problem+json and Retry-After when denied", () => {
    let now = 0;
    const limiter = new TokenBucketLimiter({ capacity: 1, refillPerSec: 1, now: () => now });
    const middleware = rateLimitMiddleware(limiter, () => "client-1");
    middleware({} as never, fakeResponse().res as never, (() => {}) as never); // consume the only token

    const { res, state, headers } = fakeResponse();
    const calls: unknown[] = [];
    middleware({} as never, res as never, ((err?: unknown) => calls.push(err)) as never);

    expect(calls).toEqual([]); // next() never called on denial
    expect(state.status).toBe(429);
    expect(state.contentType).toBe("application/problem+json");
    expect(headers["Retry-After"]).toBeDefined();
  });
});

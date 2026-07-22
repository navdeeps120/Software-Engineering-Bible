import { describe, expect, it } from "vitest";
import {
  bearerAuthMiddleware,
  hashPassword,
  SessionStore,
  signAccessToken,
  TokenVerificationError,
  verifyAccessToken,
  verifyPassword,
} from "../src/auth.js";

describe("hashPassword / verifyPassword", () => {
  it("verifies the correct password against its own hash", async () => {
    const hash = await hashPassword("correct horse battery staple");
    await expect(verifyPassword("correct horse battery staple", hash)).resolves.toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("correct horse battery staple");
    await expect(verifyPassword("wrong password", hash)).resolves.toBe(false);
  });

  it("uses a random salt so two hashes of the same password differ", async () => {
    const a = await hashPassword("same-password");
    const b = await hashPassword("same-password");
    expect(a).not.toBe(b);
    await expect(verifyPassword("same-password", a)).resolves.toBe(true);
    await expect(verifyPassword("same-password", b)).resolves.toBe(true);
  });

  it("throws on an empty password rather than hashing it", async () => {
    await expect(hashPassword("")).rejects.toThrow(TypeError);
  });

  it("throws on a malformed stored hash instead of silently returning false", async () => {
    await expect(verifyPassword("anything", "not-a-valid-hash")).rejects.toThrow(TypeError);
  });
});

describe("SessionStore", () => {
  it("creates a session and retrieves it by token", () => {
    const store = new SessionStore();
    const token = store.create("user-1");
    expect(store.get(token)?.userId).toBe("user-1");
  });

  it("expires sessions after ttlMs using the injected clock", () => {
    let now = 1_000;
    const store = new SessionStore({ ttlMs: 500, now: () => now });
    const token = store.create("user-1");
    expect(store.get(token)).toBeDefined();

    now += 500; // exactly at expiry boundary
    expect(store.get(token)).toBeUndefined();
  });

  it("revoke() immediately invalidates a session", () => {
    const store = new SessionStore();
    const token = store.create("user-1");
    store.revoke(token);
    expect(store.get(token)).toBeUndefined();
  });

  it("rejects a non-positive ttlMs", () => {
    expect(() => new SessionStore({ ttlMs: 0 })).toThrow(RangeError);
  });
});

describe("signAccessToken / verifyAccessToken", () => {
  const secret = "test-secret-do-not-use-in-prod";

  it("round-trips claims through sign and verify", () => {
    const token = signAccessToken({ sub: "user-1", scope: "read" }, secret);
    const claims = verifyAccessToken(token, secret);
    expect(claims.sub).toBe("user-1");
    expect(claims.scope).toBe("read");
    expect(typeof claims.iat).toBe("number");
    expect(typeof claims.exp).toBe("number");
  });

  it("rejects a token signed with a different secret", () => {
    const token = signAccessToken({ sub: "user-1" }, secret);
    expect(() => verifyAccessToken(token, "a-different-secret")).toThrow(TokenVerificationError);
  });

  it("rejects a tampered payload even if the signature segment is untouched", () => {
    const token = signAccessToken({ sub: "user-1" }, secret);
    const [header, payload, signature] = token.split(".");
    const tamperedPayload = Buffer.from(JSON.stringify({ sub: "attacker", iat: 0, exp: 9_999_999_999 })).toString(
      "base64url",
    );
    const tamperedToken = `${header}.${tamperedPayload}.${signature}`;
    expect(() => verifyAccessToken(tamperedToken, secret)).toThrow(TokenVerificationError);
  });

  it("rejects an expired token using the injected clock", () => {
    let now = 1_000_000;
    const token = signAccessToken({ sub: "user-1" }, secret, { ttlSec: 60, now: () => now });
    now += 61_000; // 61s later, past the 60s ttl
    expect(() => verifyAccessToken(token, secret, { now: () => now })).toThrow(/expired/);
  });

  it("rejects a malformed token shape", () => {
    expect(() => verifyAccessToken("not-a-token", secret)).toThrow(TokenVerificationError);
    expect(() => verifyAccessToken("a.b", secret)).toThrow(TokenVerificationError);
  });

  it("requires a non-empty sub claim", () => {
    expect(() => signAccessToken({ sub: "" }, secret)).toThrow(TypeError);
  });
});

describe("bearerAuthMiddleware", () => {
  const secret = "another-test-secret";

  function fakeNext() {
    const calls: unknown[] = [];
    return { next: (err?: unknown) => calls.push(err), calls };
  }

  it("attaches decoded claims to req.auth and calls next() with no error for a valid bearer token", () => {
    const token = signAccessToken({ sub: "user-9" }, secret);
    const middleware = bearerAuthMiddleware(secret);
    const req = { headers: { authorization: `Bearer ${token}` } } as never;
    const { next, calls } = fakeNext();

    middleware(req, {} as never, next as never);

    expect(calls).toEqual([undefined]);
    expect((req as { auth?: { sub: string } }).auth?.sub).toBe("user-9");
  });

  it("calls next(err) when the Authorization header is missing", () => {
    const middleware = bearerAuthMiddleware(secret);
    const { next, calls } = fakeNext();
    middleware({ headers: {} } as never, {} as never, next as never);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toBeInstanceOf(TokenVerificationError);
  });

  it("calls next(err) when the token is invalid", () => {
    const middleware = bearerAuthMiddleware(secret);
    const { next, calls } = fakeNext();
    middleware({ headers: { authorization: "Bearer garbage" } } as never, {} as never, next as never);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toBeInstanceOf(TokenVerificationError);
  });
});

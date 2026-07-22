/**
 * auth.ts
 *
 * Two authentication mechanisms, taught from first principles:
 *
 *  1. A **session token map** — `SessionStore` — the mechanism behind
 *     server-side sessions: an opaque random token keyed to server state,
 *     with TTL-based expiry. See
 *     [[07-Backend/04-Authentication/Sessions Cookies and CSRF Boundaries]].
 *  2. A **JWT-like, HMAC-signed access token** — `signAccessToken`/
 *     `verifyAccessToken` — the signed-stateless-claims mechanism behind
 *     JWTs, built directly on `node:crypto`'s HMAC primitive. See
 *     [[07-Backend/04-Authentication/JWT Access Tokens and Claims]].
 *
 * Plus password storage: `hashPassword`/`verifyPassword` using `scrypt`
 * (Node's built-in memory-hard KDF) with a per-password random salt and a
 * constant-time comparison. See
 * [[07-Backend/04-Authentication/Password Hashing and Credential Storage]].
 *
 * IMPORTANT — educational, not production cryptography:
 *  - The token format here is a simplified 3-part `header.payload.signature`
 *    structure inspired by JWT, but it is **not** a JOSE/JWT implementation:
 *    no algorithm negotiation, no `alg: none` protection beyond "we only
 *    ever verify HS256", no key rotation (`kid`) support. Use a vetted
 *    library (e.g. `jose`) for real JWTs.
 *  - `scrypt` here uses modest cost parameters so the lab test suite stays
 *    fast. Production password hashing should use Argon2id via a vetted
 *    library and tune cost parameters to your hardware/latency budget —
 *    see the note linked above for real guidance. Do not copy these
 *    parameters into a production system.
 */
import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ProblemDetails } from "./validate.js";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number },
) => Promise<Buffer>;

// Deliberately small cost parameters (real Argon2id/scrypt defaults are much
// higher) so the test suite runs in milliseconds, not seconds. See the
// module doc comment above.
const SCRYPT_N = 2 ** 14;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;

/** Derives a salted `scrypt` hash and returns it as a self-describing string: `scrypt$N$r$p$salt$hash` (all base64url). */
export async function hashPassword(password: string): Promise<string> {
  if (typeof password !== "string" || password.length === 0) {
    throw new TypeError("password must be a non-empty string");
  }
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, SCRYPT_KEYLEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString("base64url")}$${derived.toString("base64url")}`;
}

/** Re-derives the hash with the stored parameters/salt and compares in constant time. Throws on a malformed stored string rather than silently returning `false`. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (typeof password !== "string") throw new TypeError("password must be a string");
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") {
    throw new TypeError(`unrecognized password hash format: ${JSON.stringify(stored)}`);
  }
  const [, nRaw, rRaw, pRaw, saltB64, hashB64] = parts;
  const N = Number(nRaw);
  const r = Number(rRaw);
  const p = Number(pRaw);
  if (![N, r, p].every((n) => Number.isInteger(n) && n > 0)) {
    throw new TypeError(`unrecognized password hash cost parameters: ${JSON.stringify(stored)}`);
  }

  const salt = Buffer.from(saltB64, "base64url");
  const expected = Buffer.from(hashB64, "base64url");
  const derived = await scrypt(password, salt, expected.length, { N, r, p });
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

// ---------------------------------------------------------------------------
// Session store
// ---------------------------------------------------------------------------

export interface SessionRecord {
  userId: string;
  createdAt: number;
  expiresAt: number;
}

export interface SessionStoreOptions {
  /** Session lifetime in ms. Defaults to 30 minutes. */
  ttlMs?: number;
  now?: () => number;
  randomToken?: () => string;
}

/** An in-memory `token -> SessionRecord` map with TTL-based expiry, standing in for a real session store (Redis, DB-backed sessions, etc). */
export class SessionStore {
  private readonly sessions = new Map<string, SessionRecord>();
  private readonly ttlMs: number;
  private readonly now: () => number;
  private readonly randomToken: () => string;

  constructor(options: SessionStoreOptions = {}) {
    this.ttlMs = options.ttlMs ?? 30 * 60 * 1000;
    if (!Number.isFinite(this.ttlMs) || this.ttlMs <= 0) {
      throw new RangeError(`ttlMs must be a positive finite number, got ${options.ttlMs}`);
    }
    this.now = options.now ?? Date.now;
    this.randomToken = options.randomToken ?? (() => randomBytes(24).toString("base64url"));
  }

  /** Creates a new session for `userId` and returns its opaque token. */
  create(userId: string): string {
    if (typeof userId !== "string" || userId.length === 0) throw new TypeError("userId must be a non-empty string");
    const token = this.randomToken();
    const createdAt = this.now();
    this.sessions.set(token, { userId, createdAt, expiresAt: createdAt + this.ttlMs });
    return token;
  }

  /** Looks up a session by token, transparently evicting (and returning `undefined` for) an expired one. */
  get(token: string): SessionRecord | undefined {
    const record = this.sessions.get(token);
    if (!record) return undefined;
    if (this.now() >= record.expiresAt) {
      this.sessions.delete(token);
      return undefined;
    }
    return record;
  }

  revoke(token: string): void {
    this.sessions.delete(token);
  }

  get size(): number {
    return this.sessions.size;
  }
}

// ---------------------------------------------------------------------------
// HMAC-signed, JWT-like access tokens
// ---------------------------------------------------------------------------

export interface AccessTokenClaims {
  sub: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export interface SignOptions {
  /** Time-to-live in seconds. Defaults to 900 (15 minutes). */
  ttlSec?: number;
  now?: () => number;
}

const TOKEN_HEADER_B64 = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT-lite" })).toString("base64url");

export class TokenVerificationError extends Error {
  /** Self-describing problem+json document so `validate.ts`'s `problemErrorHandler` maps this to 401 without knowing this class exists. */
  readonly problem: ProblemDetails;

  constructor(reason: string) {
    super(`access token verification failed: ${reason}`);
    this.name = "TokenVerificationError";
    this.problem = {
      type: "https://errors.example.com/problems/invalid-token",
      title: "Unauthorized",
      status: 401,
      detail: reason,
    };
  }
}

/** Signs `claims` into a `header.payload.signature` token using HMAC-SHA256 over `secret`. Stamps `iat`/`exp` automatically. */
export function signAccessToken(claims: AccessTokenClaims, secret: string, options: SignOptions = {}): string {
  if (typeof secret !== "string" || secret.length === 0) throw new TypeError("secret must be a non-empty string");
  if (typeof claims.sub !== "string" || claims.sub.length === 0) throw new TypeError("claims.sub must be a non-empty string");
  const now = options.now ?? Date.now;
  const ttlSec = options.ttlSec ?? 900;
  if (!Number.isFinite(ttlSec) || ttlSec <= 0) throw new RangeError(`ttlSec must be a positive finite number, got ${ttlSec}`);

  const iat = Math.floor(now() / 1000);
  const payload: AccessTokenClaims = { ...claims, iat, exp: iat + ttlSec };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signingInput = `${TOKEN_HEADER_B64}.${payloadB64}`;
  const signature = createHmac("sha256", secret).update(signingInput).digest("base64url");
  return `${signingInput}.${signature}`;
}

/** Verifies signature and expiry, returning the decoded claims. Throws `TokenVerificationError` for any failure mode — malformed shape, bad signature, or expiry — never returning a partially-trusted result. */
export function verifyAccessToken(token: string, secret: string, options: { now?: () => number } = {}): AccessTokenClaims {
  if (typeof token !== "string") throw new TypeError("token must be a string");
  const parts = token.split(".");
  if (parts.length !== 3) throw new TokenVerificationError("malformed token (expected header.payload.signature)");
  const [headerB64, payloadB64, signature] = parts;

  const expectedSignature = createHmac("sha256", secret).update(`${headerB64}.${payloadB64}`).digest("base64url");
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    throw new TokenVerificationError("signature mismatch");
  }

  let payload: AccessTokenClaims;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  } catch {
    throw new TokenVerificationError("malformed payload (not valid JSON)");
  }

  const now = options.now ?? Date.now;
  if (typeof payload.exp === "number" && Math.floor(now() / 1000) >= payload.exp) {
    throw new TokenVerificationError("token expired");
  }
  return payload;
}

/** Express middleware: requires `Authorization: Bearer <token>`, verifies it, and attaches the decoded claims to `req.auth`. Rejects (via `next(err)`) rather than defaulting to an anonymous identity on any failure. */
export function bearerAuthMiddleware(secret: string): RequestHandler {
  return (req: Request & { auth?: AccessTokenClaims }, _res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      next(new TokenVerificationError("missing or malformed Authorization header"));
      return;
    }
    try {
      req.auth = verifyAccessToken(header.slice("Bearer ".length), secret);
      next();
    } catch (error) {
      next(error);
    }
  };
}

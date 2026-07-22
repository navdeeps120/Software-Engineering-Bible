/**
 * expressIntegration.test.ts
 *
 * Wires several labs together on a *real* `express()` app (not
 * `expressLite.ts`) — validation, password hashing, bearer-token auth,
 * RBAC, and rate limiting — and drives it over real HTTP with Node's
 * built-in `fetch`, the same ephemeral-port pattern
 * `06-NodeJS/code/tests/httpServer.test.ts` uses. This is the "does this
 * actually work against the real framework, not just our mental model of
 * it" check for every module that ships an Express `RequestHandler`.
 */
import type { Server } from "node:http";
import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { bearerAuthMiddleware, hashPassword, signAccessToken, verifyPassword } from "../src/auth.js";
import { problemErrorHandler, toExpressMiddleware, type Schema } from "../src/validate.js";
import { requirePermissionMiddleware, type RolePermissions } from "../src/rbac.js";
import { rateLimitMiddleware, TokenBucketLimiter } from "../src/rateLimit.js";

const SECRET = "integration-test-secret";
const ROLE_PERMISSIONS: RolePermissions = {
  viewer: ["orders:read"],
  admin: ["orders:read", "orders:write"],
};

const loginSchema: Schema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 1 },
    password: { type: "string", minLength: 1 },
  },
};

interface StoredUser {
  username: string;
  passwordHash: string;
  roles: string[];
}

async function buildApp() {
  const users = new Map<string, StoredUser>();
  users.set("alice", {
    username: "alice",
    passwordHash: await hashPassword("correct-password"),
    roles: ["viewer"],
  });

  const limiter = new TokenBucketLimiter({ capacity: 2, refillPerSec: 100 });
  const app = express();
  app.use(express.json());

  app.post("/v1/login", toExpressMiddleware(loginSchema), async (req, res, next) => {
    try {
      const { username, password } = req.body as { username: string; password: string };
      const user = users.get(username);
      const ok = user ? await verifyPassword(password, user.passwordHash) : false;
      if (!user || !ok) {
        res.status(401).type("application/problem+json").json({
          type: "https://errors.example.com/problems/invalid-credentials",
          title: "Invalid credentials",
          status: 401,
        });
        return;
      }
      const token = signAccessToken({ sub: user.username, roles: user.roles }, SECRET, { ttlSec: 60 });
      res.status(200).json({ accessToken: token });
    } catch (error) {
      next(error);
    }
  });

  const authenticated = bearerAuthMiddleware(SECRET);
  const requireOrdersRead = requirePermissionMiddleware(ROLE_PERMISSIONS, "orders:read", (req) => {
    const auth = (req as express.Request & { auth?: { sub: string; roles: string[] } }).auth;
    return auth ? { id: auth.sub, roles: auth.roles } : undefined;
  });
  const limited = rateLimitMiddleware(limiter, (req) => req.ip ?? "unknown");

  app.get("/v1/orders", authenticated, requireOrdersRead, limited, (_req, res) => {
    res.status(200).json({ orders: [] });
  });

  app.use(problemErrorHandler);
  return app;
}

async function startOn(app: express.Express): Promise<{ server: Server; baseUrl: string }> {
  return new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address === null || typeof address === "string") throw new Error("expected a network address");
      resolve({ server, baseUrl: `http://127.0.0.1:${address.port}` });
    });
  });
}

function stop(server: Server): Promise<void> {
  return new Promise((resolve, reject) => server.close((err?: Error) => (err ? reject(err) : resolve())));
}

describe("real Express integration: auth + validate + rbac + rate limit", () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server) {
      await stop(server);
      server = undefined;
    }
  });

  it("rejects a malformed login body with a 400 problem+json document", async () => {
    const started = await startOn(await buildApp());
    server = started.server;

    const response = await fetch(`${started.baseUrl}/v1/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: "" }),
    });

    expect(response.status).toBe(400);
    expect(response.headers.get("content-type")).toContain("application/problem+json");
    const body = (await response.json()) as { title: string; errors: unknown[] };
    expect(body.title).toBe("Validation failed");
    expect(body.errors.length).toBeGreaterThan(0);
  });

  it("rejects invalid credentials with 401", async () => {
    const started = await startOn(await buildApp());
    server = started.server;

    const response = await fetch(`${started.baseUrl}/v1/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: "alice", password: "wrong" }),
    });

    expect(response.status).toBe(401);
  });

  it("logs in, then uses the access token to authorize a protected route", async () => {
    const started = await startOn(await buildApp());
    server = started.server;

    const loginResponse = await fetch(`${started.baseUrl}/v1/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: "alice", password: "correct-password" }),
    });
    expect(loginResponse.status).toBe(200);
    const { accessToken } = (await loginResponse.json()) as { accessToken: string };
    expect(typeof accessToken).toBe("string");

    const ordersResponse = await fetch(`${started.baseUrl}/v1/orders`, {
      headers: { authorization: `Bearer ${accessToken}` },
    });
    expect(ordersResponse.status).toBe(200);
    expect(await ordersResponse.json()).toEqual({ orders: [] });
  });

  it("rejects a protected route request with no bearer token", async () => {
    const started = await startOn(await buildApp());
    server = started.server;

    const response = await fetch(`${started.baseUrl}/v1/orders`);
    expect(response.status).toBe(401); // TokenVerificationError self-describes via .problem -> mapped straight to 401
  });

  it("rate-limits repeated requests to the protected route once the bucket is exhausted", async () => {
    const started = await startOn(await buildApp());
    server = started.server;

    const loginResponse = await fetch(`${started.baseUrl}/v1/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: "alice", password: "correct-password" }),
    });
    const { accessToken } = (await loginResponse.json()) as { accessToken: string };

    const attempt = () => fetch(`${started.baseUrl}/v1/orders`, { headers: { authorization: `Bearer ${accessToken}` } });
    const results = await Promise.all([attempt(), attempt(), attempt()]); // bucket capacity is 2
    const statuses = results.map((r) => r.status).sort();
    expect(statuses).toContain(429);
  });
});

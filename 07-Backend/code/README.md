---
title: Backend Code Labs
aliases: [Backend Mechanism Labs, TypeScript Express Labs]
track: 07-Backend
topic: backend-code-labs
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/README|Backend]]"]
tags: [backend, typescript, express, labs, auth, reliability, caching]
created: 2026-07-22
updated: 2026-07-22
---

# Backend Code Labs

From-scratch, product-service-level labs for the mechanisms every
TypeScript/Express backend leans on: an Express-clone middleware pipeline,
schema validation with `problem+json` errors, session and HMAC-signed
access-token auth, RBAC, timeouts/retries/idempotency, a token-bucket rate
limiter, cache-aside with a stampede lock, an in-process job queue,
repository + unit-of-work, and an OpenAPI-ish contract smoke check. Code is
MIT licensed.

Mirrors [[06-NodeJS/code/README|the Node.js code labs]] project layout and
tooling: **TypeScript + Vitest**, no build step. Unlike the Node labs (which
deliberately stay at the `node:*` host layer), this project depends on
**`express`** — these labs are about product-service mechanisms *built on
top of* the Node host, not the host itself. Every timing-sensitive lab
takes an injectable clock/sleep/random function so the suite never races
real timers, and every lab prefers an in-memory fake over a real
Postgres/Redis/Kafka dependency — see each module's "why no real X" note
below.

## Labs

- `expressLite.ts` — a framework-free clone of Express's core mechanism:
  an ordered layer stack, `use`/`get`/`post`, mounted sub-routers with
  prefix stripping, `next()`/`next(err)`, and error-middleware detection by
  arity (`fn.length === 4`), exactly like real Express. See
  [[07-Backend/02-Frameworks-and-Middleware/Express Clone Design|Express Clone Design]].
- `validate.ts` — a hand-rolled, zod-flavored schema validator producing
  RFC 7807 `application/problem+json` error documents, plus an Express
  middleware/error-handler pair. See
  [[07-Backend/03-Validation-Errors-and-Versioning/Problem Details and Error Envelopes|Problem Details and Error Envelopes]].
- `auth.ts` — `scrypt`-based password hashing/verification, an in-memory
  session-token store with TTL expiry, and JWT-like HMAC-signed access
  tokens (sign/verify) plus a bearer-auth Express middleware. See
  [[07-Backend/04-Authentication/Password Hashing and Credential Storage|Password Hashing]]
  and
  [[07-Backend/04-Authentication/JWT Access Tokens and Claims|JWT Access Tokens]].
- `rbac.ts` — a `role -> permission[]` map, `hasPermission`/
  `requirePermission`, and an Express `requirePermissionMiddleware`
  factory. See
  [[07-Backend/05-Authorization-and-Tenancy/RBAC and Permission Modeling|RBAC and Permission Modeling]].
- `reliability.ts` — `withTimeout`, full-jitter `retryWithJitter`, and a
  singleflight `IdempotencyStore`. See
  [[07-Backend/06-Reliability-and-Abuse-Resistance/Retries Jitter and Idempotent Handlers|Retries Jitter and Idempotent Handlers]].
- `rateLimit.ts` — an in-memory token-bucket limiter (`tryConsume`) plus an
  Express `429`-with-`Retry-After` middleware. See
  [[07-Backend/06-Reliability-and-Abuse-Resistance/Rate Limiting and Quotas|Rate Limiting and Quotas]].
- `cacheAside.ts` — cache-aside `getOrLoad` with TTL and a per-key
  singleflight stampede lock. See
  [[07-Backend/07-Caching-Jobs-and-Messaging/Cache-Aside and TTL Strategies|Cache-Aside and TTL Strategies]].
- `jobQueue.ts` — an in-process FIFO job queue with a concurrency limit and
  per-job retries. See
  [[07-Backend/07-Caching-Jobs-and-Messaging/Background Jobs and Workers|Background Jobs and Workers]].
- `repository.ts` — an in-memory `InMemoryRepository` plus a `UnitOfWork`
  with `begin`/`commit`/`rollback` over `Map` snapshots. See
  [[07-Backend/08-Data-Access-and-Persistence-Patterns/Repository and Unit of Work|Repository and Unit of Work]].
- `openapiSmoke.ts` — a tiny path registry (`ContractSpec`) and a
  `smokeCheckRoutes` diff against a set of implemented routes (pairs with
  `expressLite.ts`'s `Router.listRoutes()`). See
  [[07-Backend/01-HTTP-APIs-and-Contracts/OpenAPI as Executable Contract|OpenAPI as Executable Contract]].

## Run

```bash
npm install
npm test
```

`npm run test:watch` runs Vitest in watch mode while iterating on a lab.

## Design Rules

1. Teach the mechanism; do not claim feature parity with Express, zod,
   jsonwebtoken, bull/BullMQ, or a real ORM.
2. Fail loudly on invalid input — `RangeError`/`TypeError`/typed domain
   errors, never silent coercion or a swallowed default.
3. Deterministic tests, no flaky timing races: every lab with a timing
   dimension (sessions/tokens expiring, rate-limit refill, retry backoff,
   cache TTL, job retry delay) takes an injectable `now`/`sleep`/`random`
   function, so tests control time explicitly instead of racing real
   timers or reaching for `vi.useFakeTimers()`.
4. No placeholders; every exported function is fully implemented and
   tested, including one real-`express()`-server integration suite
   (`tests/expressIntegration.test.ts`) exercising validation, auth, RBAC,
   and rate limiting together over actual HTTP.

## Intentional Simplifications

- **`expressLite.ts`** has no `path-to-regexp` parity (no `*` wildcards, no
  optional/regex params, no `next('route')`), is decoupled from
  `node:http` (its `LiteRequest`/`LiteResponse` are plain in-memory
  objects, not `IncomingMessage`/`ServerResponse`), and supports one level
  of router mounting depth per dispatch call (mounting a router inside a
  mounted router works, but is not specifically stress-tested here).
  Wrapping this with real `node:http` is exactly the bridge
  `06-NodeJS/code/src/httpServer.ts` teaches on the host side.
- **`validate.ts`** has no refinements, unions, discriminated types, or
  value transforms/coercion — every field is validated against exactly one
  declared shape. It is a teaching subset of what zod/ajv/joi provide.
- **`auth.ts`**'s access tokens are JWT-*like*, not a JOSE/JWT
  implementation: no algorithm negotiation (`alg` is always assumed
  `HS256`), no key rotation (`kid`). `scrypt` cost parameters are
  deliberately low so the suite runs in milliseconds — never reuse these
  parameters for real credentials; see the linked note for real guidance
  and use a vetted library (Argon2id, `jose`) in production.
- **`rbac.ts`** has no role hierarchies/inheritance — every role's
  permission list must be exhaustive — and no resource-ownership check
  (see
  [[07-Backend/05-Authorization-and-Tenancy/Resource Ownership Checks|Resource Ownership Checks]]
  for "on *this* row?").
- **`reliability.ts`**'s `withTimeout` cannot cancel an in-flight promise
  (JS promises have no built-in cancellation); a slow operation that later
  settles after the timeout fires is simply ignored, not aborted. Real
  cancellable I/O needs an `AbortSignal` threaded through the operation —
  see
  [[06-NodeJS/07-Timers-Events-and-IPC/AbortSignal Propagation Across Node APIs|AbortSignal Propagation Across Node APIs]].
- **`rateLimit.ts`** and **`cacheAside.ts`** are single-process, in-memory
  only. A multi-instance deployment needs a shared store (Redis, typically,
  with a Lua script for atomic token-bucket updates) — the algorithms
  taught here are identical; only the storage backend changes. See
  [[08-Databases/README|Databases]].
- **`jobQueue.ts`** is in-memory only: a process crash loses every queued
  and in-flight job, and failed jobs retry FIFO (no priority re-ordering,
  no dead-letter queue). Durable delivery needs a real broker or a
  DB-backed outbox table — see
  [[07-Backend/07-Caching-Jobs-and-Messaging/Transactional Outbox and Inbox Patterns|Transactional Outbox and Inbox Patterns]].
- **`repository.ts`**'s `UnitOfWork` supports exactly one transaction depth
  (nesting throws) and has no isolation levels — it is a single-writer,
  single-process stand-in for a real transactional store. Query planning,
  indexes, and real isolation semantics live in
  [[08-Databases/README|Databases]].
- **`openapiSmoke.ts`** is not an OpenAPI parser: no YAML/JSON document
  loading, no `$ref` resolution, no request/response body schema
  validation. It only diffs a documented `{method, path}` set against an
  implemented one after normalizing `:param` naming — real contract
  testing (schemathesis, Dredd) drives many more checks off the full
  document.

## Related Notes

- [[07-Backend/README|Backend]]
- [[07-Backend/02-Frameworks-and-Middleware/Express Clone Design|Express Clone Design]]
- [[07-Backend/03-Validation-Errors-and-Versioning/Problem Details and Error Envelopes|Problem Details and Error Envelopes]]
- [[07-Backend/04-Authentication/Password Hashing and Credential Storage|Password Hashing and Credential Storage]]
- [[07-Backend/04-Authentication/JWT Access Tokens and Claims|JWT Access Tokens and Claims]]
- [[07-Backend/05-Authorization-and-Tenancy/RBAC and Permission Modeling|RBAC and Permission Modeling]]
- [[07-Backend/06-Reliability-and-Abuse-Resistance/Retries Jitter and Idempotent Handlers|Retries Jitter and Idempotent Handlers]]
- [[07-Backend/06-Reliability-and-Abuse-Resistance/Rate Limiting and Quotas|Rate Limiting and Quotas]]
- [[07-Backend/07-Caching-Jobs-and-Messaging/Cache-Aside and TTL Strategies|Cache-Aside and TTL Strategies]]
- [[07-Backend/07-Caching-Jobs-and-Messaging/Background Jobs and Workers|Background Jobs and Workers]]
- [[07-Backend/08-Data-Access-and-Persistence-Patterns/Repository and Unit of Work|Repository and Unit of Work]]
- [[07-Backend/01-HTTP-APIs-and-Contracts/OpenAPI as Executable Contract|OpenAPI as Executable Contract]]
- [[06-NodeJS/code/README|Node.js code labs]] (the host layer these labs sit on top of)

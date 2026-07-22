---
title: Frameworks and Middleware Exercises
aliases: [Frameworks and Middleware Drills]
track: 07-Backend
topic: frameworks-and-middleware-exercises
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/README|Backend]]"]
tags: [exercises, backend, express, middleware, di]
created: 2026-07-22
updated: 2026-07-22
---

# Frameworks and Middleware Exercises

Build and reason about Express middleware pipelines, error middleware, request context, dependency injection, and framework internals without treating the stack as magic.

## Linked Topic

- [[07-Backend/02-Frameworks-and-Middleware/Express Application and Router Internals|Express Application and Router Internals]]
- [[07-Backend/02-Frameworks-and-Middleware/Middleware Pipeline and Error Middleware|Middleware Pipeline and Error Middleware]]
- [[07-Backend/02-Frameworks-and-Middleware/Request Context and Async Local Storage|Request Context and Async Local Storage]]
- [[07-Backend/02-Frameworks-and-Middleware/Dependency Injection for Services|Dependency Injection for Services]]
- [[07-Backend/02-Frameworks-and-Middleware/Fastify Contrast and Plugin Model Concepts|Fastify Contrast and Plugin Model Concepts]]
- [[07-Backend/02-Frameworks-and-Middleware/Express Clone Design|Express Clone Design]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Draw the Express request pipeline for `app.use(logger)` → `app.use('/api', router)` → route handler → error middleware. Label when `next()` is required and when errors propagate.

**Hint:** [[07-Backend/02-Frameworks-and-Middleware/Middleware Pipeline and Error Middleware|Middleware Pipeline and Error Middleware]].

**Acceptance criteria:**

- [ ] Mermaid flow with sync vs async middleware paths
- [ ] Four-argument error handler distinguished from regular middleware
- [ ] Handoff to [[06-NodeJS/05-Networking/http and https Platform Servers|http Platform Servers]] for socket layer

### Problem 2 — `intermediate`

**Prompt:** Compare Express router mounting vs Fastify plugin encapsulation. When does prefix isolation prevent middleware leakage?

**Hint:** [[07-Backend/02-Frameworks-and-Middleware/Fastify Contrast and Plugin Model Concepts|Fastify Contrast and Plugin Model Concepts]].

**Acceptance criteria:**

- [ ] Table with scope, error handling, and perf notes
- [ ] Example of accidental global middleware in Express
- [ ] When to choose each framework

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[07-Backend/code/README|code labs]], implement middleware that assigns a UUID request ID, attaches it to `req`, and echoes it in `X-Request-Id` on every response.

**Acceptance criteria:**

- [ ] Runs before route handlers
- [ ] Preserved on error responses via error middleware
- [ ] Test asserts header on 404 and 500 paths

### Problem 2 — `intermediate`

**Prompt:** Wire AsyncLocalStorage so services can read `requestId` and `tenantId` without passing them through every function parameter.

**Hint:** [[07-Backend/02-Frameworks-and-Middleware/Request Context and Async Local Storage|Request Context and Async Local Storage]].

**Acceptance criteria:**

- [ ] Context set at middleware entry; cleared on response finish
- [ ] Async handler chain preserves context
- [ ] Test covers `setImmediate` and `Promise` boundaries

## Optimize

### Problem 1 — `intermediate`

**Prompt:** A monolithic `app.ts` registers 40 middleware functions. Propose module boundaries, lazy router loading, and DI container registration order.

**Hint:** [[07-Backend/02-Frameworks-and-Middleware/Dependency Injection for Services|Dependency Injection for Services]].

**Acceptance criteria:**

- [ ] Startup diagram with ordered registration
- [ ] Circular dependency detection strategy
- [ ] Measurable cold-start improvement hypothesis

### Problem 2 — `advanced`

**Prompt:** Implement a minimal Express clone (router + middleware stack + error handler) per [[07-Backend/02-Frameworks-and-Middleware/Express Clone Design|Express Clone Design]]. Match behavior for path params and `next(err)`.

**Acceptance criteria:**

- [ ] Stack execution matches Express ordering semantics
- [ ] Path params extracted correctly
- [ ] Test suite ported from clone design note

## Debug

### Problem 1 — `intermediate`

**Prompt:** Error middleware never runs—clients get hung connections. List five pipeline mistakes (missing `next`, async without try/catch, wrong arity) and reproduce one.

**Acceptance criteria:**

- [ ] Minimal repro with fix
- [ ] Mermaid of broken vs fixed pipeline
- [ ] Link to [[02-JavaScript/07-Production-JavaScript/Error Design and Exception Safety|Error Design and Exception Safety]]

### Problem 2 — `advanced`

**Prompt:** Request context is lost after `await` in some handlers but not others. Diagnose ALS vs manual `req` attachment; document safe patterns.

**Acceptance criteria:**

- [ ] Root cause tied to context store lifecycle
- [ ] Forbidden patterns listed (detached callbacks)
- [ ] Regression test for context leak across requests

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Deploy behind nginx with `trust proxy` misconfigured—rate limits and audit logs show wrong client IP. Fix middleware order and proxy trust settings.

**Acceptance criteria:**

- [ ] Correct `app.set('trust proxy', …)` documented
- [ ] Middleware reads `X-Forwarded-For` only when trusted
- [ ] Security note on header spoofing without proxy

### Problem 2 — `advanced`

**Prompt:** Platform mandates OpenTelemetry auto-instrumentation but custom middleware breaks span parenting. Design middleware wrapper preserving trace context across async gaps.

**Acceptance criteria:**

- [ ] Span start/end aligned with request lifecycle
- [ ] Error spans record exception attributes
- [ ] Handoff to [[07-Backend/09-API-Observability-and-Testing/Distributed Tracing Across Handlers|Distributed Tracing Across Handlers]]

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Pipeline model | "Middleware runs first" | Order, async errors, error middleware arity |
| Implementation | Global singletons everywhere | ALS context, DI, testable service wiring |
| Production | Ignores proxy trust | Correct client IP, trace propagation, modular startup |

## Related Notes

- [[07-Backend/code/README|code labs]]
- [[07-Backend/_interview/Frameworks and Middleware Interview.md|Frameworks and Middleware Interview]]
- [[07-Backend/README|Backend]]
- [[Career/README|Career]]

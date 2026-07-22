---
title: Frameworks and Middleware Interview
aliases: [Frameworks and Middleware Interview Questions]
track: 07-Backend
topic: frameworks-and-middleware-interview
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/02-Frameworks-and-Middleware/Middleware Pipeline and Error Middleware|Middleware Pipeline and Error Middleware]]"]
tags: [interviews, backend, express, middleware]
created: 2026-07-22
updated: 2026-07-22
---

# Frameworks and Middleware Interview

## Linked Topic

- [[07-Backend/02-Frameworks-and-Middleware/Express Application and Router Internals|Express Application and Router Internals]]
- [[07-Backend/02-Frameworks-and-Middleware/Middleware Pipeline and Error Middleware|Middleware Pipeline and Error Middleware]]
- [[07-Backend/02-Frameworks-and-Middleware/Request Context and Async Local Storage|Request Context and Async Local Storage]]
- [[07-Backend/02-Frameworks-and-Middleware/Dependency Injection for Services|Dependency Injection for Services]]
- [[07-Backend/02-Frameworks-and-Middleware/Fastify Contrast and Plugin Model Concepts|Fastify Contrast and Plugin Model Concepts]]
- [[07-Backend/02-Frameworks-and-Middleware/Express Clone Design|Express Clone Design]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Draw middleware stack order before coding answers.
3. Explain async error propagation and error middleware arity.
4. Close with proxy trust and observability hooks.

## Contracts

1. What is the middleware contract in Express — sync, async, and error handlers?

   - When `next()` is required
   - Four-argument error middleware
   - Hung response failure modes

2. Where should cross-cutting concerns live vs route handlers?

   - Logging, auth, validation, metrics
   - Thin handlers principle
   - Testability implications

## Internal Implementation

3. Walk through Express router matching for `app.use('/api', router)` and param routes.

   - Stack order and mount path stripping
   - `mergeParams` behavior
   - 404 vs 405 handling

4. Compare Express middleware model to Fastify plugin encapsulation.

   - Scope isolation
   - Performance characteristics (high level)
   - Error handling differences

## Coding

5. Implement request ID middleware that survives thrown errors.

   - Set header on success and failure
   - ALS or `req` attachment
   - Test both paths

6. Fix async route handler that swallows errors — minimal diff.

   - try/catch vs wrapper utility
   - Promise rejection to `next(err)`
   - Regression test

## Runtime Assumptions

7. When does AsyncLocalStorage lose request context?

   - Detached callbacks, wrong `await` boundaries
   - Pool workers (if any)
   - Safe patterns for background work

8. How do you structure DI for repositories and services in Express?

   - Constructor injection vs factory per request
   - Avoid global singletons for tenant state
   - Test module overrides

## Production Judgment

9. `trust proxy` misconfigured — impact on rate limits and audit logs.

   - Spoofed `X-Forwarded-For`
   - Correct hop count
   - nginx config alignment

10. OpenTelemetry spans break across middleware — fix parenting.

    - Span start at request edge
    - Error attributes on spans
    - Link to tracing note

## Staff-Level Selection

11. Standardize middleware stack for all services — mandatory vs optional.

    - Published stack diagram
    - Versioned shared package
    - Exception approval process

12. Team wants raw `http` only — assess operational cost.

    - Security and observability gaps
    - Minimum framework feature set
    - Escape hatch for perf-critical paths

13. Implement Express clone — what behaviors must match for drop-in tests?

    - Stack execution order
    - `next('route')` and param routing edge cases
    - Error propagation semantics

14. Monolithic 3k-line `app.ts` — migration strategy without freeze.

    - Router modules by domain
    - Incremental DI introduction
    - Risk reduction per PR

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Pipeline | "Middleware runs first" | Order, async errors, error handler arity |
| Context | Pass 5 params everywhere | ALS/DI with leak-safe lifecycle |
| Production | Ignores proxy | Trust config, tracing, org middleware standards |

## Related Notes

- [[Career/README|Career]]
- [[07-Backend/_exercises/Frameworks and Middleware Exercises.md|Frameworks and Middleware Exercises]]
- [[07-Backend/code/README|code labs]]
- [[07-Backend/README|Backend]]

---
title: Caching Jobs and Messaging Exercises
aliases: [Caching Jobs and Messaging Drills]
track: 07-Backend
topic: caching-jobs-and-messaging-exercises
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/README|Backend]]"]
tags: [exercises, backend, caching, jobs, messaging, outbox]
created: 2026-07-22
updated: 2026-07-22
---

# Caching Jobs and Messaging Exercises

Implement cache-aside, stampede protection, session stores, background jobs, transactional outbox/inbox, and queue client patterns as application concerns—not broker internals.

## Linked Topic

- [[07-Backend/07-Caching-Jobs-and-Messaging/Cache-Aside and TTL Strategies|Cache-Aside and TTL Strategies]]
- [[07-Backend/07-Caching-Jobs-and-Messaging/Cache Stampede and Soft Expiry|Cache Stampede and Soft Expiry]]
- [[07-Backend/07-Caching-Jobs-and-Messaging/Session and Feature Stores as Products|Session and Feature Stores as Products]]
- [[07-Backend/07-Caching-Jobs-and-Messaging/Background Jobs and Workers|Background Jobs and Workers]]
- [[07-Backend/07-Caching-Jobs-and-Messaging/Transactional Outbox and Inbox Patterns|Transactional Outbox and Inbox Patterns]]
- [[07-Backend/07-Caching-Jobs-and-Messaging/Message Queue Client Patterns|Message Queue Client Patterns]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Contrast cache-aside, read-through, and write-through for a product catalog API. Which invalidates on admin update?

**Hint:** [[07-Backend/07-Caching-Jobs-and-Messaging/Cache-Aside and TTL Strategies|Cache-Aside and TTL Strategies]].

**Acceptance criteria:**

- [ ] Three patterns with read/write sequence diagrams
- [ ] Stale read window quantified
- [ ] Handoff to [[08-Databases/README|Databases]] for Redis engine details

### Problem 2 — `intermediate`

**Prompt:** Explain cache stampede on hot key expiry. Compare lock-based recomputation vs probabilistic early expiration.

**Hint:** [[07-Backend/07-Caching-Jobs-and-Messaging/Cache Stampede and Soft Expiry|Cache Stampede and Soft Expiry]].

**Acceptance criteria:**

- [ ] Thundering herd mechanism described
- [ ] Two mitigations with trade-offs
- [ ] When soft TTL is insufficient

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[07-Backend/code/README|code labs]], wrap `getProduct(id)` with cache-aside using in-memory Map; TTL 60s; delete cache on `PUT`.

**Acceptance criteria:**

- [ ] Cache miss loads DB; hit skips DB
- [ ] Explicit invalidation on write
- [ ] Tests prove stale data window bounded

### Problem 2 — `intermediate`

**Prompt:** Add stampede lock: only one worker recomputes hot key; others wait or serve stale within grace period.

**Acceptance criteria:**

- [ ] Lock timeout prevents deadlock
- [ ] Metrics for lock contention
- [ ] Test simulates concurrent misses

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Move session store from memory to Redis-compatible interface without changing route handlers. Define session product contract (TTL slide, fixation defense).

**Hint:** [[07-Backend/07-Caching-Jobs-and-Messaging/Session and Feature Stores as Products|Session and Feature Stores as Products]].

**Acceptance criteria:**

- [ ] Port interface for session store
- [ ] Regenerate session ID on privilege change
- [ ] Cross-link to [[07-Backend/04-Authentication/Sessions Cookies and CSRF Boundaries|Sessions and CSRF]]

### Problem 2 — `advanced`

**Prompt:** Implement in-process job queue with retry, backoff, and dead-letter queue for failed email sends.

**Hint:** [[07-Backend/07-Caching-Jobs-and-Messaging/Background Jobs and Workers|Background Jobs and Workers]].

**Acceptance criteria:**

- [ ] At-least-once processing with idempotent handler
- [ ] DLQ inspection endpoint (admin-guarded)
- [ ] Graceful worker shutdown finishes current job

## Debug

### Problem 1 — `intermediate`

**Prompt:** Users see old prices after update—cache invalidation missed related keys (`product:123`, `list:featured`). Design key taxonomy and cascade invalidation.

**Acceptance criteria:**

- [ ] Key naming convention documented
- [ ] Invalidation on write covers derived keys
- [ ] Cache hit ratio monitoring

### Problem 2 — `advanced`

**Prompt:** Order created in DB but event never published—process crashed after commit. Implement transactional outbox with polling publisher.

**Hint:** [[07-Backend/07-Caching-Jobs-and-Messaging/Transactional Outbox and Inbox Patterns|Transactional Outbox and Inbox Patterns]].

**Acceptance criteria:**

- [ ] Outbox row in same transaction as order
- [ ] Publisher marks processed; retries on failure
- [ ] Idempotent consumer on inbox side

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Flash sale causes 10× read load. Plan cache warming, request coalescing, and queue-backed order processing without overselling inventory.

**Acceptance criteria:**

- [ ] Inventory check inside transaction or optimistic lock
- [ ] Async checkout job with status polling API
- [ ] Rate limit on checkout endpoint

### Problem 2 — `advanced`

**Prompt:** Migrate from synchronous HTTP fan-out to message queue for `OrderPlaced` events. Define schema versioning, poison message handling, and observability.

**Hint:** [[07-Backend/07-Caching-Jobs-and-Messaging/Message Queue Client Patterns|Message Queue Client Patterns]].

**Acceptance criteria:**

- [ ] Consumer ack/nack semantics documented
- [ ] Schema evolution with compatibility checks
- [ ] Traces span publish → consume

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Caching | TTL only | Cache-aside, invalidation taxonomy, stampede control |
| Jobs | Fire-and-forget setTimeout | Retries, DLQ, graceful shutdown, idempotent handlers |
| Consistency | Dual write HTTP + DB | Transactional outbox, handoff to Databases for broker ops |

## Related Notes

- [[07-Backend/code/README|code labs]]
- [[07-Backend/_interview/Caching Jobs and Messaging Interview.md|Caching Jobs and Messaging Interview]]
- [[07-Backend/README|Backend]]
- [[Career/README|Career]]

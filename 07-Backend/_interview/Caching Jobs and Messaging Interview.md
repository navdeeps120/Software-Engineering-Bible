---
title: Caching Jobs and Messaging Interview
aliases: [Caching Jobs and Messaging Interview Questions]
track: 07-Backend
topic: caching-jobs-and-messaging-interview
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/07-Caching-Jobs-and-Messaging/Cache-Aside and TTL Strategies|Cache-Aside and TTL Strategies]]"]
tags: [interviews, backend, caching, jobs, outbox]
created: 2026-07-22
updated: 2026-07-22
---

# Caching Jobs and Messaging Interview

## Linked Topic

- [[07-Backend/07-Caching-Jobs-and-Messaging/Cache-Aside and TTL Strategies|Cache-Aside and TTL Strategies]]
- [[07-Backend/07-Caching-Jobs-and-Messaging/Cache Stampede and Soft Expiry|Cache Stampede and Soft Expiry]]
- [[07-Backend/07-Caching-Jobs-and-Messaging/Session and Feature Stores as Products|Session and Feature Stores as Products]]
- [[07-Backend/07-Caching-Jobs-and-Messaging/Background Jobs and Workers|Background Jobs and Workers]]
- [[07-Backend/07-Caching-Jobs-and-Messaging/Transactional Outbox and Inbox Patterns|Transactional Outbox and Inbox Patterns]]
- [[07-Backend/07-Caching-Jobs-and-Messaging/Message Queue Client Patterns|Message Queue Client Patterns]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Draw read/write paths for cache patterns before broker details.
3. State consistency window and invalidation rules explicitly.
4. Close with handoff to Databases for engine internals.

## Contracts

1. Compare cache-aside, read-through, write-through.

   - Who loads on miss
   - Invalidation on update
   - Stale read window

2. What is cache stampede and how do you mitigate it?

   - Lock-based single flight
   - Probabilistic early expiration
   - Serve stale grace period

## Jobs and Queues

3. Design background job for email send — retries, DLQ, idempotency.

   - At-least-once semantics
   - Handler idempotency key
   - Graceful worker shutdown

4. Explain transactional outbox — why dual HTTP+DB write fails.

   - Same transaction as business write
   - Polling publisher
   - Idempotent consumer

## Session Stores

5. Move sessions from memory to Redis-compatible store — product contract.

   - TTL slide on activity
   - Regenerate session ID on privilege change
   - CSRF boundary unchanged

6. Feature flag store as product — evaluation cache and invalidation.

   - Per-tenant flags
   - Stale flag risk
   - Kill switch semantics

## Coding

7. Implement cache-aside with explicit invalidation on update.

   - Key taxonomy
   - Test stale window bounded
   - Metrics hit/miss

8. Review code that publishes event before DB commit — fix with outbox.

   - Ordering guarantee
   - Retry of publisher
   - Consumer dedup

## Production Judgment

9. Flash sale — cache warming, coalescing, inventory correctness.

   - Transaction or optimistic lock
   - Async checkout job
   - Oversell prevention

10. Hot key invalidation misses related list keys — key design fix.

    - Cascade invalidation rules
    - Monitoring hit ratio
    - Prefix vs tag invalidation (conceptual)

## Staff-Level Selection

11. Migrate sync HTTP fan-out to message queue — schema versioning plan.

    - Compatibility checks
    - Poison message handling
    - Trace publish to consume

12. When is cache unnecessary complexity for a new service?

    - Read/write ratio and latency SLO
    - Cost of invalidation bugs
    - Measure before adding Redis

13. Outbox table growth — retention, archiving, and replay safety.

    - Processed marker
    - Replay idempotency
    - Operational alerts

14. Job queue vs workflow engine — decision criteria for backend team.

    - Saga complexity
    - Operational ownership
    - Handoff to System Design

15. Cross-region cache consistency — what backend owns vs Databases.

    - TTL acceptance
    - Invalidation broadcast cost
    - User-visible staleness policy

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Caching | "Add Redis" | Pattern choice, invalidation, stampede control |
| Jobs | setTimeout fire-and-forget | Retries, DLQ, shutdown, idempotent handlers |
| Consistency | Dual write | Outbox/inbox, engine handoff, inventory safety |

## Related Notes

- [[Career/README|Career]]
- [[07-Backend/_exercises/Caching Jobs and Messaging Exercises.md|Caching Jobs and Messaging Exercises]]
- [[07-Backend/code/README|code labs]]
- [[07-Backend/README|Backend]]

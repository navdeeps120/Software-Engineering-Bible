---
title: "Backend Service Toolkit — Database"
aliases: []
track: 07-Backend
topic: backend-service-toolkit-database
difficulty: beginner
status: active
prerequisites: []
tags: [project, backend, database]
created: 2026-07-22
updated: 2026-07-22
---

# Database — Backend Service Toolkit

## Status: Application Patterns Only

This portfolio uses **repository ports and fake in-memory adapters**. It does not implement a database engine, run migrations against production engines, or teach index/WAL/isolation internals.

## Data Stance

| Concern | Approach |
| --- | --- |
| Persistent entities | In-memory maps inside `FakeDbAdapter` for labs |
| Outbox/job state | Same fake store with transactional wrapper |
| Idempotency keys | TTL map in process memory |
| Session/refresh tokens | In-memory or hashed store in auth module |
| Fixture data | JSON under [[07-Backend/code/tests/fixtures|tests/fixtures]] |
| Secrets | Environment variables; never persisted by toolkit |

```mermaid
flowchart LR
    Service[LinkService / OutboxWorker] --> Repo[Repository port]
    Repo --> Fake[FakeDbAdapter]
    Fake -->|process exit| Gone[State discarded]
```

## Application Schema (Logical)

Documented for URL shortener and outbox labs—not DDL for a specific engine:

| Entity | Key fields | Notes |
| --- | --- | --- |
| Link | id, shortCode, targetUrl, createdAt | unique shortCode |
| OutboxEvent | id, type, payload, status, attempts | status enum |
| IdempotencyRecord | key, responseFingerprint, expiresAt | TTL enforced |
| User | id, email, passwordHash, roles | auth lab |
| RefreshToken | id, userId, hash, familyId | rotation |

## Handoff to Databases Track

When learners need durability, indexes, and isolation:

- [[07-Backend/08-Data-Access-and-Persistence-Patterns/Handing Off to Database Engines|Handing Off to Database Engines]]
- [[08-Databases/README|Databases]]
- Keep repository interface—swap `FakeDbAdapter` for Postgres/SQLite adapter in a **separate** project.

## Rationale

The learning goal is service-layer contracts—transactions as used by services, outbox pattern, repository boundaries—not storage engine construction.

## Related Documents

- [[07-Backend/projects/Backend Service Toolkit/Architecture|Architecture]]
- [[07-Backend/projects/Backend Service Toolkit/ADR/ADR-005 Outbox vs Dual-Write|ADR-005]]
- [[07-Backend/projects/URL Shortener API/Architecture|URL Shortener Architecture]]

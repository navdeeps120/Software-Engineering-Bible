---
title: HTTP APIs and Contracts Exercises
aliases: [HTTP APIs and Contracts Drills]
track: 07-Backend
topic: http-apis-and-contracts-exercises
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/README|Backend]]"]
tags: [exercises, backend, http, rest, openapi]
created: 2026-07-22
updated: 2026-07-22
---

# HTTP APIs and Contracts Exercises

Design REST-style resource contracts with explicit status policy, pagination, idempotency keys, content negotiation, and OpenAPI as an executable contract.

## Linked Topic

- [[07-Backend/01-HTTP-APIs-and-Contracts/Resource Modeling and REST Semantics|Resource Modeling and REST Semantics]]
- [[07-Backend/01-HTTP-APIs-and-Contracts/Status Codes as Product Policy|Status Codes as Product Policy]]
- [[07-Backend/01-HTTP-APIs-and-Contracts/Content Negotiation and Payload Design|Content Negotiation and Payload Design]]
- [[07-Backend/01-HTTP-APIs-and-Contracts/Pagination Filtering and Sorting Contracts|Pagination Filtering and Sorting Contracts]]
- [[07-Backend/01-HTTP-APIs-and-Contracts/Idempotency Keys and Safe Retries|Idempotency Keys and Safe Retries]]
- [[07-Backend/01-HTTP-APIs-and-Contracts/OpenAPI as Executable Contract|OpenAPI as Executable Contract]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Model a `Book` resource with nested `Author` references. Decide which operations are safe (GET), idempotent (PUT), and non-idempotent (POST). Document expected status codes for create, conflict, and not-found.

**Hint:** [[07-Backend/01-HTTP-APIs-and-Contracts/Resource Modeling and REST Semantics|Resource Modeling and REST Semantics]].

**Acceptance criteria:**

- [ ] URI design avoids verb-heavy paths
- [ ] Status policy references [[07-Backend/01-HTTP-APIs-and-Contracts/Status Codes as Product Policy|Status Codes as Product Policy]]
- [ ] Mermaid state diagram for resource lifecycle

### Problem 2 — `intermediate`

**Prompt:** Define a cursor-based pagination contract for `/books`: query params, response envelope, stable ordering guarantees, and empty-page semantics.

**Hint:** [[07-Backend/01-HTTP-APIs-and-Contracts/Pagination Filtering and Sorting Contracts|Pagination Filtering and Sorting Contracts]].

**Acceptance criteria:**

- [ ] Cursor opaque to clients; sort key documented
- [ ] `Link` header or JSON `nextCursor` field specified
- [ ] Breaking-change risk if sort field changes

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[07-Backend/code/README|code labs]], implement `GET /books` and `POST /books` with JSON payloads, correct `Content-Type` enforcement, and 415/400/201/409 responses.

**Acceptance criteria:**

- [ ] Rejects non-JSON bodies with 415
- [ ] Validation errors use consistent envelope (stub for problem+json)
- [ ] Supertest or contract test fixtures checked in

### Problem 2 — `intermediate`

**Prompt:** Add idempotency-key support to `POST /payments`: header name, storage TTL, replay semantics, and conflict when key reused with different body.

**Hint:** [[07-Backend/01-HTTP-APIs-and-Contracts/Idempotency Keys and Safe Retries|Idempotency Keys and Safe Retries]].

**Acceptance criteria:**

- [ ] Same key + same body returns cached 201 response
- [ ] Same key + different body returns 409
- [ ] Storage backend abstracted (in-memory OK for lab)

## Optimize

### Problem 1 — `intermediate`

**Prompt:** A list endpoint returns 500KB JSON per page. Propose field selection (`?fields=`), sparse collections, and compression policy without breaking the public contract.

**Hint:** [[07-Backend/01-HTTP-APIs-and-Contracts/Content Negotiation and Payload Design|Content Negotiation and Payload Design]].

**Acceptance criteria:**

- [ ] Default vs expanded representation documented
- [ ] Backward-compatible additive fields strategy
- [ ] Expected payload size reduction estimated

### Problem 2 — `advanced`

**Prompt:** Generate OpenAPI from route definitions (or maintain hand-written spec) and wire CI to fail on undocumented routes or schema drift.

**Acceptance criteria:**

- [ ] OpenAPI covers all public routes
- [ ] CI compares spec to implementation or golden responses
- [ ] Link to [[07-Backend/01-HTTP-APIs-and-Contracts/OpenAPI as Executable Contract|OpenAPI as Executable Contract]]

## Debug

### Problem 1 — `intermediate`

**Prompt:** Mobile clients report intermittent 404 on `GET /books/:id` after creates. Trace race between read replica lag and 201 response. Propose contract fix.

**Acceptance criteria:**

- [ ] Identifies consistency window
- [ ] At least two mitigations (read-your-writes, strong read after create)
- [ ] Client retry policy documented

### Problem 2 — `advanced`

**Prompt:** API gateway transforms status codes (502 → 500). Support cannot distinguish upstream vs service faults. Design error contract preserving diagnostic headers safely.

**Acceptance criteria:**

- [ ] Problem+json fields for `type`, `title`, `status`, `instance`
- [ ] Correlation ID propagation specified
- [ ] No internal stack traces in public envelope

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Product wants to rename `customerId` to `accountId` in JSON. Draft additive migration: dual fields, sunset header, and compatibility window.

**Acceptance criteria:**

- [ ] Timeline with deprecation notices
- [ ] Telemetry for old field usage
- [ ] Rollback plan if clients break

### Problem 2 — `advanced`

**Prompt:** Partner integration requires guaranteed idempotent bulk import (10k records). Design endpoint, chunking, idempotency scope, and status polling contract.

**Acceptance criteria:**

- [ ] Batch job resource with `202 Accepted` pattern
- [ ] Per-chunk idempotency keys
- [ ] SLA for completion and partial failure reporting

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Contract design | CRUD without status policy | Resources, idempotency, pagination, and evolution strategy |
| Implementation | Ad-hoc JSON responses | Content-Type enforcement, idempotency store, OpenAPI alignment |
| Production | Breaking rename in one release | Compatibility windows, telemetry, partner bulk contracts |

## Related Notes

- [[07-Backend/code/README|code labs]]
- [[07-Backend/_interview/HTTP APIs and Contracts Interview.md|HTTP APIs and Contracts Interview]]
- [[07-Backend/README|Backend]]
- [[Career/README|Career]]

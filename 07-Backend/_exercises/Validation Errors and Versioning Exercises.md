---
title: Validation Errors and Versioning Exercises
aliases: [Validation Errors and Versioning Drills]
track: 07-Backend
topic: validation-errors-and-versioning-exercises
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/README|Backend]]"]
tags: [exercises, backend, validation, errors, versioning]
created: 2026-07-22
updated: 2026-07-22
---

# Validation Errors and Versioning Exercises

Enforce schema validation at the edge, emit problem+json error envelopes, apply API versioning strategies, and manage breaking changes with compatibility windows.

## Linked Topic

- [[07-Backend/03-Validation-Errors-and-Versioning/Schema Validation at the Edge|Schema Validation at the Edge]]
- [[07-Backend/03-Validation-Errors-and-Versioning/Problem Details and Error Envelopes|Problem Details and Error Envelopes]]
- [[07-Backend/03-Validation-Errors-and-Versioning/API Versioning Strategies|API Versioning Strategies]]
- [[07-Backend/03-Validation-Errors-and-Versioning/Breaking Changes and Compatibility Windows|Breaking Changes and Compatibility Windows]]
- [[07-Backend/03-Validation-Errors-and-Versioning/Input Limits Uploads and Content-Type Enforcement|Input Limits Uploads and Content-Type Enforcement]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Compare validating in route handlers vs dedicated validation middleware vs domain layer. Where should unknown fields be stripped or rejected?

**Hint:** [[07-Backend/03-Validation-Errors-and-Versioning/Schema Validation at the Edge|Schema Validation at the Edge]].

**Acceptance criteria:**

- [ ] Three-layer diagram with failure response ownership
- [ ] `additionalProperties: false` trade-off stated
- [ ] Cross-link to [[07-Backend/01-HTTP-APIs-and-Contracts/Status Codes as Product Policy|Status Codes as Product Policy]]

### Problem 2 — `intermediate`

**Prompt:** Contrast URL path versioning (`/v2/`), header versioning (`Accept-Version`), and content negotiation. Pick one default for a public B2B API and defend it.

**Hint:** [[07-Backend/03-Validation-Errors-and-Versioning/API Versioning Strategies|API Versioning Strategies]].

**Acceptance criteria:**

- [ ] Pros/cons table for three strategies
- [ ] Caching and CDN implications noted
- [ ] Default choice with rollback story

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[07-Backend/code/README|code labs]], add Zod (or JSON Schema) validation middleware returning RFC 7807 problem+json on 400 with field-level `errors[]`.

**Acceptance criteria:**

- [ ] `Content-Type: application/problem+json`
- [ ] Stable `type` URI or slug per error class
- [ ] Tests cover missing field and wrong type

### Problem 2 — `intermediate`

**Prompt:** Implement dual-version router: `/v1/users` returns `{ name }`, `/v2/users` returns `{ firstName, lastName }` from shared service layer.

**Acceptance criteria:**

- [ ] Shared domain model; version adapters map outward
- [ ] Deprecation header on v1 responses
- [ ] Contract tests per version

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Validation runs twice (middleware + ORM). Eliminate duplicate work while keeping edge rejection for malicious payloads.

**Acceptance criteria:**

- [ ] Single schema source of truth
- [ ] Performance estimate (parse once)
- [ ] Security: oversized payload still rejected at edge

### Problem 2 — `advanced`

**Prompt:** Design upload endpoint with `multipart` size limits, MIME sniffing policy, and virus-scan hook—without loading entire file into memory.

**Hint:** [[07-Backend/03-Validation-Errors-and-Versioning/Input Limits Uploads and Content-Type Enforcement|Input Limits Uploads and Content-Type Enforcement]].

**Acceptance criteria:**

- [ ] Streaming parser with byte limit
- [ ] 413/415 responses documented
- [ ] Handoff to [[06-NodeJS/04-Buffers-Streams-and-IO/Backpressure and HighWaterMark|Node streams backpressure]]

## Debug

### Problem 1 — `intermediate`

**Prompt:** Clients receive generic 500 instead of 400 for validation failures in production only. Trace env-specific middleware order and error serializer.

**Acceptance criteria:**

- [ ] Repro steps in prod-like config
- [ ] Fix ensures validation errors never hit generic handler
- [ ] Log redaction policy for invalid payloads

### Problem 2 — `advanced`

**Prompt:** v2 clients intermittently hit v1 handlers behind CDN. Debug cache keys, `Vary` headers, and routing rules.

**Acceptance criteria:**

- [ ] Root cause in CDN or gateway config
- [ ] Correct `Vary` or path-based cache partition
- [ ] Monitoring for version mismatch errors

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Publish a breaking change policy: semver for API, 90-day sunset, changelog format, and customer notification channels.

**Hint:** [[07-Backend/03-Validation-Errors-and-Versioning/Breaking Changes and Compatibility Windows|Breaking Changes and Compatibility Windows]].

**Acceptance criteria:**

- [ ] Definition of breaking vs additive change
- [ ] Telemetry gates before removal
- [ ] Mermaid timeline for dual-stack period

### Problem 2 — `advanced`

**Prompt:** Regulatory audit requires immutable error codes for seven years while product wants renamed messages. Design stable `code` + mutable `detail` envelope.

**Acceptance criteria:**

- [ ] Schema versioning for error catalog
- [ ] Client guidance: program to `code`, display `detail`
- [ ] Migration for renamed codes without breaking integrators

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Validation strategy | Validates everywhere or nowhere | Edge rejection, single schema, domain invariants separated |
| Error envelopes | `{ error: "bad request" }` | problem+json with stable types and field paths |
| Versioning | Breaking rename silently | Explicit strategies, sunset, CDN/cache awareness |

## Related Notes

- [[07-Backend/code/README|code labs]]
- [[07-Backend/_interview/Validation Errors and Versioning Interview.md|Validation Errors and Versioning Interview]]
- [[07-Backend/README|Backend]]
- [[Career/README|Career]]

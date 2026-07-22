---
title: HTTP APIs and Contracts Interview
aliases: [HTTP APIs and Contracts Interview Questions]
track: 07-Backend
topic: http-apis-and-contracts-interview
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/01-HTTP-APIs-and-Contracts/Resource Modeling and REST Semantics|Resource Modeling and REST Semantics]]"]
tags: [interviews, backend, http, rest, openapi]
created: 2026-07-22
updated: 2026-07-22
---

# HTTP APIs and Contracts Interview

## Linked Topic

- [[07-Backend/01-HTTP-APIs-and-Contracts/Resource Modeling and REST Semantics|Resource Modeling and REST Semantics]]
- [[07-Backend/01-HTTP-APIs-and-Contracts/Status Codes as Product Policy|Status Codes as Product Policy]]
- [[07-Backend/01-HTTP-APIs-and-Contracts/Content Negotiation and Payload Design|Content Negotiation and Payload Design]]
- [[07-Backend/01-HTTP-APIs-and-Contracts/Pagination Filtering and Sorting Contracts|Pagination Filtering and Sorting Contracts]]
- [[07-Backend/01-HTTP-APIs-and-Contracts/Idempotency Keys and Safe Retries|Idempotency Keys and Safe Retries]]
- [[07-Backend/01-HTTP-APIs-and-Contracts/OpenAPI as Executable Contract|OpenAPI as Executable Contract]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. State resource URI, method, status, and error envelope before implementation details.
3. Name idempotency and pagination semantics explicitly.
4. Close with contract evolution and partner impact.

## Contracts

1. Design REST resources for a library checkout system — URIs, methods, status codes.

   - Avoid verb paths; nouns and sub-resources
   - 201/409/404 policy
   - Link to [[07-Backend/01-HTTP-APIs-and-Contracts/Status Codes as Product Policy|Status Codes as Product Policy]]

2. When is 404 vs 403 the correct choice for unauthorized resource access?

   - Enumeration vs honesty trade-off
   - Multi-tenant APIs
   - Consistency with auth middleware

## Idempotency and Retries

3. Explain idempotency keys for `POST /payments`.

   - Header name, storage TTL, replay body hash
   - Conflict when key reused with different payload
   - Client retry guidance

4. Which HTTP methods are safe/idempotent by default? Where do keys still help?

   - GET/HEAD safe; PUT/DELETE idempotent caveats
   - Network timeouts mid-response
   - Gateway duplicate delivery

## Pagination and Payloads

5. Compare offset vs cursor pagination for a high-churn feed.

   - Stable sort keys
   - Duplicate/missing rows with offset
   - Response envelope design

6. How do you shrink list payloads without breaking clients?

   - Sparse fieldsets, expansion links
   - Additive schema evolution
   - Compression and caching headers

## OpenAPI and Testing

7. How do you keep OpenAPI in sync with implementation?

   - Spec-first vs code-first
   - CI contract tests
   - Undocumented route detection

8. Review OpenAPI snippet missing error responses — fix and defend.

   - problem+json schemas per status
   - Examples for validation errors
   - Consumer-driven contract tests

## Production Judgment

9. Partner bulk import API — design job resource, idempotency, and polling.

   - 202 Accepted pattern
   - Partial failure reporting
   - SLA and timeout expectations

10. Rename JSON field in production — migration plan without breaking mobile apps.

    - Dual fields, deprecation header, telemetry
    - Compatibility window length
    - Rollback triggers

## Staff-Level Selection

11. How would you standardize status and error policy org-wide?

    - Published decision tree (400 vs 422 vs 409)
    - Forbidden patterns (200 with error body)
    - Lint or review bot enforcement

12. Public API v1 frozen — how do you ship breaking changes responsibly?

    - Version strategy (path vs header)
    - Sunset communications
    - Revenue impact of forced migrations

13. API gateway rewrites 502 to 500 — fix observability and client contracts.

    - Preserve diagnostic headers safely
    - Correlation ID end-to-end
    - Gateway vs origin responsibility matrix

14. Design idempotency storage at scale — TTL, sharding, and cleanup.

    - Key cardinality and storage cost
    - Privacy retention for request bodies
    - Cross-region consistency needs

15. When is REST the wrong contract style for a new product surface?

    - GraphQL, gRPC, event streams trade-offs
    - Operational cost of each
    - Handoff to [[09-System-Design/README|System Design]]

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Resource design | RPC-style verbs in URLs | Nouns, status policy, idempotency |
| Evolution | Silent breaking changes | Versioning, telemetry, partner comms |
| Operations | "Document in wiki" | OpenAPI CI, error catalog, gateway contracts |

## Related Notes

- [[Career/README|Career]]
- [[07-Backend/_exercises/HTTP APIs and Contracts Exercises.md|HTTP APIs and Contracts Exercises]]
- [[07-Backend/code/README|code labs]]
- [[07-Backend/README|Backend]]

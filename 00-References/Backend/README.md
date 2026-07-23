---
title: Backend References
aliases: [Backend References, API Service Sources]
track: 00-References
topic: backend-references
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/README|Backend]]"]
tags: [reference, backend, http, apis, auth, express, openapi, reliability]
created: 2026-07-22
updated: 2026-07-23
---

# Backend References

Primary and high-signal sources for the [[07-Backend/README|Backend]] track. Prefer HTTP semantics, API contract specs, OWASP guidance, OAuth/OIDC standards, framework internals, and reliability engineering writing over tutorial walkthroughs.

## How to Use

1. Read the topic note first (product contract, failure modes, abuse surface, ops trade-offs).
2. Use references to deepen HTTP policy, auth flows, validation envelopes, and reliability patterns—not to skip labs.
3. Run mechanism labs under [[07-Backend/code/README|Backend code labs]] before claiming production API readiness.

## HTTP and API Design

| Source | Why it matters | Best with |
| --- | --- | --- |
| [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) | Methods, status codes, caching, content negotiation | [[07-Backend/01-HTTP-APIs-and-Contracts/Status Codes as Product Policy\|Status Codes as Product Policy]] |
| [RFC 9112 — HTTP/1.1](https://www.rfc-editor.org/rfc/rfc9112.html) | Connection lifecycle, chunked transfer | [[01-Computer-Science/07-Networking-Fundamentals/HTTP as a Protocol\|HTTP as a Protocol]] |
| [RFC 7807 — Problem Details](https://www.rfc-editor.org/rfc/rfc7807.html) | Machine-readable error envelopes | [[07-Backend/03-Validation-Errors-and-Versioning/Problem Details and Error Envelopes\|Problem Details and Error Envelopes]] |
| [Zalando RESTful API Guidelines](https://opensource.zalando.com/restful-api-guidelines/) | Production REST contract discipline | [[07-Backend/01-HTTP-APIs-and-Contracts/Resource Modeling and REST Semantics\|Resource Modeling and REST Semantics]] |
| [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines) | Versioning, pagination, error consistency | [[07-Backend/03-Validation-Errors-and-Versioning/API Versioning Strategies\|API Versioning Strategies]] |
| [JSON:API](https://jsonapi.org/) | Hypermedia and relationship modeling (contrast note) | [[07-Backend/01-HTTP-APIs-and-Contracts/Content Negotiation and Payload Design\|Content Negotiation and Payload Design]] |

## OWASP API Security

| Source | Why it matters | Best with |
| --- | --- | --- |
| [OWASP API Security Top 10](https://owasp.org/API-Security/) | Broken auth, excessive data exposure, mass assignment | [[07-Backend/10-Production-Services/Security Review Checklist for APIs\|Security Review Checklist for APIs]] |
| [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) | Session hygiene, credential storage | [[07-Backend/04-Authentication/Sessions Cookies and CSRF Boundaries\|Sessions Cookies and CSRF Boundaries]] |
| [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) | RBAC pitfalls, IDOR | [[07-Backend/05-Authorization-and-Tenancy/Resource Ownership Checks\|Resource Ownership Checks]] |
| [OWASP Mass Assignment](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html) | Schema validation at the edge | [[07-Backend/03-Validation-Errors-and-Versioning/Schema Validation at the Edge\|Schema Validation at the Edge]] |

## OAuth, OIDC, and Token Flows

| Source | Why it matters | Best with |
| --- | --- | --- |
| [RFC 6749 — OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749.html) | Authorization code, client credentials | [[07-Backend/04-Authentication/OAuth2 and OIDC Application Flows\|OAuth2 and OIDC Application Flows]] |
| [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) | ID tokens, claims, discovery | OAuth2 and OIDC Application Flows |
| [RFC 7519 — JWT](https://www.rfc-editor.org/rfc/rfc7519.html) | Claims, expiry, signature verification | [[07-Backend/04-Authentication/JWT Access Tokens and Claims\|JWT Access Tokens and Claims]] |
| [OAuth 2.0 Security BCP (RFC 9700)](https://www.rfc-editor.org/rfc/rfc9700.html) | PKCE, redirect URI, refresh rotation | [[07-Backend/04-Authentication/Refresh Token Rotation\|Refresh Token Rotation]] |
| [OAuth 2.0 Token Introspection](https://www.rfc-editor.org/rfc/rfc7662.html) | Resource-server validation patterns | [[07-Backend/04-Authentication/Authentication Server Threat Model\|Authentication Server Threat Model]] |

Crypto primitives and threat-model depth hand off to [[18-Security/README|Security]]; this track owns application flows and server boundaries.

## Express and Fastify

| Source | Why it matters | Best with |
| --- | --- | --- |
| [Express.js guide](https://expressjs.com/en/guide/routing.html) | Router, middleware, error handlers | [[07-Backend/02-Frameworks-and-Middleware/Express Application and Router Internals\|Express Application and Router Internals]] |
| [Express error handling](https://expressjs.com/en/guide/error-handling.html) | Four-argument error middleware | [[07-Backend/02-Frameworks-and-Middleware/Middleware Pipeline and Error Middleware\|Middleware Pipeline and Error Middleware]] |
| [Fastify documentation](https://fastify.dev/docs/latest/) | Plugin encapsulation, schema-first validation | [[07-Backend/02-Frameworks-and-Middleware/Fastify Contrast and Plugin Model Concepts\|Fastify Contrast and Plugin Model Concepts]] |
| [Fastify hooks lifecycle](https://fastify.dev/docs/latest/Reference/Hooks/) | Request/reply hook ordering | Middleware Pipeline and Error Middleware |

Thin `http`/`net`/`tls` and libuv semantics belong to [[06-NodeJS/README|Node.js]]; framework docs assume the host contract is understood.

## Reliability Engineering

| Source | Why it matters | Best with |
| --- | --- | --- |
| [Google SRE — Handling Overload](https://sre.google/sre-book/handling-overload/) | Load shedding, prioritization | [[07-Backend/06-Reliability-and-Abuse-Resistance/Rate Limiting and Quotas\|Rate Limiting and Quotas]] |
| [Release It! patterns (circuit breaker, bulkhead)](https://pragprog.com/titles/mnee2/release-it-second-edition/) | Failure containment | [[07-Backend/06-Reliability-and-Abuse-Resistance/Circuit Breakers and Bulkheads\|Circuit Breakers and Bulkheads]] |
| [AWS Builder Library — Timeouts](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) | Retries, jitter, idempotency | [[07-Backend/06-Reliability-and-Abuse-Resistance/Retries Jitter and Idempotent Handlers\|Retries Jitter and Idempotent Handlers]] |
| [Transactional Outbox pattern](https://microservices.io/patterns/data/transactional-outbox.html) | Dual-write avoidance | [[07-Backend/07-Caching-Jobs-and-Messaging/Transactional Outbox and Inbox Patterns\|Transactional Outbox and Inbox Patterns]] |
| [Cache-Aside pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside) | TTL, stampede mitigation | [[07-Backend/07-Caching-Jobs-and-Messaging/Cache-Aside and TTL Strategies\|Cache-Aside and TTL Strategies]] |

Multi-region capacity, consensus, and broker topology hand off to [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Back-of-Envelope Capacity Estimation|Back-of-Envelope Capacity Estimation]], [[09-System-Design/08-Coordination-Consensus-and-Locks/Consensus Intuition Raft and Paxos for Designers|Consensus Intuition]], and [[09-System-Design/06-Messaging-Streams-and-Async-Topologies/Queue vs Log vs Pub-Sub Topology Choice|Queue vs Log vs Pub-Sub]]; broker *engines* to [[08-Databases/README|Databases]].

## OpenAPI and Testing

| Source | Why it matters | Best with |
| --- | --- | --- |
| [OpenAPI Specification 3.1](https://spec.openapis.org/oas/v3.1.0.html) | Executable contracts, schema reuse | [[07-Backend/01-HTTP-APIs-and-Contracts/OpenAPI as Executable Contract\|OpenAPI as Executable Contract]] |
| [Swagger Editor](https://editor.swagger.io/) | Contract authoring and review | OpenAPI as Executable Contract |
| [Pact (consumer-driven contracts)](https://docs.pact.io/) | Cross-service contract verification | [[07-Backend/09-API-Observability-and-Testing/Contract Integration and Load Testing\|Contract Integration and Load Testing]] |
| [k6 load testing](https://grafana.com/docs/k6/latest/) | SLI validation under load | Contract Integration and Load Testing |
| [OpenTelemetry HTTP semantic conventions](https://opentelemetry.io/docs/specs/semconv/http/) | Trace/metric naming for APIs | [[07-Backend/09-API-Observability-and-Testing/Distributed Tracing Across Handlers\|Distributed Tracing Across Handlers]] |

Node-level integration testing (ephemeral ports, `node:test`) lives in [[06-NodeJS/10-Production-Node/Testing Node Servers Integration and Contract Tests|Testing Node Servers Integration and Contract Tests]]; CI execution is [[16-DevOps/README|DevOps]].

## Source Selection Rules

1. Use RFCs and OWASP for contract and abuse semantics; pin examples to explicit HTTP versions when behavior differs.
2. Use OAuth/OIDC primary specs for token flows; never treat JWT decode as verification.
3. Use Express/Fastify docs for middleware ordering and error propagation—not as a substitute for reading the pipeline in labs.
4. Use reliability patterns with explicit failure amplification analysis (retries, caches, outbox).
5. Use OpenAPI + contract tests as the default API evolution gate; treat undocumented JSON as technical debt.
6. Record framework and Node major versions when citing middleware or shutdown behavior.

## Related Notes

- [[00-References/README|References]]
- [[07-Backend/README|Backend]]
- [[07-Backend/code/README|Backend code labs]]
- [[06-NodeJS/README|Node.js]]
- [[02-JavaScript/README|JavaScript]]
- [[08-Databases/README|Databases]]
- [[18-Security/README|Security]]

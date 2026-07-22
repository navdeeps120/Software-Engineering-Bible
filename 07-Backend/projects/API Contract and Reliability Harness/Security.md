---
title: "API Contract and Reliability Harness — Security"
aliases: []
track: 07-Backend
topic: api-contract-reliability-harness-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, backend, security, openapi, reliability]
created: 2026-07-22
updated: 2026-07-22
---

# Security — API Contract and Reliability Harness

## Focus

Retry amplification DDoS, rate limit bypass via header spoofing, and contract tests that hide missing auth requirements.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| Aggressive retry on 500 | Outage amplification | Max attempts, jitter, retry budget |
| Spoofed client IP in rate key | Bypass quotas | Trust proxy config; default distrust |
| OpenAPI omits security scheme | False confidence | Spec includes `security` for protected routes |
| Idempotency store unbounded | Memory exhaustion | TTL + max entries per key prefix |
| Breaker shared across tenants | Cross-tenant denial | Key breaker per tenant/route |

## Controls

- Document safe retry matrix in ADR-004; enforce in `RetryPolicy`.
- Rate limiter keys documented in Architecture—never raw untrusted headers by default.
- Contract smoke fails if protected route returns 200 without auth fixture.

## Related Documents

- [[07-Backend/projects/API Contract and Reliability Harness/README|README]]
- [[07-Backend/projects/Backend Service Toolkit/ADR/ADR-004 Idempotency and Retry Policy|ADR-004]]
- [[07-Backend/06-Reliability-and-Abuse-Resistance/CORS Security Headers and Browser Boundaries|CORS Security Headers and Browser Boundaries]]

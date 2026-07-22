---
title: "API Contract and Reliability Harness — Testing"
aliases: []
track: 07-Backend
topic: api-contract-reliability-harness-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, backend, testing, openapi, reliability]
created: 2026-07-22
updated: 2026-07-22
---

# Testing — API Contract and Reliability Harness

## Strategy

Unit tests for breaker state machine and retry policy; middleware integration on demo app; OpenAPI smoke as contract gate.

```mermaid
flowchart TD
    Unit[Breaker + retry unit] --> MW[Middleware integration]
    MW --> Contract[OpenAPI smoke]
    Contract --> Chaos[Fault injection scenarios]
```

## Critical Paths

1. Slow handler → timeout → `504` problem+json
2. Exceed rate limit → `429` + `Retry-After`
3. Idempotency replay → same response body; single backend mutation
4. Breaker opens after N failures; half-open success closes
5. Retry does not retry unsafe POST without key
6. OpenAPI smoke passes on green demo app; fails when schema drift injected

## Commands

```bash
cd 07-Backend/code
npm test -- tests/labs.test.ts -t "ReliabilityHarness|OpenApiContract"
```

## Definition of Done

- [ ] Breaker tests cover open/half-open/closed transitions deterministically
- [ ] Jitter tested via seeded RNG for stable CI
- [ ] Contract smoke reads spec from repo path—not network
- [ ] Fault injection disabled by default outside test instances

## Related Documents

- [[07-Backend/projects/API Contract and Reliability Harness/README|README]]
- [[07-Backend/09-API-Observability-and-Testing/Chaos and Failure Injection at the Service Edge|Chaos and Failure Injection at the Service Edge]]
- [[07-Backend/projects/Backend Service Toolkit/Testing|Backend Service Toolkit Testing]]

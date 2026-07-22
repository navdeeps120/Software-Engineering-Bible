---
title: "API Contract and Reliability Harness — Architecture"
aliases: []
track: 07-Backend
topic: api-contract-reliability-harness-architecture
difficulty: advanced
status: active
prerequisites: []
tags: [project, backend, architecture, openapi, reliability]
created: 2026-07-22
updated: 2026-07-22
---

# Architecture — API Contract and Reliability Harness

## Summary

Reliability primitives as composable modules plus contract smoke runner. Source: [[07-Backend/code/src/reliability-harness.ts|reliability-harness.ts]] and [[07-Backend/code/openapi/demo-api.yaml|demo-api.yaml]].

## Module Map

```mermaid
flowchart LR
    subgraph Server middleware
        TO[withTimeout]
        RL[createRateLimiter]
        ID[idempotencyMiddleware]
        ERR[problemDetailsErrorHandler]
    end
    subgraph Client helpers
        RP[RetryPolicy]
        CB[CircuitBreaker]
    end
    subgraph Contract
        OAS[OpenAPI spec]
        SM[contractSmoke]
    end
    TO & RL & ID & ERR --> DemoApp
    RP & CB --> TestClient
    OAS --> SM --> DemoApp
```

## Public Surface

| Symbol | Responsibility |
| --- | --- |
| `withTimeout(ms)` | AbortSignal + `504` on breach |
| `createRateLimiter(opts)` | Token bucket per key fn |
| `idempotencyMiddleware(store)` | Safe replay for mutating routes |
| `RetryPolicy` | Idempotent-aware retries + jitter |
| `CircuitBreaker` | Closed/open/half-open state machine |
| `contractSmoke(app, spec)` | Assert routes/responses vs OpenAPI |

## Error Integration

All middleware errors funnel to problem+json envelope per ADR-003—stable `type`, `title`, `status`, optional `errors[]` for validation.

## Failure Injection

Test-only `FaultSwitch` toggles handler failure rate for breaker and retry tests—isolated per test instance.

## Related Documents

- [[07-Backend/projects/API Contract and Reliability Harness/README|README]]
- [[07-Backend/projects/Backend Service Toolkit/ADR/ADR-003 Error Envelope Format|ADR-003]]
- [[07-Backend/projects/Backend Service Toolkit/ADR/ADR-004 Idempotency and Retry Policy|ADR-004]]

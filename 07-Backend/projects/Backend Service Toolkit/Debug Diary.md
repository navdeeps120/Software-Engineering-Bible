---
title: "Backend Service Toolkit — Debug Diary"
aliases: []
track: 07-Backend
topic: backend-service-toolkit-debug-diary
difficulty: intermediate
status: active
prerequisites: []
tags: [project, backend, debug]
created: 2026-07-22
updated: 2026-07-22
---

# Debug Diary — Backend Service Toolkit

## Investigation Template

Each entry should capture: symptom, hypothesis, reproduction, bisection, root cause, fix, regression test, and links to ADR or Known Issue if policy changed.

## Entries

| ID | Date | Symptom | Root cause | Fix | Test added |
| --- | --- | --- | --- | --- | --- |
| DD-001 | — | *(reserved)* | — | — | — |

No production incidents yet—portfolio in active documentation and implementation phase. First investigations expected around async middleware error propagation (mini-express), refresh rotation races (auth), and outbox lease reclaim timing (jobs).

## Common Failure Clusters (Anticipated)

```mermaid
flowchart TD
    A[Async middleware forgot next] --> E[Hung request]
    B[Error MW arity wrong] --> F[Stack trace to client]
    C[Idempotency TTL too short] --> G[Duplicate writes on retry]
    D[Breaker shared key] --> H[Cross-route false open]
```

## Related Documents

- [[07-Backend/projects/Backend Service Toolkit/Known Issues|Known Issues]]
- [[07-Backend/projects/Backend Service Toolkit/Postmortem|Postmortem]]

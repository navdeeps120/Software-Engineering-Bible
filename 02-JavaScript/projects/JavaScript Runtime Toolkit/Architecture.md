---
title: "JavaScript Runtime Toolkit — Architecture"
aliases: []
track: 02-JavaScript
topic: "javascript-runtime-toolkit-architecture"
difficulty: advanced
status: active
prerequisites: []
tags: [project, javascript, architecture]
created: "2026-07-21"
updated: "2026-07-21"
---

# Architecture — JavaScript Runtime Toolkit

## Summary

A modular monolith is the correct boundary: one package and CLI, six independent domain modules, no network services or persistent store. The CLI validates and serializes input; domain modules own behavior.

```mermaid
flowchart TB
    CLI[CLI: parse, validate, format] --> Facade[Public facade]
    Facade --> P[promise.ts]
    Facade --> E[event-emitter.ts]
    Facade --> M[module-graph.ts]
    Facade --> C[coercion.ts]
    Facade --> R[reactive.ts]
    Facade --> L[concurrency.ts]
    P & E & M & C & R & L --> Runtime[Host JS runtime]
```

## Data Flow

```mermaid
sequenceDiagram
    actor User
    participant CLI
    participant Module
    User->>CLI: command + bounded JSON
    CLI->>CLI: parse and validate
    CLI->>Module: typed call
    Module-->>CLI: value or typed failure
    CLI-->>User: JSON + exit code
```

## Key Components

| Component | Responsibility | Boundary |
| --- | --- | --- |
| Public facade | Stable exports and semantic versioning | No implementation policy |
| CLI adapter | Parsing, limits, JSON, exit codes | No domain logic |
| Six domain modules | Runtime-mechanism models | No I/O |
| Vitest suite | Behavioral and integration contracts | No private-state coupling |

## Quality Attributes

- Correctness: explicit ordering and settlement invariants; differential tests where native comparison is meaningful.
- Security: no `eval`, dynamic code execution, remote imports, or implicit filesystem access.
- Performance: O(V+E) graph traversal and bounded active async work; benchmarks gate only demonstrated regressions.
- Operability: structured stderr diagnostics; stdout remains machine-readable.

## Trade-offs

One package simplifies learning, versioning, and integration but couples releases. A thin CLI is less flexible than embedded APIs but provides reproducible demonstrations. Educational implementations maximize inspectability rather than conformance or peak performance.

## Decisions

- [[02-JavaScript/projects/JavaScript Runtime Toolkit/ADR/0001-package-boundary|ADR-0001: Package Boundary]]
- [[02-JavaScript/projects/JavaScript Runtime Toolkit/ADR/0002-async-contracts|ADR-0002: Async Contracts]]

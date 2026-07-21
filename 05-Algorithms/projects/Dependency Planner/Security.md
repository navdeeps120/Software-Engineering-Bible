---
title: "Dependency Planner — Security"
aliases: []
track: 05-Algorithms
topic: dependency-planner-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, algorithms, security]
created: 2026-07-21
updated: 2026-07-21
---

# Security — Dependency Planner

## Focus

Denial-of-service via huge dependency graphs, deep recursion, and exponential cycle enumeration attempts when parsing untrusted manifest-like JSON.

## Threat Scenarios

| Scenario | Attack | Mitigation |
| --- | --- | --- |
| Mega monorepo JSON | V,E in millions | Hard caps before adjacency build |
| Deep chain DAG | Stack overflow in naive DFS | Iterative DFS; depth budget |
| Dense graph | O(V²) memory if matrix misused | Adjacency list default per ADR-002 |
| Cyclic SCC bait | Request all simple cycles | One witness cycle only |
| Label bomb | Megabyte task names | Max label length |

## Controls

- Schema validation on import: vertex count, edge count, label size.
- Adjacency built with checked arithmetic on edge list length.
- Planner rejects layered mode when V exceeds configured layer cap output.
- No code execution from dependency labels—strings are opaque identifiers.
- Benchmark graphs labeled synthetic; do not embed real internal repo names in vectors.

## Related Documents

- [[05-Algorithms/projects/Dependency Planner/README|README]]
- [[05-Algorithms/projects/Algorithm Workbench/ADR/ADR-002 Graph Representation Boundary|ADR-002]]
- [[05-Algorithms/projects/Algorithm Workbench/Security|Algorithm Workbench Security]]

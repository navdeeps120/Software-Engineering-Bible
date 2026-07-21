---
title: "Pathfinding Lab — Security"
aliases: []
track: 05-Algorithms
topic: pathfinding-lab-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, algorithms, security]
created: 2026-07-21
updated: 2026-07-21
---

# Security — Pathfinding Lab

## Focus

Resource exhaustion and incorrect routing from oversized graphs, all-pairs requests on large V, and integer overflow in distance accumulation when processing untrusted weight files.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| Floyd on V=100000 | O(V³) memory/time | Require explicit all-pairs flag + V cap |
| Dense edge list spam | O(V²) if mis-detected | Profile graph before dispatch |
| Extreme weights | Overflow dist | Checked add; max abs weight bound |
| Negative cycle bait | Long BF runs | Cap V*E product |
| Path dump request | Huge path strings | Cap path length in output |

## Controls

- Graph loader validates V, E, weight range before algorithm entry.
- Dispatcher refuses Floyd unless `V ≤ FLOYD_V_CAP` documented in Security.
- Dijkstra must not run when `hasNegativeEdge` flag set—fail closed.
- Benchmark artifacts redact vertex labels in default JSON export.
- No geolocation or external routing APIs in lab scope.

## Related Documents

- [[05-Algorithms/projects/Pathfinding Lab/README|README]]
- [[05-Algorithms/projects/Algorithm Workbench/ADR/ADR-003 Shortest-Path Dispatch|ADR-003]]
- [[05-Algorithms/projects/Algorithm Workbench/Security|Algorithm Workbench Security]]

---
title: "Pathfinding Lab — Testing"
aliases: []
track: 05-Algorithms
topic: pathfinding-lab-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, algorithms, testing]
created: 2026-07-21
updated: 2026-07-21
---

# Testing — Pathfinding Lab

## Strategy

Contract vectors per algorithm family; dispatcher integration tests; certificate validation on every successful run; negative tests for wrong-algorithm-on-wrong-graph.

## Critical Paths

1. Single-node, two-node, disconnected components
2. Dijkstra: non-neg grid; fail on one negative edge vector
3. Bellman-Ford: negative cycle witness validates as negative-weight closed walk
4. Zero-one BFS parity with Dijkstra on shared {0,1} graphs
5. Floyd-Warshall matches brute force on V ≤ 8 reference graphs
6. Path reconstruction tie-break per ADR-004
7. Dispatcher routes per weight profile metadata

## Commands

```bash
cd 05-Algorithms/code/typescript && npm test -- -t "Dijkstra|BellmanFord|ZeroOneBFS|FloydWarshall|ShortestPath"
cd 05-Algorithms/code/python && python -m pytest -q -k "dijkstra or bellman or zero_one or floyd"
```

## Definition of Done

- [ ] Dual-language green on shortest-path vector suite
- [ ] Certificate checker fails corrupted distance arrays in tests
- [ ] Overflow cases error rather than silent wrap
- [ ] Dispatcher golden profiles committed
- [ ] No network or external map tiles in tests

## Related Documents

- [[05-Algorithms/projects/Pathfinding Lab/README|README]]
- [[05-Algorithms/projects/Algorithm Workbench/Testing|Algorithm Workbench Testing]]

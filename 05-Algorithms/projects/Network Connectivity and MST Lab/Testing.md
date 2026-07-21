---
title: "Network Connectivity and MST Lab — Testing"
aliases: []
track: 05-Algorithms
topic: network-connectivity-mst-lab-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, algorithms, testing]
created: 2026-07-21
updated: 2026-07-21
---

# Testing — Network Connectivity and MST Lab

## Strategy

Shared MST vectors compare Kruskal vs Prim total weight; connectivity vectors validate bridges and articulation sets; UF unit tests isolated; certificate checks on every MST output.

## Critical Paths

1. Triangle graph: unique MST weight
2. Equal-weight square: tie-break deterministic edge set hash
3. Disconnected graph per vector mode tag
4. Bridge chain: all edges are bridges
5. Articulation star center identified
6. Kruskal UF path compression counts in instrumentation tests

## Commands

```bash
cd 05-Algorithms/code/typescript && npm test -- -t "Kruskal|PrimMST|BridgeFinder|Articulation|ConnectivityLab"
cd 05-Algorithms/code/python && python -m pytest -q -k "kruskal or prim or bridge or articulation"
```

## Definition of Done

- [ ] Dual-language green on `shared/vectors/mst*.json`, `bridge*.json`
- [ ] Kruskal and Prim weights match on all connected cases
- [ ] MST certificate rejects cycle injection test
- [ ] Bridge/articulation sets match reference (order-independent compare)
- [ ] DSU tests cover union by rank and path compression

## Related Documents

- [[05-Algorithms/projects/Network Connectivity and MST Lab/README|README]]
- [[05-Algorithms/projects/Algorithm Workbench/Testing|Algorithm Workbench Testing]]

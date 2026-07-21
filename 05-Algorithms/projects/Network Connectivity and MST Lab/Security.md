---
title: "Network Connectivity and MST Lab — Security"
aliases: []
track: 05-Algorithms
topic: network-connectivity-mst-lab-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, algorithms, security]
created: 2026-07-21
updated: 2026-07-21
---

# Security — Network Connectivity and MST Lab

## Focus

Memory and CPU exhaustion from dense graphs, excessive parallel edges, and deep DFS recursion on path-like networks submitted via untrusted JSON.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| Complete graph K_n | Prim heap O(E log V) blowup | V cap; density profile warning |
| Edge list duplication | Inflated E | Dedup or reject multigraph |
| Long path graph | DFS stack overflow | Iterative Tarjan option |
| Huge weight values | Sum overflow in MST total | Checked accumulation |
| Fake connectivity report | Silent wrong bridges | Certificate + reference vectors |

## Controls

- Import validates V, E, parallel edge policy before MST run.
- UnionFind allocated once with known V—no dynamic unbounded growth.
- Bridge finder returns edge ids, not full path dumps.
- Benchmark uses synthetic graphs only in committed fixtures.
- No network topology scanning or live infrastructure APIs.

## Related Documents

- [[05-Algorithms/projects/Network Connectivity and MST Lab/README|README]]
- [[05-Algorithms/projects/Algorithm Workbench/Security|Algorithm Workbench Security]]

---
title: "Dependency Planner — Testing"
aliases: []
track: 05-Algorithms
topic: dependency-planner-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, algorithms, testing]
created: 2026-07-21
updated: 2026-07-21
---

# Testing — Dependency Planner

## Strategy

Shared vectors for topo, cycle, and SCC first; cross-check Kahn vs DFS on DAGs; planner integration tests for layered output and deterministic tie-break hashes.

## Critical Paths

1. Empty, single-node, two-node DAG and 2-cycle
2. Multi-SCC graph: condensation topo matches manual reference
3. Cycle detection returns valid witness on known cyclic vectors
4. Layered planner: no edge from layer j to layer i where j > i
5. Lex tie-break: repeated runs same order on tied indegree sets
6. Graph boundary: load from GraphStore adapter and raw JSON

## Commands

```bash
cd 05-Algorithms/code/typescript && npm test -- -t "TopologicalSort|CycleDetector|TarjanSCC|DependencyPlanner"
cd 05-Algorithms/code/python && python -m pytest -q -k "topological or cycle or tarjan or dependency"
```

## Definition of Done

- [ ] Dual-language green on `shared/vectors/topo*.json`, `cycle*.json`, `scc*.json`
- [ ] Kahn and DFS produce equivalent valid orders on all DAG vectors
- [ ] Cycle witness validates as closed walk in graph
- [ ] Tie-break golden hash stable across languages
- [ ] Over-limit graph rejected at CLI boundary

## Related Documents

- [[05-Algorithms/projects/Dependency Planner/README|README]]
- [[05-Algorithms/projects/Algorithm Workbench/Testing|Algorithm Workbench Testing]]

---
title: "Graph Store CLI — Testing"
aliases: []
track: 04-Data-Structures
topic: graph-store-cli-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, data-structures, testing]
created: 2026-07-21
updated: 2026-07-21
---

# Testing — Graph Store CLI

## Strategy

ADT conformance suite runs identical operation scripts against adjacency list, matrix (small n), and edge list backends.

## Critical Paths

1. Shared `graph*.json` vectors—dual language
2. `neighbors`/`hasEdge` consistency across reps on same edge set
3. Import malformed CSV—stable error, no partial state
4. Benchmark mode produces deterministic JSON schema
5. `components` on known disconnected graph—correct count

## Commands

```bash
cd 04-Data-Structures/code/typescript && npm test -- -t "AdjListGraph|AdjMatrixGraph|UnionFind"
cd 04-Data-Structures/code/python && python -m pytest -q -k "adj_list or adj_matrix or union_find"
```

## Definition of Done

- [ ] Conformance tests pass all representations
- [ ] Matrix tests gated to small n
- [ ] DSU glue tested independently of full graph build where applicable

## Related Documents

- [[04-Data-Structures/projects/Graph Store CLI/README|README]]

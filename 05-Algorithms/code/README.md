---
title: Algorithms Code Labs
aliases: [Algorithms Labs, Shared Vector Algorithm Labs]
track: 05-Algorithms
topic: algorithms-code-labs
difficulty: intermediate
status: active
prerequisites: ["[[05-Algorithms/README|Algorithms]]"]
tags: [algorithms, labs, typescript, python, shared-vectors]
created: 2026-07-21
updated: 2026-07-21
---

# Algorithms Code Labs

Paired **TypeScript** and **Python** educational implementations of the core algorithm families. Both suites consume the same deterministic JSON vectors under `shared/vectors/`. Code is MIT licensed.

Unlike the [[04-Data-Structures/code/README|Data Structures labs]], there is no `construct` step: algorithms are pure functions, so every vector op independently calls one named function in an "algorithm family" with positional `args`, and the return value is compared against `expect.value` (deep-equal) or an expected error `code`.

## Layout

| Path | Purpose |
| --- | --- |
| `shared/vectors/*.json` | Op sequences and expected outcomes, one function call per op |
| `shared/schema.json` | Vector document schema |
| `typescript/` | Vitest + TypeScript implementations |
| `python/` | pytest + Python implementations |

## Algorithm Families Covered

| Family | Vector file | Functions |
| --- | --- | --- |
| Binary search | `binary_search.json` | `binarySearch`, `lowerBound`, `upperBound` |
| Binary search on the answer | `binary_search_answer.json` | `binarySearchAnswer` |
| Selection | `quickselect.json`, `top_k.json` | `quickselect`, `topK` |
| Comparison sorts | `insertion_sort.json`, `merge_sort.json`, `quicksort.json`, `heapsort.json` | `insertionSort`, `mergeSort`, `quickSort`, `heapSort` |
| Linear-time sorts | `counting_sort.json`, `radix_sort.json` | `countingSort`, `radixSort` |
| Greedy | `interval_scheduling.json`, `huffman.json` | `intervalScheduling`, `huffman` |
| Dynamic programming | `knapsack.json`, `lcs.json`, `edit_distance.json` | `knapsack01`, `lcs`, `editDistance` |
| Graph traversal | `bfs.json`, `dfs.json`, `components.json`, `bipartite.json`, `cycle.json`, `topological.json`, `scc.json` | `bfs`, `dfs`, `connectedComponents`, `isBipartite`, `hasCycle`, `topologicalSort`, `stronglyConnectedComponents` |
| Shortest paths | `dijkstra.json`, `bellman_ford.json`, `zero_one_bfs.json`, `floyd_warshall.json` | `dijkstra`, `bellmanFord`, `zeroOneBfs`, `floydWarshall` |
| MST / connectivity | `kruskal.json`, `prim.json`, `bridges.json` | `kruskal`, `prim`, `bridges` |
| Flow / matching | `max_flow.json`, `bipartite_matching.json` | `maxFlow`, `bipartiteMatching` |
| String matching | `kmp.json`, `z_algorithm.json`, `rabin_karp.json` | `kmpSearch`, `zAlgorithm`, `rabinKarp` |
| Randomized | `reservoir.json` | `reservoirSample` (seeded mulberry32, identical across languages) |

## Run TypeScript

```bash
cd 05-Algorithms/code/typescript
npm install
npm test
```

## Run Python

```bash
cd 05-Algorithms/code/python
python -m pip install -e ".[dev]"
python -m pytest -q
```

## Design Rules

1. Every function is pure: no shared mutable state between ops, no hidden randomness beyond an explicit `seed` argument.
2. Graphs use integer vertices `0..n-1` with an edge-list input: `{n, edges, directed?}`, unweighted edges as `[u, v]`, weighted as `[u, v, w]`.
3. Every traversal breaks ties by "lower vertex id wins" (adjacency lists are sorted ascending before traversal), so outputs are a specific deterministic order, not just "any valid one."
4. Unreachable/undefined results use `null` (never `Infinity` or a sentinel integer) so JSON vectors stay exact.
5. Expected failure modes throw/raise a typed error with a stable `code` (`invalid`, `index`, `not_found`, `cycle`, `empty`), asserted via the vector's `error` field.
6. `certificates.ts` / `certificates.py` (`isSorted`, `isValidTopo`, `isNonOverlapping`, `isPrefixFree`) are checked by the vector runner itself as a second, structural correctness signal beyond the pinned `expect` value.
7. Concept-only algorithms (suffix arrays, min-cut duality, branch-and-bound, approximation heuristics) stay in notes, not labs — see the [[05-Algorithms/README|track overview]] for where those live.

## Related Notes

- [[05-Algorithms/README|Algorithms]]
- [[05-Algorithms/projects/Algorithm Workbench/README|Algorithm Workbench]]
- [[04-Data-Structures/code/README|Data Structures Code Labs]]

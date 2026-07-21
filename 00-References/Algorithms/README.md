---
title: Algorithms References
aliases: [Algorithms Bibliography, Algorithm Engineering Sources]
track: 00-References
topic: algorithms-references
difficulty: intermediate
status: active
prerequisites: ["[[05-Algorithms/README|Algorithms]]"]
tags: [reference, algorithms, complexity, graph-algorithms, string-algorithms]
created: 2026-07-21
updated: 2026-07-21
---

# Algorithms References

Curated high-signal sources for the [[05-Algorithms/README|Algorithms]] track. Prefer primary papers and classic texts over pattern-memorization catalogs.

## How to Use

1. Read the topic note first (problem contract, invariants, complexity model).
2. Use references to deepen correctness arguments and adversarial cases—not to skip implementation.
3. Run paired labs under [[05-Algorithms/code/README|Algorithms code labs]] before claiming mastery.

## Core Texts

| Source | Why it matters | Best with |
| --- | --- | --- |
| Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms* (CLRS) | Canonical definitions, proofs, amortized analysis, graph/string algorithm baselines | Foundations, complexity, sorting, graphs, DP |
| Sedgewick & Wayne, *Algorithms* (4th ed.) | Practical implementations, empirical performance, Java/Princeton lineage | Sorting, searching, graph traversal, production intuition |
| Kleinberg & Tardos, *Algorithm Design* | Greedy/DP design paradigms, exchange arguments, network flow framing | Greedy, DP, advanced graphs |
| Skiena, *The Algorithm Design Manual* | Problem taxonomy, heuristic selection, engineering checklists | Production selection, interview pattern mapping |
| Knuth, *The Art of Computer Programming* (esp. vol. 1 sorting/searching; vol. 2 seminumerical) | Historical precision, combinatorial analysis, sorting lower bounds | Sorting contracts, searching variants, radix/counting context |

## Original Papers (high priority)

| Paper | Topic | Track notes |
| --- | --- | --- |
| Dijkstra, "A Note on Two Problems in Connexion with Graphs" (1959) | Shortest paths | [[05-Algorithms/08-Shortest-Paths/Dijkstra with Indexed Heaps\|Dijkstra with Indexed Heaps]] |
| Bellman, "On a Routing Problem" (1958); Ford–Fulkerson flow lineage | Negative weights / flow | [[05-Algorithms/08-Shortest-Paths/Bellman-Ford and Negative Cycles\|Bellman-Ford]], [[05-Algorithms/10-Advanced-Graph-Algorithms/Maximum Flow and Residual Networks\|Maximum Flow]] |
| Kruskal (1956); Prim (1957) | MST | [[05-Algorithms/09-MST-and-Connectivity/Kruskal with Union-Find\|Kruskal]], [[05-Algorithms/09-MST-and-Connectivity/Prim with Priority Queues\|Prim]] |
| Tarjan (1972) SCC; Kosaraju–Sharir presentations | Strongly connected components | [[05-Algorithms/07-Graph-Traversal-and-DAGs/Strongly Connected Components\|Strongly Connected Components]] |
| Hopcroft–Karp (1973); Ford–Fulkerson max-flow | Bipartite matching / flow | [[05-Algorithms/10-Advanced-Graph-Algorithms/Bipartite Matching\|Bipartite Matching]] |
| Knuth–Morris–Pratt (1977); Z algorithm (Gusfield); Karp–Rabin (1987) | String matching | [[05-Algorithms/11-String-and-Sequence-Algorithms/KMP Prefix Function\|KMP]], [[05-Algorithms/11-String-and-Sequence-Algorithms/Z Algorithm\|Z Algorithm]], [[05-Algorithms/11-String-and-Sequence-Algorithms/Rabin-Karp and Rolling Hash\|Rabin-Karp]] |
| Huffman (1952) | Optimal prefix codes | [[05-Algorithms/05-Greedy-Algorithms/Huffman Coding\|Huffman Coding]] |
| Vitter (1985) reservoir sampling | Stream sampling | [[05-Algorithms/12-Randomized-Approximation-and-Online/Reservoir Sampling\|Reservoir Sampling]] |

## Language and Library Implementations

Use these to connect algorithm notes to stdlib/runtime behavior. Label language/version; complexity guarantees may differ from textbook pseudocode.

| Source | Use for |
| --- | --- |
| [Python `sort` / Timsort](https://github.com/python/cpython/blob/main/Objects/listobject.c) (docs + source) | Stability, adaptivity, merge galloping | 
| [Python `heapq`](https://docs.python.org/3/library/heapq.html) | Binary heap, lazy vs indexed heaps for Dijkstra |
| [Python `bisect`](https://docs.python.org/3/library/bisect.html) | Binary search boundary variants |
| [V8 / ECMAScript `Array.prototype.sort`](https://tc39.es/ecma262/#sec-array.prototype.sort) | Engine-specific sort stability and introspection limits |
| [Rust `std::collections::BinaryHeap`](https://doc.rust-lang.org/std/collections/struct.BinaryHeap.html) | Production PQ API without decrease-key |
| NetworkX, graph-tool (product context) | When to stop reimplementing and start measuring |

Cross-link language tracks: [[03-Python/README|Python]], [[02-JavaScript/README|JavaScript]].

## Production Algorithm Engineering

| Source | Handoff |
| --- | --- |
| Google SRE — latency budgets, profiling discipline | [[05-Algorithms/13-Production-Selection-and-Interview-Patterns/Profiling Correctness and Regression Gates\|Profiling Correctness and Regression Gates]] |
| Hennessy & Patterson — memory hierarchy, locality | [[05-Algorithms/01-Complexity-and-Analysis/Practical Constants Locality and Benchmark Design\|Practical Constants Locality and Benchmark Design]] |
| PostgreSQL query planner / index docs (conceptual) | When in-memory graph/DP ends → [[08-Databases/README\|Databases]] |
| External sort / merge patterns in storage engines | [[05-Algorithms/03-Sorting/External Sorting Concepts and Production Selection\|External Sorting Concepts]] → [[08-Databases/README\|Databases]] |
| OpenTelemetry + load-test harness patterns | Regression gates for algorithm swaps in services |

This track owns **in-memory algorithm contracts and selection**. Distributed graph engines, stream processors, and index structures belong in Backend/Databases/System Design tracks.

## Track Mapping

- Foundations and correctness → CLRS ch. 2; Kleinberg & Tardos ch. 4
- Complexity analysis → CLRS ch. 3–4; Skiena §2
- Searching/selection → CLRS ch. 9; Sedgewick §3.1
- Sorting → CLRS ch. 6–8; Knuth vol. 3 (sorting); Sedgewick §2
- Greedy → Kleinberg & Tardos ch. 4; CLRS ch. 16
- Dynamic programming → Kleinberg & Tardos ch. 6; CLRS ch. 15
- Graph traversal → CLRS ch. 20–22; Sedgewick §4.1
- Shortest paths / MST / flow → CLRS ch. 22–26; original papers above
- Strings → Gusfield *Algorithms on Strings*; CLRS string-matching sections
- Randomized / online → Motwani & Raghavan (conceptual); Vitter reservoir paper
- Production selection → Skiena catalog; track module 13

## Source Selection Rules

1. Textbooks for definitions, proofs, and amortized analysis.
2. Primary papers for graph, flow, and string algorithms cited in topic notes.
3. Language/stdlib docs for **behavioral contracts**—never as substitute for from-scratch labs.
4. Product/engine docs for **motivation** and handoff boundaries only.

## Related Notes

- [[00-References/README|References]]
- [[05-Algorithms/README|Algorithms]]
- [[05-Algorithms/code/README|Algorithms code labs]]
- [[04-Data-Structures/README|Data Structures]]
- [[01-Computer-Science/README|Computer Science]]
- [[07-Backend/README|Backend]]
- [[08-Databases/README|Databases]]
- [[Career/README|Career]]

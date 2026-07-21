---
title: "Algorithm Workbench — Lessons Learned"
aliases: []
track: 05-Algorithms
topic: algorithm-workbench-lessons-learned
difficulty: intermediate
status: active
prerequisites: []
tags: [project, algorithms, lessons]
created: 2026-07-21
updated: 2026-07-21
---

# Lessons Learned — Algorithm Workbench

## Durable Takeaways

1. **Shared vectors before features**: Cross-language JSON contracts catch semantic drift early—cheaper than retrofitting parity across sort and path modules.
2. **Certificates beat snapshot diff alone**: Relaxation inequalities and stability tags expose off-by-one bugs that raw output arrays miss.
3. **Dispatch is a security surface**: Running Dijkstra on negative edges is both incorrect and a teaching failure—ADR-003 fail-closed dispatch prevents silent wrong answers.
4. **Separate algorithms from storage**: Importing GraphStore keeps MST and path labs maintainable; storage tuning stays in Data Structures.
5. **Benchmarks need methodology ADRs**: Fixture sizes, seeds, and warmup policy belong in ADR-005—not tribal knowledge in README tables.

## Anti-Patterns Observed

- Benchmarking quicksort without adversarial pivot suite alongside uniform random data.
- Returning Rabin-Karp hash hits without character verification.
- Running Floyd-Warshall because it is "easier to code" on sparse large graphs.
- Conflating MST weight with shortest-path tree distance.

## Apply Next

- Wire certificate checker before adding new algorithm families.
- Publish advisor golden files when rules engine lands.
- Link every mini project benchmark to Workbench experiment report schema.

## Related Documents

- [[05-Algorithms/projects/Algorithm Workbench/ADR/ADR-003 Shortest-Path Dispatch|ADR-003]]
- [[05-Algorithms/projects/Algorithm Workbench/ADR/ADR-005 Benchmark Methodology|ADR-005]]
- [[05-Algorithms/13-Production-Selection-and-Interview-Patterns/Profiling Correctness and Regression Gates|Profiling Correctness and Regression Gates]]

---
title: "Structures Workbench — Lessons Learned"
aliases: []
track: 04-Data-Structures
topic: structures-workbench-lessons-learned
difficulty: intermediate
status: active
prerequisites: []
tags: [project, data-structures, lessons]
created: 2026-07-21
updated: 2026-07-21
---

# Lessons Learned — Structures Workbench

## Durable Takeaways

1. **Shared vectors before features**: Cross-language JSON contracts catch semantic drift early—cheaper than retrofitting parity.
2. **Separate storage from algorithms**: Graph Store CLI stays maintainable by refusing to host BFS/Dijkstra—learners know where each track begins.
3. **ADRs for defaults**: Growth factor, hash strategy, tree balance, eviction, and concurrency belong in explicit decisions—not tribal knowledge in benchmarks.
4. **Probabilistic structures need two-tier stories**: Bloom labs must pair with exact verification to avoid dangerous "maybe" semantics in demos.
5. **Instrumentation teaches locality**: Resize and probe histograms connect Big-O to measured constants better than tables alone.

## Anti-Patterns Observed

- Using BST backend on sorted inserts without labeling degeneracy risk.
- Treating Bloom `maybeContains` as authorization.
- Benchmarking hash maps without adversarial and uniform suites separately.

## Apply Next

- Wire invariant checker before adding new ADTs.
- Publish advisor golden files when rules engine lands.
- Link every mini project benchmark to Workbench metrics schema.

## Related Documents

- [[04-Data-Structures/projects/Structures Workbench/ADR/ADR-001 Growth Factor|ADR-001]]
- [[04-Data-Structures/14-Production-Selection/Measuring Structures in Production|Measuring Structures in Production]]

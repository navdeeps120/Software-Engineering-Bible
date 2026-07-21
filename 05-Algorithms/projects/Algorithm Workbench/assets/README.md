---
title: "Algorithm Workbench — Assets"
aliases: []
track: 05-Algorithms
topic: algorithm-workbench-assets
difficulty: beginner
status: active
prerequisites: []
tags: [project, algorithms, assets]
created: 2026-07-21
updated: 2026-07-21
---

# Assets — Algorithm Workbench

Store static artifacts supporting documentation and demos:

| Asset type | Purpose | Naming |
| --- | --- | --- |
| Architecture diagrams | Exported Mermaid/SVG for slides | `architecture-*.svg` |
| Benchmark reports | Sample ADR-005 experiment JSON | `experiment-sample-*.json` |
| Advisor golden files | Expected recommendation outputs | `advise-golden-*.json` |
| Certificate traces | Teaching validation failures | `cert-trace-*.json` |
| Sort comparison charts | Stability/adaptivity teaching | `sort-bench-*.json` |

Do not commit large graph datasets (full road networks)—reference download URLs in mini project docs and use generated fixtures in vectors instead.

## Related Documents

- [[05-Algorithms/projects/Algorithm Workbench/README|README]]
- [[05-Algorithms/projects/Algorithm Workbench/Monitoring|Monitoring]]

---
title: "Graph Store CLI — Security"
aliases: []
track: 04-Data-Structures
topic: graph-store-cli-security
difficulty: intermediate
status: active
prerequisites: []
tags: [project, data-structures, security]
created: 2026-07-21
updated: 2026-07-21
---

# Security — Graph Store CLI

## Resource Exhaustion

Graph imports can trigger O(n²) matrix allocation or O(m) edge blowup.

| Control | Limit |
| --- | --- |
| Max vertices | Configurable ceiling before any alloc |
| Max edges | Reject import when exceeded |
| Matrix build | Disabled above `N_MAX_MATRIX` |
| File size | Streaming parser with byte cap |

## Input Validation

- CSV: strict column count, numeric vertex ids or bounded string labels
- JSON: schema validate before mutating graph
- No arbitrary code or expression evaluation in import path

## Related Documents

- [[04-Data-Structures/projects/Graph Store CLI/README|README]]

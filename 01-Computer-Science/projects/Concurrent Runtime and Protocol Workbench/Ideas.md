---
title: Concurrent Runtime and Protocol Workbench — Ideas
aliases: []
track: 01-Computer-Science
topic: concurrent-runtime-protocol-workbench-ideas
difficulty: beginner
status: active
prerequisites:
  - "[[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/README|Concurrent Runtime and Protocol Workbench]]"
tags: [project, ideas]
created: 2026-07-21
updated: 2026-07-21
---

# Ideas — Concurrent Runtime and Protocol Workbench

Capture future directions without polluting the committed roadmap.

## Idea Backlog

| ID | Idea | Value hypothesis | Cost guess | Next research step |
| --- | --- | --- | --- | --- |
| I-001 | VM instruction budget / fuel counter | Prevents DoS via infinite loops | small | Spike in vm.ts |
| I-002 | Hex dump CLI for frames | Faster protocol debugging | small | Reuse bits helpers |
| I-003 | Web UI status dashboard | Visual queue saturation | medium | Hand off to JS track |
| I-004 | Unix domain socket transport | IPC without TCP overhead | small | Extend netdemo |
| I-005 | Property-based framing tests | Find edge lengths | medium | Hypothesis/fast-check |

## Parking Lot

- TLS wrapper (belongs in [[01-Computer-Science/07-Networking-Fundamentals/TLS Concepts|TLS Concepts]] track)
- Redis-backed queue (violates non-goals unless ADR)
- WASM-compiled VM for speed comparison

## Promotion Rule

An idea moves to [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Roadmap|Roadmap]] only when:

- [ ] Problem is validated
- [ ] Success metric is defined
- [ ] Rough architecture impact is understood
- [ ] It does not violate current non-goals without an ADR

## Related Documents

- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Roadmap|Roadmap]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Planning|Planning]]

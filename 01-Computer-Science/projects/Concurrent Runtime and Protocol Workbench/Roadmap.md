---
title: Concurrent Runtime and Protocol Workbench — Roadmap
aliases: []
track: 01-Computer-Science
topic: concurrent-runtime-protocol-workbench-roadmap
difficulty: intermediate
status: active
prerequisites:
  - "[[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/README|Concurrent Runtime and Protocol Workbench]]"
tags: [project, roadmap]
created: 2026-07-21
updated: 2026-07-21
---

# Roadmap — Concurrent Runtime and Protocol Workbench

## Current Phase

**P0 complete** — lab modules and documentation active. **P1 in progress** — integration slice.

## Phases

```mermaid
flowchart LR
    P0[Lab Modules] --> P1[Vertical Slice]
    P1 --> P2[Failure Demos]
    P2 --> P3[Teaching Polish]
```

| Phase | Outcome | Exit criteria |
| --- | --- | --- |
| P0 | Isolated labs + docs | Mini-project READMEs; code tests green |
| P1 | TCP job round-trip | Integration test; optional long-lived server |
| P2 | Failure demos | CRC, queue_full, vm_fault scripted |
| P3 | Curriculum hooks | Exercises link to workbench scenarios |

## Now / Next / Later

### Now

- Portfolio documentation set (this folder)
- ADR-0001 framing, ADR-0002 concurrency

### Next

- Long-lived workbench process (`workbench.ts` / `workbench.py`)
- Streaming frame decoder with partial reads
- HTTP `/status` wired to live counters

### Later

- VM instruction budget (see [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Ideas|Ideas]] I-001)
- Optional hex-dump debug CLI
- Capstone interview question set

## Completed

| Item | Date | Notes |
| --- | --- | --- |
| Code labs scaffold | 2026-07-21 | bits, framing, utf8, float, vm, parser, runtime, netdemo |
| Mini-project docs | 2026-07-21 | Five labs under `projects/` |
| Portfolio doc set | 2026-07-21 | Full template instantiation |

## Related Documents

- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Planning|Planning]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Ideas|Ideas]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Known Issues|Known Issues]]

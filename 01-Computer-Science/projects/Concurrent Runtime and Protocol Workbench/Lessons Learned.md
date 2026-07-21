---
title: Concurrent Runtime and Protocol Workbench — Lessons Learned
aliases: []
track: 01-Computer-Science
topic: concurrent-runtime-protocol-workbench-lessons-learned
difficulty: intermediate
status: active
prerequisites:
  - "[[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/README|Concurrent Runtime and Protocol Workbench]]"
tags: [project, lessons]
created: 2026-07-21
updated: 2026-07-21
---

# Lessons Learned — Concurrent Runtime and Protocol Workbench

Capture durable knowledge that should change future design, process, or teaching notes.

## Technical Lessons

- **Length-prefix framing** eliminates ambiguous message boundaries on TCP streams—CRC catches accidental corruption but not adversaries
- **Bounded queues** must expose rejection explicitly; silent blocking hides backpressure from clients
- **Stack VMs** fail loudly on underflow and div-by-zero—map errors to wire codes instead of crashing the server
- **Single-threaded JS** requires deterministic race simulation; label results accordingly in [[01-Computer-Science/projects/Concurrency Zoo/README|Concurrency Zoo]]

## Process Lessons

- Mini-project docs before portfolio integration reduce scope creep
- Dual-language parity tests catch endian and signedness bugs early
- ADRs for framing and concurrency prevent re-litigation during integration

## Product / User Lessons

- Learners need failure-mode demos—not just happy-path echo tests
- HTTP `/status` lowers debugging friction compared to binary-only interfaces

## What We Would Repeat

- Compose from small verified labs rather than one monolithic file
- Document explicit non-goals (DB, containers, auth) upfront
- Mermaid diagrams at every architecture boundary

## What We Would Change

- Add VM instruction budget before exposing long-lived server
- Introduce integration test earlier in milestone plan

## Curriculum Feedback

- Cross-link [[01-Computer-Science/05-Concurrency-Fundamentals/Backpressure and Resource Contention|Backpressure and Resource Contention]] to queue_full demo
- Add exercise: decode hex dump of full frame manually

## Related Documents

- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Postmortem|Postmortem]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Engineering Journal|Engineering Journal]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Ideas|Ideas]]

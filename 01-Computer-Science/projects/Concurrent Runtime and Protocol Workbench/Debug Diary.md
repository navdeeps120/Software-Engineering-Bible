---
title: Concurrent Runtime and Protocol Workbench — Debug Diary
aliases: []
track: 01-Computer-Science
topic: concurrent-runtime-protocol-workbench-debug-diary
difficulty: intermediate
status: active
prerequisites:
  - "[[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/README|Concurrent Runtime and Protocol Workbench]]"
tags: [project, debugging]
created: 2026-07-21
updated: 2026-07-21
---

# Debug Diary — Concurrent Runtime and Protocol Workbench

Index of bug investigations. Create entries with [[00-Templates/Debug Diary Template|Debug Diary Template]].

## Entry Index

| Date | Symptom | Root cause | Prevention | Link |
| --- | --- | --- | --- | --- |
| — | — | — | — | (no entries yet) |

## Common Investigation Paths

| Symptom | Check first |
| --- | --- |
| CRC mismatch | Endian of length field; payload slice bounds |
| Hang on read | Partial frame buffering |
| Wrong VM output | Bytecode assembly order; PUSH immediate width |
| Queue never drains | Worker not started; await deadlock |

## Escalation Rule

If user impact is material or the same class of bug repeats, open or update a [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Postmortem|Postmortem]] and [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Known Issues|Known Issues]] item.

## Related Documents

- [[00-Templates/Debug Diary Template|Debug Diary Template]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Engineering Journal|Engineering Journal]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Testing|Testing]]

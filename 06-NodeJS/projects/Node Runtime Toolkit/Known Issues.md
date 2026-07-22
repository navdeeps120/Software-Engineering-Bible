---
title: "Node Runtime Toolkit — Known Issues"
aliases: []
track: 06-NodeJS
topic: node-runtime-toolkit-known-issues
difficulty: intermediate
status: active
prerequisites: []
tags: [project, nodejs, issues]
created: 2026-07-22
updated: 2026-07-22
---

# Known Issues — Node Runtime Toolkit

## Open Issues

| ID | Summary | Severity | Workaround | Status |
| --- | --- | --- | --- | --- |
| KI-001 | Code lab tree [[06-NodeJS/code\|06-NodeJS/code]] not yet fully implemented | high | Follow module paths in docs; implement with test-first workflow | open |
| KI-002 | No package facade or `nrt` CLI adapter yet | high | Import planned paths directly during development | open |
| KI-003 | Event-loop tracer is pedagogical, not libuv phase accurate | medium | Compare with [[06-NodeJS/02-Event-Loop-and-libuv/Event Loop Phases\|Event Loop Phases]] note | accepted for lab |
| KI-004 | Worker pool cannot cancel in-flight worker compute | medium | Timeouts + cooperative worker checks | accepted constraint |
| KI-005 | Exports resolver differs from Node core edge cases | medium | Treat as simulation; verify critical paths in real Node separately | open |

## Technical Debt

Add dedicated test modules per capability, public re-exports, CLI schema validation, clean-install CI, tarball smoke tests, and benchmark fixtures. Pay contract and safety debt before new capabilities.

## Risk Rule

No issue above may be hidden or represented as Node core or framework compatibility. Track delivery in [[06-NodeJS/projects/Node Runtime Toolkit/Roadmap|Roadmap]] and investigations in [[06-NodeJS/projects/Node Runtime Toolkit/Debug Diary|Debug Diary]].

## Related Documents

- [[06-NodeJS/projects/Node Runtime Toolkit/Postmortem|Postmortem]]
- [[06-NodeJS/projects/Node Runtime Toolkit/Roadmap|Roadmap]]

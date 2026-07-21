---
title: Concurrent Runtime and Protocol Workbench — Known Issues
aliases: []
track: 01-Computer-Science
topic: concurrent-runtime-protocol-workbench-known-issues
difficulty: intermediate
status: active
prerequisites:
  - "[[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/README|Concurrent Runtime and Protocol Workbench]]"
tags: [project, issues]
created: 2026-07-21
updated: 2026-07-21
---

# Known Issues — Concurrent Runtime and Protocol Workbench

## Open Issues

| ID | Summary | Severity | Workaround | Owner | Status |
| --- | --- | --- | --- | --- | --- |
| KI-001 | Long-lived workbench server not yet wired | low | Use unit tests + lab modules | — | open |
| KI-002 | No VM instruction budget | medium | Only trusted bytecode in tests | — | open |
| KI-003 | JS race demo is simulated not parallel | low | Read Concurrency Zoo Architecture note | — | accepted |

## Technical Debt

| ID | Debt | Risk if deferred | Paydown plan |
| --- | --- | --- | --- |
| TD-001 | Integration test for full TCP job path | Drift between docs and runtime | Roadmap P1 |
| TD-002 | Partial-read frame buffer in server | Production-shaped bugs hidden | Add streaming decoder test |
| TD-003 | HTTP parser minimal | Malformed request edge cases | Document unsupported cases in API |

## Closed / Accepted Risks

| ID | Summary | Resolution | Date |
| --- | --- | --- | --- |
| AR-001 | No database persistence | Documented non-goal in Database.md | 2026-07-21 |
| AR-002 | No TLS/auth | Local-only threat model in Security.md | 2026-07-21 |

## Related Documents

- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Debug Diary|Debug Diary]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Roadmap|Roadmap]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Monitoring|Monitoring]]

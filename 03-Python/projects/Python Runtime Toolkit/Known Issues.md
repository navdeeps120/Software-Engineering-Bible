---
title: "Python Runtime Toolkit — Known Issues"
aliases: []
track: 03-Python
topic: "python-runtime-toolkit-known-issues"
difficulty: intermediate
status: active
prerequisites: []
tags: [project, python, issues]
created: 2026-07-21
updated: 2026-07-21
---

# Known Issues — Python Runtime Toolkit

## Open Issues

| ID | Summary | Severity | Workaround | Status |
| --- | --- | --- | --- | --- |
| KI-001 | No package facade or CLI adapter yet | high | Import `seb_python` modules inside [[03-Python/code\|03-Python/code]] and run pytest | open |
| KI-002 | asyncio-lite lacks Task, timers, and selector I/O | medium | Use stdlib `asyncio` in production | accepted for lab |
| KI-003 | Import graph reports first cycle point, not full SCC | low | Reconstruct manually from fixture | open |
| KI-004 | `map_limit` cannot cancel in-flight worker threads | medium | Use timeouts and cooperative workers externally | accepted constraint |
| KI-005 | Public `__init__.py` exports only `__version__` | medium | Import submodules directly until facade lands | open |

## Technical Debt

Add dedicated test modules per capability, public re-exports, CLI schema validation, clean-install CI, and wheel smoke tests. Pay down contract and safety debt before adding new capabilities.

## Risk Rule

No issue above may be hidden by documentation or represented as CPython/stdlib compatibility. Track delivery in [[03-Python/projects/Python Runtime Toolkit/Roadmap|Roadmap]] and investigations in [[03-Python/projects/Python Runtime Toolkit/Debug Diary|Debug Diary]].

## Related Documents

- [[03-Python/projects/Python Runtime Toolkit/Postmortem|Postmortem]]
- [[03-Python/projects/Python Runtime Toolkit/Roadmap|Roadmap]]

---
title: "Worker Pool Lab — Security"
aliases: []
track: 06-NodeJS
topic: worker-pool-lab-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, nodejs, security]
created: 2026-07-22
updated: 2026-07-22
---

# Security — Worker Pool Lab

## Focus

Treating worker threads as isolation boundaries, loading worker code from untrusted paths, and resource exhaustion via unbounded queue or message size.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| User-supplied worker path | Arbitrary code execution | Fixed worker entry at pool construct |
| Huge postMessage payload | Memory exhaustion | Max payload bytes enforced |
| Infinite task spam | Queue RAM growth | Max queue depth; backpressure to caller |
| SharedArrayBuffer exfil | Cross-thread data leaks | Disabled unless explicit contract + docs |

## Controls

- Worker script is versioned repository file, not runtime string.
- Document in README: workers share same user as main process—not a sandbox.
- Pool exposes queue depth metric for monitoring hooks in toolkit.

## Related Documents

- [[06-NodeJS/projects/Worker Pool Lab/README|README]]
- [[06-NodeJS/projects/Node Runtime Toolkit/ADR/ADR-003 Worker vs Cluster Default|ADR-003]]

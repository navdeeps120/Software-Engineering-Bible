---
title: "Stream Pipeline Toolkit — Security"
aliases: []
track: 06-NodeJS
topic: stream-pipeline-toolkit-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, nodejs, security]
created: 2026-07-22
updated: 2026-07-22
---

# Security — Stream Pipeline Toolkit

## Focus

Memory exhaustion via unbounded object-mode buffering, unsafe path writes when file sinks are composed, and transform stages that interpret payload bytes as executable content.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| Fast source + slow sink misconfigured | RAM exhaustion | Enforce `highWaterMark`; cap object in-flight count |
| File path from stream chunk | Path traversal | No dynamic paths from payload in v1; use safe join helper |
| `eval` in transform | RCE | Transforms are typed functions only; no dynamic code |
| Zip bomb style tiny compressed stream | Decompress bomb | Out of scope unless explicit decompress stage with byte cap |

## Controls

- Builder validates stage list before execution.
- Default byte ceiling on readable sources in test fixtures.
- Document that streams are not a sandbox—untrusted input needs size limits and validation at boundaries.

## Related Documents

- [[06-NodeJS/projects/Stream Pipeline Toolkit/README|README]]
- [[06-NodeJS/projects/Node Runtime Toolkit/ADR/ADR-002 Streams vs Web Streams Default|ADR-002]]

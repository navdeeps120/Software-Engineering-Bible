---
title: "Linux Host Workbench — Monitoring"
aliases: []
track: 10-Linux
topic: linux-host-workbench-monitoring
difficulty: intermediate
status: active
prerequisites: []
tags: [project, linux, monitoring]
created: 2026-07-23
updated: 2026-07-23
---

# Monitoring — Linux Host Workbench

## Operability Model

This is a local library/CLI, not an always-on host agent fleet; uptime SLOs would be misleading. Release health is measured through CI, tarball smoke tests, issue trends, and opt-in lab diagnostics.

| Signal | Target | Evidence |
| --- | --- | --- |
| Supported-platform verification | 100% required jobs pass | CI checks (fixture-only) |
| Tarball smoke success | 100% before publish | install/import run |
| Deterministic CLI errors | 100% contract tests | exit-code suite |
| Critical dependency exposure | 0 unmitigated releasable findings | audit record |
| Scenario regression | golden fixtures unchanged | cgroup/nft/unit/first-aid suites |

```mermaid
flowchart LR
    Tests --> CI[CI evidence]
    Pack[Tarball smoke] --> CI
    Audit[npm audit triage] --> CI
    CLI[Opt-in lab metrics] --> Stderr[Structured stderr]
    CI --> Release[Release gate]
```

## Lab Diagnostics (Opt-In)

With explicit `LHW_DEBUG=1`, report command, duration bucket, fixture size bucket, module, and stable error code—never raw secrets, oversized process dumps, or live host identifiers on stdout.

## Related Documents

- [[10-Linux/projects/Linux Host Workbench/Deployment|Deployment]]
- [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Golden Signals on a Single Box|Golden Signals on a Single Box]]

---
title: "Linux Host Workbench — Testing"
aliases: []
track: 10-Linux
topic: linux-host-workbench-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, linux, testing]
created: 2026-07-23
updated: 2026-07-23
---

# Testing — Linux Host Workbench

## Strategy

```mermaid
flowchart TD
    Unit[Module unit tests] --> Integration[Cross-module scenario suites]
    Unit --> Contract[CLI schema contracts]
    Integration --> Golden[Golden reports: OOM nft unit cycle first-aid]
    Contract --> CLI[CLI integration target]
    CLI --> Package[npm pack smoke test]
    Package --> Platform[Node LTS platform matrix]
```

## Test Layers

| Layer | Coverage |
| --- | --- |
| Unit | procfs field parse, cgroup tokens, nft match, unit cycle DFS, signal thresholds |
| Integration | first-aid merge of upstream reports; noisy-neighbor + OOM; listen conflict + nft drop |
| Contract | JSON CLI schemas, stderr/stdout separation, exit codes |
| Package | install tarball, import facade, invoke `lhw` entry |
| Platform | Windows/Linux/macOS on Node 20+ LTS **without** Docker/K8s/live VM |

## Current Command

```bash
cd 10-Linux/code
npm install
npm test
```

Target executable coverage: labs under `10-Linux/code/tests`. Required additions include facade export smoke tests, CLI schema validation, hostile input fixtures, golden scenarios for cgroup/nft/systemd/first-aid, and packed-artifact smoke tests.

## Module Test Filters

| Focus | Suggested filter |
| --- | --- |
| Procfs | `Procfs\|parseStat\|parseStatus` |
| Cgroup | `BudgetClinic\|Cgroup` |
| Network | `NetworkTriage\|Nftables\|Conntrack` |
| systemd | `SystemdUnit\|Hardening\|Timer` |
| Observability | `FirstAid\|GoldenSignal\|Playbook` |

## Related Documents

- [[10-Linux/projects/Linux Host Workbench/API|API]]
- [[10-Linux/projects/Linux Host Workbench/Requirements|Requirements]]
- [[10-Linux/projects/Linux Host Workbench/ADR/ADR-001 Simulation Scope|ADR-001]]

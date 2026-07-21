---
title: "{{project}} — Monitoring"
aliases: []
track: Projects
topic: "{{project-slug}}-monitoring"
difficulty: intermediate
status: stub
prerequisites: []
tags: [project, monitoring]
created: "{{date}}"
updated: "{{date}}"
---

# Monitoring — {{project}}

## Service Level Objectives

| SLO | Target | Window | Burn-alert idea |
| --- | --- | --- | --- |
| Availability |  |  |  |
| Latency p95 |  |  |  |
| Error rate |  |  |  |

## Golden Signals

- Latency:
- Traffic:
- Errors:
- Saturation:

## Instrumentation Plan

| Event / metric | Type | Labels | Why |
| --- | --- | --- | --- |
|  | counter/histogram/gauge |  |  |

## Logging

- Structured fields required:
- PII policy:
- Correlation IDs:

## Tracing

- Critical spans:
- Sampling strategy:

## Alerting

| Alert | Condition | Severity | Runbook |
| --- | --- | --- | --- |
|  |  |  |  |

```mermaid
flowchart LR
    App[App Telemetry] --> Prom[Metrics Store]
    App --> Logs[Log Store]
    App --> Traces[Trace Store]
    Prom --> Alert[Alert Manager]
    Alert --> Human[On-call]
```

## Dashboards

- Overview:
- Dependency health:
- Business KPIs:

## Related Documents

- [[00-Templates/Project/Deployment|Deployment]]
- [[00-Templates/Project/Postmortem|Postmortem]]
- [[00-Templates/Project/Known Issues|Known Issues]]

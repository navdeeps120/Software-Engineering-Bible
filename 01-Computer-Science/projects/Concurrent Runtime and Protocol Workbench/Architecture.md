---
title: Concurrent Runtime and Protocol Workbench — Architecture
aliases: []
track: 01-Computer-Science
topic: concurrent-runtime-protocol-workbench-architecture
difficulty: advanced
status: active
prerequisites:
  - "[[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/README|Concurrent Runtime and Protocol Workbench]]"
tags: [project, architecture, portfolio]
created: 2026-07-21
updated: 2026-07-21
---

# Architecture — Concurrent Runtime and Protocol Workbench

## Summary

Single-process **workbench server** combining four mechanism labs: **CRC32 length-prefixed framing** on TCP, **stack VM** job execution, **bounded-buffer worker pool** with backpressure, and **HTTP/1.0** status. Architectural style: **layered monolith** with explicit error channels—no DI framework, no ORM, no message broker.

## Context Diagram

```mermaid
flowchart LR
    Dev[Developer / Test Client] --> WB[Protocol Workbench]
    WB --> Loopback[127.0.0.1 TCP + HTTP]
    Labs[CS Code Labs] -.-> WB
```

## Container Diagram

```mermaid
flowchart TD
    subgraph process [Workbench Process]
        TCP[TCP Listener]
        Frame[Framing codec]
        Q[BoundedBuffer Job Queue]
        W1[Worker 1]
        W2[Worker N]
        VM[Stack VM]
        HTTP[HTTP/1.0 Status]
        Metrics[In-memory counters]
    end
    TCP --> Frame
    Frame --> Q
    Q --> W1
    Q --> W2
    W1 --> VM
    W2 --> VM
    VM --> Frame
    HTTP --> Metrics
    Q --> Metrics
```

## Key Components

| Component | Responsibility | Source lab |
| --- | --- | --- |
| Framing codec | Encode/decode jobs; CRC verify | [[01-Computer-Science/projects/Binary Protocol Lab/README\|Binary Protocol Lab]] |
| Job queue | Absorb burst; reject when full | [[01-Computer-Science/projects/Concurrency Zoo/README\|Concurrency Zoo]] |
| Worker pool | Fixed concurrency; pull jobs | Concurrency Zoo |
| Stack VM | Execute bytecode; surface VmError | [[01-Computer-Science/projects/Stack Machine/README\|Stack Machine]] |
| TCP transport | Stream bytes; handle partial reads | [[01-Computer-Science/projects/Socket Workshop/README\|Socket Workshop]] |
| HTTP status | Human-readable health | Socket Workshop |

## Data Flow — Job Execution

```mermaid
sequenceDiagram
    participant C as TCP Client
    participant F as Framing
    participant Q as Queue
    participant W as Worker
    participant V as VM
    C->>F: framed bytecode job
    F->>F: CRC + length check
    alt queue full
        F-->>C: framed ERROR queue_full
    else accepted
        F->>Q: enqueue job
        W->>Q: dequeue
        W->>V: run(bytecode)
        alt VM fault
            V-->>W: VmError
            W-->>C: framed ERROR vm_fault
        else success
            V-->>W: output
            W-->>C: framed OK + output
        end
    end
```

## Cross-Cutting Concerns

- **Authn / authz:** None — loopback-only; see [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Security|Security]]
- **Consistency model:** Single process; no cross-node consistency
- **Caching:** None
- **Idempotency:** Client-generated job IDs optional; not required for lab
- **Failure isolation:** VM faults contained per job; worker continues
- **Multi-tenancy:** N/A

## Quality Attribute Scenarios

| Attribute | Scenario | Response measure |
| --- | --- | --- |
| Availability | Worker crash on bad bytecode | Other workers continue; error frame returned |
| Latency | Queue depth 0, 1 worker | Job p95 under test harness threshold |
| Durability | Process kill | Jobs in queue lost — accepted non-goal |
| Scalability | Burst exceeds queue | `tryPush` false; client backs off |

## Trade-offs

| Decision | Benefit | Cost | Alternative rejected |
| --- | --- | --- | --- |
| Length-prefixed + CRC32 | Simple stream parsing | Not authenticated | TLS + HMAC (overkill for lab) |
| Fixed worker pool | Predictable saturation | No auto-scale | Unbounded goroutines |
| HTTP/1.0 status only | Trivial parser | No metrics export standard | Prometheus sidecar |
| In-memory queue | Zero ops burden | No crash recovery | Redis queue |

## Open Questions

- Should job payloads be raw bytecode or JSON wrapper with metadata?
- Maximum frame size default: 64 KiB vs 1 MiB?

## Related Documents

- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Requirements|Requirements]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/API|API]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/ADR/0001-framing-protocol|ADR-0001]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/ADR/0002-concurrency-model|ADR-0002]]

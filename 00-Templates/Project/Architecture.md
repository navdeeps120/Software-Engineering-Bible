---
title: "{{project}} — Architecture"
aliases: []
track: Projects
topic: "{{project-slug}}-architecture"
difficulty: advanced
status: stub
prerequisites: []
tags: [project, architecture]
created: "{{date}}"
updated: "{{date}}"
---

# Architecture — {{project}}

## Summary

<!-- Architectural style and primary constraints -->

## Context Diagram

```mermaid
flowchart LR
    Users[Users] --> System[{{project}}]
    System --> ExtA[External System A]
    System --> ExtB[External System B]
```

## Container Diagram

```mermaid
flowchart TD
    Web[Web / Client] --> API[API Service]
    API --> DB[(Database)]
    API --> Queue[[Queue]]
    Queue --> Worker[Worker]
```

## Key Components

| Component | Responsibility | Owner mindset |
| --- | --- | --- |
|  |  |  |

## Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as API
    participant D as Database
    U->>A: Request
    A->>D: Query / write
    D-->>A: Result
    A-->>U: Response
```

## Cross-Cutting Concerns

- Authn / authz:
- Consistency model:
- Caching:
- Idempotency:
- Failure isolation:
- Multi-tenancy:

## Quality Attribute Scenarios

| Attribute | Scenario | Response measure |
| --- | --- | --- |
| Availability |  |  |
| Latency |  |  |
| Durability |  |  |
| Scalability |  |  |

## Trade-offs

| Decision | Benefit | Cost | Alternative rejected |
| --- | --- | --- | --- |
|  |  |  |  |

## Open Questions

- 

## Related Documents

- [[00-Templates/Project/Requirements|Requirements]]
- [[00-Templates/Project/Database|Database]]
- [[00-Templates/Project/API|API]]
- [[00-Templates/Project/ADR/ADR Template|ADR Template]]

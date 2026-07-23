---
title: System Design Interview Questions
aliases: [System Design Interview Sets]
track: 09-System-Design
topic: system-design-interview-questions
difficulty: intermediate
status: active
prerequisites: ["[[09-System-Design/README|System Design]]"]
tags: [interviews, system-design, capacity, consistency, partitioning, multi-region, moc]
created: 2026-07-23
updated: 2026-07-23
---

# System Design Interview Questions

Thirteen interview sets assess workload modeling, capacity and latency judgment, edge/LB topology, consistency and partitioning, caching and messaging at fleet scale, multi-region policy, coordination restraint, failure modes, observability, reference architectures, and staff-level clone portfolio designs.

## Practice Loop

```mermaid
flowchart LR
  Prompt[Read prompt] --> NFR[State NFRs and workload]
  NFR --> Cap[Capacity and latency budget]
  Cap --> Topo[Draw topology]
  Topo --> Cons[Consistency and failure contract]
  Cons --> Fail[Stress failure modes]
  Fail --> Ops[Ops and rollout]
  Ops --> Staff[Staff-level trade-offs]
  Staff --> Reflect[Score and improve]
  Reflect --> Prompt
```

## Interview Sets

1. [[09-System-Design/_interview/00-Orientation-and-Boundaries|00 Orientation and Boundaries]]
2. [[09-System-Design/_interview/01-Capacity-Latency-and-Bottlenecks|01 Capacity Latency and Bottlenecks]]
3. [[09-System-Design/_interview/02-Load-Balancing-and-Edge-Entry|02 Load Balancing and Edge Entry]]
4. [[09-System-Design/_interview/03-Consistency-Models-and-CAP|03 Consistency Models and CAP]]
5. [[09-System-Design/_interview/04-Partitioning-Sharding-and-Placement|04 Partitioning Sharding and Placement]]
6. [[09-System-Design/_interview/05-Caching-at-Product-Scale|05 Caching at Product Scale]]
7. [[09-System-Design/_interview/06-Messaging-Streams-and-Async-Topologies|06 Messaging Streams and Async Topologies]]
8. [[09-System-Design/_interview/07-Multi-Region-and-Geo|07 Multi-Region and Geo]]
9. [[09-System-Design/_interview/08-Coordination-Consensus-and-Locks|08 Coordination Consensus and Locks]]
10. [[09-System-Design/_interview/09-Failure-Modes-at-Product-Scale|09 Failure Modes at Product Scale]]
11. [[09-System-Design/_interview/10-Observability-and-Control-Planes|10 Observability and Control Planes]]
12. [[09-System-Design/_interview/11-Reference-Architectures|11 Reference Architectures]]
13. [[09-System-Design/_interview/12-Clone-Case-Studies-and-Portfolio|12 Clone Case Studies and Portfolio]]

## Evaluation Standard

- Answers open with NFRs, workload assumptions, and success metrics—not component lists.
- Topology answers name consistency, partition, and failure contracts explicitly.
- Capacity answers show units, peak factors, and percentile targets—not averages alone.
- Multi-region answers include RPO/RTO and split-brain product policy.
- Failure answers name blast radius, bulkheads, and degradation paths.
- Staff answers include ADRs, rollout, observability, and org-level standards.

## Related Notes

- [[Career/README|Career]]
- [[09-System-Design/_exercises/README|System Design Exercises]]
- [[09-System-Design/code/README|System Design code labs]]
- [[09-System-Design/README|System Design]]

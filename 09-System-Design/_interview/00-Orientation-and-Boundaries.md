---
title: Orientation and Boundaries Interview
aliases: [00 Orientation Interview]
track: 09-System-Design
topic: orientation-and-boundaries-interview
difficulty: beginner
status: active
prerequisites: ["[[09-System-Design/00-Orientation-and-Boundaries/Why System Design Exists|Why System Design Exists]]"]
tags: [interviews, system-design, orientation, adr]
created: 2026-07-23
updated: 2026-07-23
---

# Orientation and Boundaries Interview

## Linked Topic

- [[09-System-Design/00-Orientation-and-Boundaries/Why System Design Exists|Why System Design Exists]]
- [[09-System-Design/00-Orientation-and-Boundaries/Backend Databases and System Design Boundaries|Backend Databases and System Design Boundaries]]
- [[09-System-Design/00-Orientation-and-Boundaries/Requirements Non-Functional and Workload Modeling|Requirements Non-Functional and Workload Modeling]]
- [[09-System-Design/00-Orientation-and-Boundaries/Failure Domains and Blast Radius Budgets|Failure Domains and Blast Radius Budgets]]
- [[09-System-Design/00-Orientation-and-Boundaries/ADR Discipline for Distributed Decisions|ADR Discipline for Distributed Decisions]]

## How to Practice

1. Answer out loud in 2–5 minutes; draw boundaries before components.
2. Separate Backend, Databases, and System Design ownership explicitly.
3. State NFRs and blast-radius budgets before topology.
4. Close with an ADR-worthy decision and a failure mode.

## Junior — Contracts and Boundaries

1. What problem does System Design solve that Backend API design alone does not?

   - **Strong:** Fleet topology, capacity, consistency across services, multi-region policy—not Express routes
   - **Weak:** "Drawing boxes" or listing AWS services

2. Where is the boundary between System Design and Databases for sharding?

   - **Strong:** Key strategy and resharding windows vs page/B+ engine internals; handoff to [[08-Databases/README|Databases]]
   - **Weak:** Explaining MVCC as System Design

3. Name three NFRs you must clarify before proposing Kafka.

   - **Strong:** Latency SLO, durability/RPO, ordering needs, fan-out volume
   - **Weak:** "Because it's scalable"

## Mid — Modeling and ADRs

4. How do you model workload for a new product before capacity estimates?

   - **Strong:** DAU, peak factor, read/write ratio, object sizes, retention, skew
   - **Weak:** Single average QPS number

5. What is a failure domain and a blast-radius budget?

   - **Strong:** Isolatable unit + max users/% traffic it may take down; shared deps as budget risk
   - **Weak:** "Anything that can fail"

6. Walk through an ADR for sync vs async notifications.

   - **Strong:** Context (SLO), decision, consequences, rejected alternatives
   - **Weak:** "I'd use a queue" without trade-offs

7. When should you *not* split a monolith into services?

   - **Strong:** Unclear data ownership, no independent scale/fail needs, team coupling
   - **Weak:** Never / always microservices

## Senior — Production Judgment

8. Two teams share one database "temporarily." What System Design risks appear?

   - **Strong:** Blast radius, schema coupling, unclear consistency; path to owned stores
   - **Weak:** Only "use foreign keys carefully"

9. "The system is slow" with healthy single-service CPU—how do you triage topology vs code?

   - **Strong:** Cross-service latency, hot shards, cache miss, fan-out; metrics order
   - **Weak:** Profile one process only

## Staff — Org and Standards

10. How would you define System Design review standards across 20 teams?

    - **Strong:** Mandatory NFR, capacity, consistency, failure, ADR; exception process
    - **Weak:** "Use the template" without enforcement

11. Platform wants one global shared Redis for all products. Assess blast radius.

    - **Strong:** Budget collapse, noisy neighbor, failure domain merge; counterproposal
    - **Weak:** Cost savings only

12. Draft a hiring signal: what must a senior demonstrate in a System Design loop?

    - **Strong:** Invariants→topology, numbers, failure, handoffs to Backend/DB; not trivia
    - **Weak:** Tool name recall

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Boundaries | Tech list | Track ownership with handoffs |
| NFRs | Skipped | Workload + blast radius first |
| Staff | Opinions | Standards, ADRs, org adoption |

## Related Notes

- [[09-System-Design/_exercises/00-Orientation-and-Boundaries|Orientation Exercises]]
- [[Career/README|Career]]
- [[09-System-Design/README|System Design]]

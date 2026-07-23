---
title: Consistency Models and CAP Interview
aliases: [03 Consistency Interview]
track: 09-System-Design
topic: consistency-models-and-cap-interview
difficulty: intermediate
status: active
prerequisites: ["[[09-System-Design/03-Consistency-Models-and-CAP/CAP and PACELC as Product Constraints|CAP and PACELC as Product Constraints]]"]
tags: [interviews, system-design, consistency, cap, quorums]
created: 2026-07-23
updated: 2026-07-23
---

# Consistency Models and CAP Interview

## Linked Topic

- [[09-System-Design/03-Consistency-Models-and-CAP/CAP and PACELC as Product Constraints|CAP and PACELC as Product Constraints]]
- [[09-System-Design/03-Consistency-Models-and-CAP/Strong Eventual Causal and Read-Your-Writes|Strong Eventual Causal and Read-Your-Writes]]
- [[09-System-Design/03-Consistency-Models-and-CAP/Quorums R plus W and Tunable Consistency|Quorums R plus W and Tunable Consistency]]
- [[09-System-Design/03-Consistency-Models-and-CAP/Conflict Policies LWW and CRDT Product Use|Conflict Policies LWW and CRDT Product Use]]
- [[09-System-Design/03-Consistency-Models-and-CAP/Choosing Consistency from User-Visible Invariants|Choosing Consistency from User-Visible Invariants]]

## How to Practice

1. Start from user-visible invariants, not CAP slogans.
2. Prefer per-operation consistency choices.
3. Name conflict policy and UX.
4. Quantify staleness windows when eventual.

## Junior

1. Explain CAP without "pick two forever."

   - **Strong:** During partition, per-operation C vs A; normal case PACELC
   - **Weak:** Triangle meme only

2. Give a product example of read-your-writes.

   - **Strong:** Edit profile then refresh; sticky/version/primary read
   - **Weak:** Synonym for strong consistency

3. What is eventual consistency in user terms?

   - **Strong:** Convergence + window; what user might see
   - **Weak:** "Eventually consistent DB"

## Mid

4. When is causal consistency worth the cost?

   - **Strong:** Happens-before UX (comment threads); vs full linearizability cost
   - **Weak:** Always/never

5. Explain N/R/W and R+W > N.

   - **Strong:** Quorum intersection; practical caveats (lag, clocks)
   - **Weak:** Formula only

6. Inventory reservation: strong vs eventual—how decide?

   - **Strong:** Oversell cost vs latency; compensating actions
   - **Weak:** "Payments need strong" blanket

7. LWW vs CRDT for which data types?

   - **Strong:** LWW loses concurrent updates; CRDT for mergesets/counters; UX for conflicts
   - **Weak:** Always CRDT

## Senior

8. Design read-your-writes after cross-region write.

   - **Strong:** Session affinity, version tokens, regional primary read
   - **Weak:** "Sync replication everywhere"

9. Partition splits replicas—what does the user see under CP vs AP?

   - **Strong:** Errors vs stale/divergent writes; heal policy
   - **Weak:** "System goes down"

## Staff

10. Leadership demands linearizability for all reads. Response?

    - **Strong:** Latency/availability cost; tiered consistency menu by invariant
    - **Weak:** Agree without numbers

11. How do you test consistency contracts in CI/staging?

    - **Strong:** Jepsen-like scenarios, client checkers, chaos partitions
    - **Weak:** Unit tests of mocks

12. Set org guidance: consistency by domain (feed, billing, presence).

    - **Strong:** Matrix + ADR template + review gates
    - **Weak:** One global setting

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| CAP | Trivia | Product partition policy |
| Models | Buzzwords | Invariant-driven |
| Conflicts | Default LWW | Typed policies + UX |

## Related Notes

- [[09-System-Design/_exercises/03-Consistency-Models-and-CAP|Consistency Exercises]]
- [[09-System-Design/projects/Consistency and Quorum Demo/README|Consistency and Quorum Demo]]
- [[Career/README|Career]]

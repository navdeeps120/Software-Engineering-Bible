---
title: Consistency Models and CAP Exercises
aliases: [03 Consistency Exercises]
track: 09-System-Design
topic: consistency-models-and-cap-exercises
difficulty: intermediate
status: active
prerequisites: ["[[09-System-Design/_exercises/02-Load-Balancing-and-Edge-Entry|Load Balancing and Edge Entry Exercises]]"]
tags: [exercises, system-design, consistency, cap, quorums]
created: 2026-07-23
updated: 2026-07-23
---

# Consistency Models and CAP Exercises

Treat CAP/PACELC as product constraints, choose consistency from user-visible invariants, design quorums and conflict policies, and reject engine trivia as a substitute for contracts.

## Linked Topic

- [[09-System-Design/03-Consistency-Models-and-CAP/CAP and PACELC as Product Constraints|CAP and PACELC as Product Constraints]]
- [[09-System-Design/03-Consistency-Models-and-CAP/Strong Eventual Causal and Read-Your-Writes|Strong Eventual Causal and Read-Your-Writes]]
- [[09-System-Design/03-Consistency-Models-and-CAP/Quorums R plus W and Tunable Consistency|Quorums R plus W and Tunable Consistency]]
- [[09-System-Design/03-Consistency-Models-and-CAP/Conflict Policies LWW and CRDT Product Use|Conflict Policies LWW and CRDT Product Use]]
- [[09-System-Design/03-Consistency-Models-and-CAP/Choosing Consistency from User-Visible Invariants|Choosing Consistency from User-Visible Invariants]]

## Progression

**Understand → Model → Design → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Restate CAP without the interview myth "pick two forever." What does a partition force you to choose for a given operation?

**Hint:** [[09-System-Design/03-Consistency-Models-and-CAP/CAP and PACELC as Product Constraints|CAP and PACELC as Product Constraints]].

**Acceptance criteria:**

- [ ] Partition as rare-but-real constraint
- [ ] Per-operation framing
- [ ] PACELC latency trade-off mentioned

### Problem 2 — `intermediate`

**Prompt:** Define strong, eventual, causal, and read-your-writes with one user-visible example each.

**Acceptance criteria:**

- [ ] Four models with product examples
- [ ] Which is weaker/stronger clarified where comparable
- [ ] Link to [[09-System-Design/03-Consistency-Models-and-CAP/Strong Eventual Causal and Read-Your-Writes|Strong Eventual Causal and Read-Your-Writes]]

### Problem 3 — `intermediate`

**Prompt:** Explain N/R/W quorums. When does R+W > N guarantee intersection? When does it not save you from stale reads in practice?

**Acceptance criteria:**

- [ ] Intersection condition stated
- [ ] Clock/lag/partial failure caveat
- [ ] Link to [[09-System-Design/03-Consistency-Models-and-CAP/Quorums R plus W and Tunable Consistency|Quorums R plus W and Tunable Consistency]]

## Model

### Problem 1 — `beginner`

**Prompt:** For a collaborative document, list user-visible invariants (e.g., "no lost typed characters"). Map each to a consistency/conflict requirement.

**Acceptance criteria:**

- [ ] ≥4 invariants
- [ ] Mapping to model/policy
- [ ] Over-strong choices challenged

### Problem 2 — `intermediate`

**Prompt:** Model inventory reservation: oversell risk vs checkout latency. Choose consistency class and quantify acceptable inconsistency window.

**Hint:** [[09-System-Design/03-Consistency-Models-and-CAP/Choosing Consistency from User-Visible Invariants|Choosing Consistency from User-Visible Invariants]].

**Acceptance criteria:**

- [ ] Business cost of oversell vs latency
- [ ] Chosen model with window
- [ ] Compensating action named

### Problem 3 — `advanced`

**Prompt:** Model multi-region profile updates with LWW vs CRDT counters/sets. Where does LWW destroy product truth?

**Hint:** [[09-System-Design/03-Consistency-Models-and-CAP/Conflict Policies LWW and CRDT Product Use|Conflict Policies LWW and CRDT Product Use]].

**Acceptance criteria:**

- [ ] LWW failure example
- [ ] CRDT fit/misfit
- [ ] Product UX for conflicts

## Design

### Problem 1 — `intermediate`

**Prompt:** Design read path options after write: primary read, quorum read, session sticky, version tokens. Pick for "edit profile then refresh."

**Acceptance criteria:**

- [ ] Read-your-writes mechanism chosen
- [ ] Latency cost stated
- [ ] Failure if sticky node dies

### Problem 2 — `intermediate`

**Prompt:** Design conflict policy for shopping cart merges across devices offline. Specify merge rules and user prompts.

**Acceptance criteria:**

- [ ] Deterministic merge where possible
- [ ] User-visible conflict UX
- [ ] Idempotent replay considered

### Problem 3 — `advanced`

**Prompt:** Draft an ADR: "eventual consistency for feed likes; strong for payments." Include invariants and rejected "one consistency for all."

**Acceptance criteria:**

- [ ] Per-domain consistency
- [ ] Cross-domain interaction risks
- [ ] Observability of inconsistency

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Network partition splits replica set. Walk CP vs AP behavior for a leader-based store and a quorum store. What does the user see?

**Acceptance criteria:**

- [ ] Both behaviors described
- [ ] Product messaging during partition
- [ ] Heal/reconcile plan

### Problem 2 — `advanced`

**Prompt:** Clients retry writes during a blip, creating duplicates that LWW "resolves" incorrectly. Design detection and repair.

**Acceptance criteria:**

- [ ] Idempotency keys / fencing
- [ ] Audit of lost updates
- [ ] Handoff to messaging/outbox patterns

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Support tickets: "I liked a post but count went down." Write an investigation that separates cache staleness, eventual counters, and true data loss.

**Acceptance criteria:**

- [ ] Hypothesis tree
- [ ] Metrics/logs needed
- [ ] User communication template

### Problem 2 — `advanced`

**Prompt:** Leadership demands linearizability for all reads. Cost the proposal in latency and availability; propose a tiered consistency menu instead.

**Acceptance criteria:**

- [ ] Cost/availability impact
- [ ] Tiered menu by invariant
- [ ] Migration path without big-bang

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| CAP | Buzzwords | Per-operation partition policy |
| Models | Synonyms | User-visible invariants drive choice |
| Conflicts | "Last write wins" default | Policy matched to data type and UX |

## Related Notes

- [[09-System-Design/_interview/03-Consistency-Models-and-CAP|Consistency Interview]]
- [[09-System-Design/projects/Consistency and Quorum Demo/README|Consistency and Quorum Demo]]
- [[09-System-Design/README|System Design]]
- [[Career/README|Career]]

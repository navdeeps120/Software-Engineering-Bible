---
title: Production Selection Exercises
aliases: [Production Selection Drills]
track: 04-Data-Structures
topic: production-selection-exercises
difficulty: advanced
status: active
prerequisites: ["[[04-Data-Structures/README|Data Structures]]"]
tags: [exercises, data-structures, production-selection]
created: 2026-07-21
updated: 2026-07-21
---

# Production Selection Exercises

Synthesize structure choice, stdlib mapping, measurement, and system boundaries under real operational constraints.

## Linked Topic

- [[04-Data-Structures/14-Production-Selection/Structure Selection Decision Matrix|Structure Selection Decision Matrix]]
- [[04-Data-Structures/14-Production-Selection/Standard-Library Mapping for TypeScript and Python|Standard-Library Mapping for TypeScript and Python]]
- [[04-Data-Structures/14-Production-Selection/Measuring Structures in Production|Measuring Structures in Production]]
- [[04-Data-Structures/14-Production-Selection/From In-Memory Structures to Systems|From In-Memory Structures to Systems]]

## Progression

**Understand → Implement → Optimize → Debug Invariant → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Fill rows of [[04-Data-Structures/14-Production-Selection/Structure Selection Decision Matrix|Structure Selection Decision Matrix]] for: session index, autocomplete, rate limiter, graph social feed adjacency.

**Acceptance criteria:**

- [ ] Four workloads mapped
- [ ] Assumptions column filled
- [ ] Alternatives named

### Problem 2 — `intermediate`

**Prompt:** Map ADT needs to TS `Map`/`Set` and Python `dict`/`set` with notes on ordering, hash seeding, and resize behavior.

**Hint:** See [[04-Data-Structures/14-Production-Selection/Standard-Library Mapping for TypeScript and Python|Standard-Library Mapping]].

**Acceptance criteria:**

- [ ] Language differences tabulated
- [ ] When to avoid stdlib
- [ ] Interop considerations

## Implement

### Problem 1 — `beginner`

**Prompt:** Wire Structures Workbench to run shared vectors across ≥5 structures and emit JSON timing summary.

**Acceptance criteria:**

- [ ] CLI documented
- [ ] Deterministic mode
- [ ] Output schema stable

### Problem 2 — `intermediate`

**Prompt:** Draft a code-review checklist (10 items) catching front-insert on vector, unbounded map growth, and missing capacity errors.

**Acceptance criteria:**

- [ ] Checklist actionable
- [ ] Examples per item
- [ ] Link to track notes

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Define metrics to validate structure choice post-launch per [[04-Data-Structures/14-Production-Selection/Measuring Structures in Production|Measuring Structures in Production]].

**Acceptance criteria:**

- [ ] ≥5 metrics with thresholds
- [ ] Sampling strategy
- [ ] False positive handling

### Problem 2 — `advanced`

**Prompt:** Build a spreadsheet model comparing memory + CPU cost for hash map vs B-tree index at 50M keys with given SLA.

**Acceptance criteria:**

- [ ] Inputs documented
- [ ] Break-even point
- [ ] Sensitivity analysis

## Debug Invariant

### Problem 1 — `intermediate`

**Prompt:** P99 latency regressed after "optimization" switching tree to hash without measuring ordered iteration need. Write postmortem template.

**Acceptance criteria:**

- [ ] Timeline
- [ ] Missing measurement identified
- [ ] Corrective actions

### Problem 2 — `advanced`

**Prompt:** Service A assumes list order; Service B uses set losing order. Define contract tests at boundary.

**Acceptance criteria:**

- [ ] Contract test examples
- [ ] Versioned API
- [ ] Rollback trigger

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Pick in-memory structures for an event aggregator (1M events/min, dedupe, top-K, TTL). Justify each choice with module links.

**Acceptance criteria:**

- [ ] Structure per concern
- [ ] Mermaid data flow
- [ ] Failure modes

### Problem 2 — `advanced`

**Prompt:** When do in-memory structures move to Redis/Postgres/Kafka? Use [[04-Data-Structures/14-Production-Selection/From In-Memory Structures to Systems|From In-Memory to Systems]].

**Acceptance criteria:**

- [ ] Boundary criteria
- [ ] Migration phases
- [ ] Ops ownership

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Contracts | Names operations only | States invariants, errors, and complexity assumptions |
| Implementation | Passes happy path | Shared vectors green; edge cases and debug checks |
| Production | Picks a structure by habit | Justifies layout, telemetry, migration, and rollback |

## Related Notes

- [[04-Data-Structures/code/README|code labs]]
- [[04-Data-Structures/_interview/Production Selection Interview.md|Production Selection Interview]]
- [[04-Data-Structures/README|Data Structures]]
- [[Career/README|Career]]

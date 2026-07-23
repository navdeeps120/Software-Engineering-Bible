---
title: Orientation Exercises
aliases: [Orientation Drills]
track: 08-Databases
topic: orientation-exercises
difficulty: beginner
status: active
prerequisites: ["[[08-Databases/README|Databases]]"]
tags: [exercises, databases, orientation]
created: 2026-07-22
updated: 2026-07-22
---

# Orientation Exercises

Separate files from engines from services, map relational/document/KV contracts, and reason about durability failure modes before touching storage internals.

## Linked Topic

- [[08-Databases/00-Orientation/Why Databases Exist|Why Databases Exist]]
- [[08-Databases/00-Orientation/Files vs Engines vs Services|Files vs Engines vs Services]]
- [[08-Databases/00-Orientation/Relational Document and KV Contracts|Relational Document and KV Contracts]]
- [[08-Databases/00-Orientation/Backend Databases and System Design Boundaries|Backend Databases and System Design Boundaries]]
- [[08-Databases/00-Orientation/Database Failure Modes Corruption and Durability|Database Failure Modes Corruption and Durability]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Draw a Mermaid diagram showing how a backend service, database engine, and OS filesystem relate. Label which layer owns connection pooling, WAL, and business validation.

**Hint:** Start from [[08-Databases/00-Orientation/Files vs Engines vs Services|Files vs Engines vs Services]].

**Acceptance criteria:**

- [ ] Three layers with call direction arrows
- [ ] Handoff to [[07-Backend/README|Backend]] for repository/transaction usage explicitly noted
- [ ] Cross-link to [[04-Data-Structures/README|Data Structures]] for B-tree pedagogy boundary

### Problem 2 — `intermediate`

**Prompt:** Compare relational, document, and key-value contracts for a product catalog. For each, name one query shape it excels at and one it punishes.

**Hint:** See [[08-Databases/00-Orientation/Relational Document and KV Contracts|Relational Document and KV Contracts]].

**Acceptance criteria:**

- [ ] Three engine families with access-path examples
- [ ] At least one join vs embed vs cache trade-off
- [ ] Table maps contract → symptom when misapplied

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[08-Databases/code/README|code labs]], scaffold a `engine-info` diagnostic that reports simulated page size, WAL mode, and durability level—without exposing connection secrets.

**Acceptance criteria:**

- [ ] Returns JSON with page size and durability label
- [ ] Config allowlist documented; no raw credential dump
- [ ] README cross-link added to code labs index

### Problem 2 — `intermediate`

**Prompt:** Implement a minimal in-memory "engine" wrapper around a JSON file: reads/writes go through an append-only log before mutating state. Demonstrate crash between log append and apply.

**Hint:** Foreshadow [[08-Databases/02-WAL-Durability-and-Recovery/Write-Ahead Logging Protocol|Write-Ahead Logging Protocol]].

**Acceptance criteria:**

- [ ] Log append precedes state mutation
- [ ] Recovery replay restores consistent state
- [ ] Unit test simulates crash mid-write

## Optimize

### Problem 1 — `intermediate`

**Prompt:** A team stores everything in flat files "for simplicity." Measure refactor cost: count direct file reads in app code, estimate migration to an engine with pages and WAL.

**Acceptance criteria:**

- [ ] Before/after architecture diagram
- [ ] Two measurable benefits (durability, concurrent access) with evidence
- [ ] Phased migration without big-bang cutover

### Problem 2 — `advanced`

**Prompt:** Evaluate using SQLite embedded vs managed PostgreSQL for a multi-tenant SaaS. Define a decision checklist covering durability, ops burden, and tenancy isolation.

**Hint:** Use [[08-Databases/00-Orientation/Backend Databases and System Design Boundaries|Backend Databases and System Design Boundaries]].

**Acceptance criteria:**

- [ ] Tenancy and backup requirements explicit
- [ ] Handoff to [[09-System-Design/07-Multi-Region-and-Geo/Multi-Region Active-Passive Active-Active Patterns|Multi-Region Active-Passive Active-Active Patterns]] for multi-region noted
- [ ] Rollback path if wrong engine chosen early

## Debug

### Problem 1 — `intermediate`

**Prompt:** On-call reports "data disappeared after restart." Write a debug brief distinguishing application bug, missing fsync, and corruption scenarios.

**Acceptance criteria:**

- [ ] Checklist separates app state from engine durability
- [ ] Three hypotheses with validation steps (WAL present? fsync policy?)
- [ ] Links to [[08-Databases/00-Orientation/Database Failure Modes Corruption and Durability|Database Failure Modes Corruption and Durability]]

### Problem 2 — `advanced`

**Prompt:** Two services write the same JSON file concurrently. Symptoms: torn writes and lost updates. Build a migration brief to enforce engine-boundary isolation.

**Acceptance criteria:**

- [ ] Root cause tied to missing engine serialization
- [ ] Phased cutover with dual-write risks named
- [ ] Success criteria for single-writer engine contract

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Leadership asks why database engineers need storage literacy if ORMs exist. Draft a one-page boundary doc: what Databases owns vs Backend vs System Design.

**Acceptance criteria:**

- [ ] Scope table with handoff links to [[07-Backend/README|Backend]] and [[09-System-Design/README|System Design]]
- [ ] Three concrete incident examples crossing boundaries
- [ ] Hiring bar bullets aligned with exercises

### Problem 2 — `advanced`

**Prompt:** Platform team proposes "Redis as primary store for all new features." Assess durability, modeling, and ops trade-offs; recommend defaults with escape hatches.

**Acceptance criteria:**

- [ ] Comparison of Redis vs PostgreSQL for authoritative data
- [ ] Non-negotiable durability checklist (AOF, fsync, backup)
- [ ] Mermaid adoption timeline with pilot criteria

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Boundaries | "Database = SQL" | Separates files, engines, services with handoffs |
| Contracts | One-size engine | Relational/document/KV matched to access paths |
| Production | Blames ORM | Failure-mode taxonomy, durability evidence, boundary RFC |

## Related Notes

- [[08-Databases/code/README|code labs]]
- [[08-Databases/_interview/Orientation Interview.md|Orientation Interview]]
- [[08-Databases/README|Databases]]
- [[Career/README|Career]]

---
title: Reference Architectures Exercises
aliases: [11 Reference Architectures Exercises]
track: 09-System-Design
topic: reference-architectures-exercises
difficulty: advanced
status: active
prerequisites: ["[[09-System-Design/_exercises/10-Observability-and-Control-Planes|Observability and Control Planes Exercises]]"]
tags: [exercises, system-design, reference-architectures, feed, chat, shortener]
created: 2026-07-23
updated: 2026-07-23
---

# Reference Architectures Exercises

Synthesize capacity, consistency, caching, messaging, and failure contracts into end-to-end designs: URL shortener, feed fan-out, chat/presence, search/notify/media/payments sketches, and read-heavy vs write-heavy matrices.

## Linked Topic

- [[09-System-Design/11-Reference-Architectures/URL Shortener Design End-to-End|URL Shortener Design End-to-End]]
- [[09-System-Design/11-Reference-Architectures/Feed Timeline Fan-out Push Pull Hybrid|Feed Timeline Fan-out Push Pull Hybrid]]
- [[09-System-Design/11-Reference-Architectures/Chat Presence Typing and Message Ordering|Chat Presence Typing and Message Ordering]]
- [[09-System-Design/11-Reference-Architectures/Search Notify Media and Payments Topology Sketches|Search Notify Media and Payments Topology Sketches]]
- [[09-System-Design/11-Reference-Architectures/Read-Heavy vs Write-Heavy Template Matrices|Read-Heavy vs Write-Heavy Template Matrices]]

## Progression

**Understand → Model → Design → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** For a URL shortener, list functional vs non-functional requirements and the core data model.

**Hint:** [[09-System-Design/11-Reference-Architectures/URL Shortener Design End-to-End|URL Shortener Design End-to-End]].

**Acceptance criteria:**

- [ ] NFRs with numbers or placeholders
- [ ] Key entities
- [ ] Read/write asymmetry noted

### Problem 2 — `intermediate`

**Prompt:** Explain push vs pull vs hybrid fan-out for feeds. When does celebrity write break push?

**Hint:** [[09-System-Design/11-Reference-Architectures/Feed Timeline Fan-out Push Pull Hybrid|Feed Timeline Fan-out Push Pull Hybrid]].

**Acceptance criteria:**

- [ ] Three strategies compared
- [ ] Celebrity problem
- [ ] Hybrid trigger criteria

### Problem 3 — `intermediate`

**Prompt:** What ordering and presence guarantees does chat need vs typing indicators? Separate must-have from best-effort.

**Hint:** [[09-System-Design/11-Reference-Architectures/Chat Presence Typing and Message Ordering|Chat Presence Typing and Message Ordering]].

**Acceptance criteria:**

- [ ] Guarantee matrix
- [ ] Ordering scope (channel)
- [ ] Presence TTLs

## Model

### Problem 1 — `beginner`

**Prompt:** Capacity-model a shortener: 100M new links/month, 10B redirects/month. Estimate storage and QPS peaks.

**Acceptance criteria:**

- [ ] Storage with retention
- [ ] Peak redirect QPS
- [ ] Cache hit rate assumption impact

### Problem 2 — `intermediate`

**Prompt:** Model feed fan-out cost for 1M DAU, avg 200 followers, 2 posts/user/day. Compare push write amplification vs pull read cost.

**Acceptance criteria:**

- [ ] Push write volume
- [ ] Pull read volume at peak
- [ ] Break-even intuition

### Problem 3 — `advanced`

**Prompt:** Using [[09-System-Design/11-Reference-Architectures/Read-Heavy vs Write-Heavy Template Matrices|Read-Heavy vs Write-Heavy Template Matrices]], classify search, notifications, media upload, and payments. Fill template cells.

**Acceptance criteria:**

- [ ] Classification justified
- [ ] Template cells filled (cache, consistency, async)
- [ ] Cross-link to relevant modules

## Design

### Problem 1 — `intermediate`

**Prompt:** Design end-to-end URL shortener: ID generation, storage, cache, redirects, analytics async path, and abuse controls.

**Acceptance criteria:**

- [ ] Mermaid topology
- [ ] ID uniqueness strategy
- [ ] Analytics lag acceptable
- [ ] ADR for ID generation

### Problem 2 — `intermediate`

**Prompt:** Design hybrid feed for normal + celebrity accounts. Include timeline storage and fan-out workers.

**Acceptance criteria:**

- [ ] Hybrid decision rules
- [ ] Worker backpressure
- [ ] Read path latency budget

### Problem 3 — `advanced`

**Prompt:** Sketch topologies for search indexing, push notifications, media processing, and payments settlement—each one page with consistency and failure notes.

**Hint:** [[09-System-Design/11-Reference-Architectures/Search Notify Media and Payments Topology Sketches|Search Notify Media and Payments Topology Sketches]].

**Acceptance criteria:**

- [ ] Four sketches
- [ ] Consistency class each
- [ ] One critical failure mode each

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Redirect cache miss storm hits the shortener DB. Design protection without breaking redirects SLO for popular keys.

**Acceptance criteria:**

- [ ] Stampede controls
- [ ] Admission for new keys
- [ ] Stale-serve policy

### Problem 2 — `advanced`

**Prompt:** Chat partition loses ordering guarantees temporarily. Design client UX and server repair for out-of-order delivery.

**Acceptance criteria:**

- [ ] Client buffering/reorder
- [ ] Server sequence numbers
- [ ] Presence degradation

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Produce an interview-ready design doc for one reference system (choose shortener or feed) with capacity, topology, consistency, and failure sections.

**Acceptance criteria:**

- [ ] Doc structure complete
- [ ] Numbers and diagrams
- [ ] Explicit non-goals

### Problem 2 — `advanced`

**Prompt:** Create a reusable "design interview checklist" from the read/write template matrix for future sessions.

**Acceptance criteria:**

- [ ] Checklist ≤1 page
- [ ] Maps to track modules
- [ ] Used once on a practice prompt

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Synthesis | Isolated patterns | End-to-end with budgets |
| Fan-out | Push only | Hybrid with celebrity plan |
| Docs | Boxes only | Capacity + consistency + failure |

## Related Notes

- [[09-System-Design/_interview/11-Reference-Architectures|Reference Architectures Interview]]
- [[09-System-Design/README|System Design]]
- [[Career/README|Career]]

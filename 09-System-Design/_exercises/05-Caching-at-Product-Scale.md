---
title: Caching at Product Scale Exercises
aliases: [05 Caching Exercises]
track: 09-System-Design
topic: caching-at-product-scale-exercises
difficulty: intermediate
status: active
prerequisites: ["[[09-System-Design/_exercises/04-Partitioning-Sharding-and-Placement|Partitioning Sharding and Placement Exercises]]"]
tags: [exercises, system-design, caching, stampede, invalidation]
created: 2026-07-23
updated: 2026-07-23
---

# Caching at Product Scale Exercises

Compose CDN/edge/regional/app cache hierarchies, choose invalidation strategies, defeat hot-key stampedes, negotiate staleness vs coherence, and preserve read-your-writes across regions.

## Linked Topic

- [[09-System-Design/05-Caching-at-Product-Scale/Cache Hierarchies CDN Edge Regional App|Cache Hierarchies CDN Edge Regional App]]
- [[09-System-Design/05-Caching-at-Product-Scale/Invalidation Strategies TTL Write-Through Write-Back|Invalidation Strategies TTL Write-Through Write-Back]]
- [[09-System-Design/05-Caching-at-Product-Scale/Hot Keys Stampede and Thundering Herd at Scale|Hot Keys Stampede and Thundering Herd at Scale]]
- [[09-System-Design/05-Caching-at-Product-Scale/Cache Coherence vs Acceptable Staleness|Cache Coherence vs Acceptable Staleness]]
- [[09-System-Design/05-Caching-at-Product-Scale/When Caching Lies Read-Your-Writes Cross-Region|When Caching Lies Read-Your-Writes Cross-Region]]

## Progression

**Understand → Model → Design → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Place CDN, edge, regional, and app caches on a Mermaid path for a media-heavy homepage. What does each layer optimize?

**Hint:** [[09-System-Design/05-Caching-at-Product-Scale/Cache Hierarchies CDN Edge Regional App|Cache Hierarchies CDN Edge Regional App]].

**Acceptance criteria:**

- [ ] Four layers labeled
- [ ] Hit/miss path arrows
- [ ] Handoff to Backend cache-aside noted

### Problem 2 — `intermediate`

**Prompt:** Compare TTL, write-through, write-back, and explicit invalidation. One failure mode each.

**Acceptance criteria:**

- [ ] Strategy table
- [ ] Failure mode per strategy
- [ ] Link to [[09-System-Design/05-Caching-at-Product-Scale/Invalidation Strategies TTL Write-Through Write-Back|Invalidation Strategies TTL Write-Through Write-Back]]

### Problem 3 — `intermediate`

**Prompt:** Define stampede/thundering herd. Why does "just increase TTL" not fix hot keys?

**Hint:** [[09-System-Design/05-Caching-at-Product-Scale/Hot Keys Stampede and Thundering Herd at Scale|Hot Keys Stampede and Thundering Herd at Scale]].

**Acceptance criteria:**

- [ ] Mechanism of concurrent miss
- [ ] Hot key vs stampede distinction
- [ ] Mitigation categories listed

## Model

### Problem 1 — `beginner`

**Prompt:** Model hit rate impact: backend QPS = client QPS × (1 − hit_rate). For 100k RPS and 95% hit rate, size origin.

**Acceptance criteria:**

- [ ] Origin QPS computed
- [ ] Sensitivity if hit rate drops to 80%
- [ ] Capacity headroom note

### Problem 2 — `intermediate`

**Prompt:** Model acceptable staleness for product price vs like counts. Express as time budgets and UX rules.

**Hint:** [[09-System-Design/05-Caching-at-Product-Scale/Cache Coherence vs Acceptable Staleness|Cache Coherence vs Acceptable Staleness]].

**Acceptance criteria:**

- [ ] Per-field staleness budgets
- [ ] Business risk if exceeded
- [ ] Measurement idea

### Problem 3 — `advanced`

**Prompt:** Model cross-region cache: user writes in US, reads from EU edge. Quantify RY W violation window under async replication.

**Hint:** [[09-System-Design/05-Caching-at-Product-Scale/When Caching Lies Read-Your-Writes Cross-Region|When Caching Lies Read-Your-Writes Cross-Region]].

**Acceptance criteria:**

- [ ] Violation scenario
- [ ] Window estimate assumptions
- [ ] Mitigation options (sticky, version, purge)

## Design

### Problem 1 — `intermediate`

**Prompt:** Design invalidation for a product catalog update that must appear within 5 seconds globally for logged-in users, 60 seconds for anonymous.

**Acceptance criteria:**

- [ ] Dual-path policy
- [ ] Purge/fan-out mechanism sketch
- [ ] Failure if purge delayed

### Problem 2 — `intermediate`

**Prompt:** Design stampede protection for a viral key: singleflight, probabilistic early expire, and replica request coalescing—pick and justify.

**Acceptance criteria:**

- [ ] Chosen pattern with rationale
- [ ] Still-hot-key overflow plan (shard key / local compute)
- [ ] Metrics for coalesce rate

### Problem 3 — `advanced`

**Prompt:** Design session-aware caching so a writer always sees fresh data without disabling CDN for everyone.

**Acceptance criteria:**

- [ ] Bypass/version token strategy
- [ ] Cache key design
- [ ] Abuse risk (cache fragmentation)

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Cache cluster dies. What is blast radius? Design degradation that protects origin from 20× traffic.

**Acceptance criteria:**

- [ ] Admission / shed / stale-serve policy
- [ ] Origin protection numbers
- [ ] Rebuild warmup plan

### Problem 2 — `advanced`

**Prompt:** Negative caching caches 404s; a key is later created. Users keep seeing 404. Design prevention and repair.

**Acceptance criteria:**

- [ ] Negative TTL policy
- [ ] Create-path invalidation
- [ ] Incident detection signal

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Write a cache incident runbook: hit rate cliff, origin saturation, and purge mistakes.

**Acceptance criteria:**

- [ ] Triage order
- [ ] Safe purge practices
- [ ] Postmortem questions

### Problem 2 — `advanced`

**Prompt:** Propose org standards for "when you may add a cache" including consistency contract and ownership of invalidation.

**Acceptance criteria:**

- [ ] Gate checklist
- [ ] Ownership matrix
- [ ] Link to Backend cache-aside patterns

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Hierarchy | One Redis | Layered CDN→app with roles |
| Staleness | Ignore | Budgets per data class |
| Stampede | Bigger box | Coalescing + hot-key strategy |

## Related Notes

- [[09-System-Design/_interview/05-Caching-at-Product-Scale|Caching Interview]]
- [[09-System-Design/README|System Design]]
- [[07-Backend/_exercises/Caching Jobs and Messaging Exercises|Backend Caching Exercises]]
- [[Career/README|Career]]

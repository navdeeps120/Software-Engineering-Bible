---
title: Partitioning Sharding and Placement Exercises
aliases: [04 Partitioning Exercises]
track: 09-System-Design
topic: partitioning-sharding-and-placement-exercises
difficulty: intermediate
status: active
prerequisites: ["[[09-System-Design/_exercises/03-Consistency-Models-and-CAP|Consistency Models and CAP Exercises]]"]
tags: [exercises, system-design, partitioning, sharding, hotspots]
created: 2026-07-23
updated: 2026-07-23
---

# Partitioning Sharding and Placement Exercises

Choose partition keys that resist skew, compare range/hash/directory sharding, plan resharding dual-write windows, place data for locality, and design secondary indexes across partitions.

## Linked Topic

- [[09-System-Design/04-Partitioning-Sharding-and-Placement/Partition Keys Hotspots and Skew|Partition Keys Hotspots and Skew]]
- [[09-System-Design/04-Partitioning-Sharding-and-Placement/Range Hash and Directory-Based Sharding|Range Hash and Directory-Based Sharding]]
- [[09-System-Design/04-Partitioning-Sharding-and-Placement/Resharding Rebalancing and Dual-Write Windows|Resharding Rebalancing and Dual-Write Windows]]
- [[09-System-Design/04-Partitioning-Sharding-and-Placement/Data Locality Geo Placement and Affinity|Data Locality Geo Placement and Affinity]]
- [[09-System-Design/04-Partitioning-Sharding-and-Placement/Secondary Indexes Across Partitions|Secondary Indexes Across Partitions]]

## Progression

**Understand → Model → Design → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Why is `user_id` often a good shard key and `created_at` often a bad one for write-heavy workloads?

**Hint:** [[09-System-Design/04-Partitioning-Sharding-and-Placement/Partition Keys Hotspots and Skew|Partition Keys Hotspots and Skew]].

**Acceptance criteria:**

- [ ] Hotspot mechanism explained
- [ ] Query vs write trade-off
- [ ] Counterexample when time-based is acceptable

### Problem 2 — `intermediate`

**Prompt:** Compare range, hash, and directory-based sharding. Name one query pattern each favors.

**Acceptance criteria:**

- [ ] Three strategies with mechanics
- [ ] Favor/punish table
- [ ] Link to [[09-System-Design/04-Partitioning-Sharding-and-Placement/Range Hash and Directory-Based Sharding|Range Hash and Directory-Based Sharding]]

### Problem 3 — `intermediate`

**Prompt:** Explain why secondary indexes become a distributed systems problem once you shard.

**Hint:** [[09-System-Design/04-Partitioning-Sharding-and-Placement/Secondary Indexes Across Partitions|Secondary Indexes Across Partitions]].

**Acceptance criteria:**

- [ ] Local vs global index
- [ ] Consistency lag risk
- [ ] Scatter-gather cost

## Model

### Problem 1 — `beginner`

**Prompt:** Model skew: 10 shards, celebrity accounts produce 40% of reads. Estimate load on hottest shard vs average.

**Acceptance criteria:**

- [ ] Numeric imbalance
- [ ] Hot-key mitigation options listed
- [ ] Measurement approach

### Problem 2 — `intermediate`

**Prompt:** Model a reshard from 8→16 shards with dual-write window of 2 hours. What must be true for cutover safety?

**Hint:** [[09-System-Design/04-Partitioning-Sharding-and-Placement/Resharding Rebalancing and Dual-Write Windows|Resharding Rebalancing and Dual-Write Windows]].

**Acceptance criteria:**

- [ ] Dual-write invariants
- [ ] Lag/backfill completion criteria
- [ ] Abort conditions

### Problem 3 — `advanced`

**Prompt:** Model geo placement: EU users' PII must stay in-region; analytics is global. Express affinity constraints and query implications.

**Hint:** [[09-System-Design/04-Partitioning-Sharding-and-Placement/Data Locality Geo Placement and Affinity|Data Locality Geo Placement and Affinity]].

**Acceptance criteria:**

- [ ] Placement rules
- [ ] Cross-region query policy
- [ ] Compliance vs latency conflict

## Design

### Problem 1 — `intermediate`

**Prompt:** Design shard key and routing for a multi-tenant SaaS where large tenants must be isolatable.

**Acceptance criteria:**

- [ ] Tenant-aware keying
- [ ] Large-tenant dedicated shard option
- [ ] Cross-tenant query path (or intentional absence)

### Problem 2 — `intermediate`

**Prompt:** Design global secondary index strategy for "find orders by email" when orders are sharded by `order_id`.

**Acceptance criteria:**

- [ ] Index ownership and update path
- [ ] Staleness contract
- [ ] Failure/rebuild plan

### Problem 3 — `advanced`

**Prompt:** Design a hotspot clinic: detect hot partitions, split keys (salting/buckets), and migrate without downtime.

**Acceptance criteria:**

- [ ] Detection signals
- [ ] Split algorithm
- [ ] Dual-read/dual-write migration steps

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** One shard's disk fills. How do you prevent the whole product from looking "down"? Design partial availability.

**Acceptance criteria:**

- [ ] Error surfaces per keyspace
- [ ] Admission control for hot shard
- [ ] Comms for affected cohort

### Problem 2 — `advanced`

**Prompt:** Dual-write divergence during reshard: primary and target disagree. Design reconciliation and customer impact assessment.

**Acceptance criteria:**

- [ ] Diff tooling approach
- [ ] Source of truth rule
- [ ] Rollback vs forward-fix decision

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Write a resharding playbook with owners, dashboards, freeze windows, and customer notification criteria.

**Acceptance criteria:**

- [ ] Timeline with freeze
- [ ] Go/no-go checklist
- [ ] Post-cutover validation queries

### Problem 2 — `advanced`

**Prompt:** Use [[09-System-Design/projects/Shard Router and Hotspot Clinic/README|Shard Router and Hotspot Clinic]] (or equivalent) to demonstrate skew and a mitigation; document as portfolio evidence.

**Acceptance criteria:**

- [ ] Reproducible skew demo
- [ ] Mitigation measured
- [ ] ADR linking key choice

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Keys | Popular defaults | Skew-aware with measurement |
| Reshard | Big-bang move | Dual-write windows and abort criteria |
| Indexes | Ignore | Local/global trade-offs explicit |

## Related Notes

- [[09-System-Design/_interview/04-Partitioning-Sharding-and-Placement|Partitioning Interview]]
- [[09-System-Design/projects/Shard Router and Hotspot Clinic/README|Shard Router and Hotspot Clinic]]
- [[09-System-Design/README|System Design]]
- [[Career/README|Career]]

---
title: Multi-Region and Geo Exercises
aliases: [07 Multi-Region Exercises]
track: 09-System-Design
topic: multi-region-and-geo-exercises
difficulty: advanced
status: active
prerequisites: ["[[09-System-Design/_exercises/06-Messaging-Streams-and-Async-Topologies|Messaging Streams and Async Topologies Exercises]]"]
tags: [exercises, system-design, multi-region, rpo, rto, geo]
created: 2026-07-23
updated: 2026-07-23
---

# Multi-Region and Geo Exercises

Choose single-primary vs multi-primary product views, treat sync modes as latency SLOs, design active-passive/active-active, define RPO/RTO and split-brain policy, and budget replica lag as user-facing consistency.

## Linked Topic

- [[09-System-Design/07-Multi-Region-and-Geo/Single-Primary Multi-Primary and Leaderless Product Views|Single-Primary Multi-Primary and Leaderless Product Views]]
- [[09-System-Design/07-Multi-Region-and-Geo/Sync Async and Semi-Sync as Latency SLOs|Sync Async and Semi-Sync as Latency SLOs]]
- [[09-System-Design/07-Multi-Region-and-Geo/Multi-Region Active-Passive Active-Active Patterns|Multi-Region Active-Passive Active-Active Patterns]]
- [[09-System-Design/07-Multi-Region-and-Geo/Failover RPO RTO and Split-Brain Product Policy|Failover RPO RTO and Split-Brain Product Policy]]
- [[09-System-Design/07-Multi-Region-and-Geo/Replica Lag as User-Facing Consistency Budget|Replica Lag as User-Facing Consistency Budget]]

## Progression

**Understand → Model → Design → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Contrast single-primary, multi-primary, and leaderless from a *product* perspective (who accepts writes, conflict risk).

**Hint:** [[09-System-Design/07-Multi-Region-and-Geo/Single-Primary Multi-Primary and Leaderless Product Views|Single-Primary Multi-Primary and Leaderless Product Views]].

**Acceptance criteria:**

- [ ] Write ownership clear
- [ ] Conflict surface named
- [ ] Not engine-internals focused

### Problem 2 — `intermediate`

**Prompt:** Explain sync, async, and semi-sync replication as latency and durability SLOs—not database features.

**Acceptance criteria:**

- [ ] Latency vs RPO trade-off table
- [ ] User-visible meaning of each
- [ ] Link to [[09-System-Design/07-Multi-Region-and-Geo/Sync Async and Semi-Sync as Latency SLOs|Sync Async and Semi-Sync as Latency SLOs]]

### Problem 3 — `intermediate`

**Prompt:** Define RPO and RTO for a payments ledger vs a social feed. Why do the budgets differ?

**Hint:** [[09-System-Design/07-Multi-Region-and-Geo/Failover RPO RTO and Split-Brain Product Policy|Failover RPO RTO and Split-Brain Product Policy]].

**Acceptance criteria:**

- [ ] Numeric example budgets
- [ ] Business justification
- [ ] Split-brain policy sketch for each

## Model

### Problem 1 — `beginner`

**Prompt:** Model cross-region RTT 120 ms. Cost a synchronous cross-region write in p99 budget for a 200 ms API SLO.

**Acceptance criteria:**

- [ ] Budget arithmetic
- [ ] When sync is infeasible
- [ ] Alternative (regional primary)

### Problem 2 — `intermediate`

**Prompt:** Model active-active reads with async replication lag p99 = 2 s. Express as user-facing consistency budget.

**Hint:** [[09-System-Design/07-Multi-Region-and-Geo/Replica Lag as User-Facing Consistency Budget|Replica Lag as User-Facing Consistency Budget]].

**Acceptance criteria:**

- [ ] Stale-read scenarios
- [ ] Features that must stick to primary region
- [ ] UX copy for lag

### Problem 3 — `advanced`

**Prompt:** Model split-brain: two regions accept writes for 3 minutes. Estimate conflict volume for 500 writes/s and propose product policy.

**Acceptance criteria:**

- [ ] Conflict volume estimate
- [ ] Accept/reject/merge policy
- [ ] Customer communication plan

## Design

### Problem 1 — `intermediate`

**Prompt:** Design active-passive for a SaaS control plane with RPO ≤ 30 s and RTO ≤ 15 min. Include health, promote, and DNS/steering steps.

**Hint:** [[09-System-Design/07-Multi-Region-and-Geo/Multi-Region Active-Passive Active-Active Patterns|Multi-Region Active-Passive Active-Active Patterns]].

**Acceptance criteria:**

- [ ] Failover sequence diagram
- [ ] Data loss acceptance criteria
- [ ] Failback policy

### Problem 2 — `intermediate`

**Prompt:** Design sticky regional affinity for users with optional failover. Preserve read-your-writes where required.

**Acceptance criteria:**

- [ ] Affinity mechanism
- [ ] Failover exception path
- [ ] Consistency exceptions documented

### Problem 3 — `advanced`

**Prompt:** Design active-active for presence/status (AP-friendly) while keeping billing single-primary. Draw domain split.

**Acceptance criteria:**

- [ ] Domain consistency matrix
- [ ] Cross-domain interaction risks
- [ ] ADR outline

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Primary region fails. Walk promote decision when lag is 45 s vs RPO 30 s. What do you tell customers?

**Acceptance criteria:**

- [ ] Promote vs wait decision
- [ ] Data loss disclosure
- [ ] Partial feature freeze option

### Problem 2 — `advanced`

**Prompt:** Network partition causes dual primary. Design fencing so only one side accepts critical writes.

**Acceptance criteria:**

- [ ] Fencing/lease approach
- [ ] Product-critical vs AP path split
- [ ] Link forward to coordination module

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Write a multi-region game-day plan: inject region loss, measure RTO, validate RPO, and capture gaps.

**Acceptance criteria:**

- [ ] Scenario script
- [ ] Success metrics
- [ ] Blameless follow-ups

### Problem 2 — `advanced`

**Prompt:** Use [[09-System-Design/projects/Multi-Region Failover Playbook Lab/README|Multi-Region Failover Playbook Lab]] (or equivalent) to encode RPO/RTO policy as a reviewed artifact.

**Acceptance criteria:**

- [ ] Policy document with numbers
- [ ] Linked ADR
- [ ] On-call checklist attached

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Topology | Multi-region = HA | Write ownership and conflict policy |
| RPO/RTO | Vague "fast failover" | Numeric budgets and disclosures |
| Lag | Ignore | User-facing consistency budget |

## Related Notes

- [[09-System-Design/_interview/07-Multi-Region-and-Geo|Multi-Region Interview]]
- [[09-System-Design/projects/Multi-Region Failover Playbook Lab/README|Multi-Region Failover Playbook Lab]]
- [[09-System-Design/README|System Design]]
- [[Career/README|Career]]

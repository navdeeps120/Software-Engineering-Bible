---
title: Load Balancing and Edge Entry Exercises
aliases: [02 Edge LB Exercises]
track: 09-System-Design
topic: load-balancing-and-edge-entry-exercises
difficulty: intermediate
status: active
prerequisites: ["[[09-System-Design/_exercises/01-Capacity-Latency-and-Bottlenecks|Capacity Latency and Bottlenecks Exercises]]"]
tags: [exercises, system-design, load-balancing, edge, gateway]
created: 2026-07-23
updated: 2026-07-23
---

# Load Balancing and Edge Entry Exercises

Design L4/L7 roles, choose LB algorithms, define health/drain contracts, place gateway vs mesh concerns, and steer global traffic with admission control.

## Linked Topic

- [[09-System-Design/02-Load-Balancing-and-Edge-Entry/Load Balancer Roles L4 vs L7|Load Balancer Roles L4 vs L7]]
- [[09-System-Design/02-Load-Balancing-and-Edge-Entry/Algorithms Round Robin Least Conn Consistent Hash|Algorithms Round Robin Least Conn Consistent Hash]]
- [[09-System-Design/02-Load-Balancing-and-Edge-Entry/Health Checks Drain and Connection Management|Health Checks Drain and Connection Management]]
- [[09-System-Design/02-Load-Balancing-and-Edge-Entry/API Gateway vs Reverse Proxy vs Service Mesh Concepts|API Gateway vs Reverse Proxy vs Service Mesh Concepts]]
- [[09-System-Design/02-Load-Balancing-and-Edge-Entry/Edge Admission Control and Global Traffic Steering|Edge Admission Control and Global Traffic Steering]]

## Progression

**Understand → Model → Design → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Contrast L4 vs L7 load balancing for HTTP APIs and WebSockets. When is L4 enough?

**Hint:** [[09-System-Design/02-Load-Balancing-and-Edge-Entry/Load Balancer Roles L4 vs L7|Load Balancer Roles L4 vs L7]].

**Acceptance criteria:**

- [ ] Termination and header awareness explained
- [ ] WebSocket affinity implications
- [ ] Cost/complexity trade-off

### Problem 2 — `intermediate`

**Prompt:** Explain round robin, least connections, and consistent hashing. Give one workload each is wrong for.

**Acceptance criteria:**

- [ ] Algorithm mechanics in 2–3 sentences each
- [ ] Failure mode per algorithm
- [ ] Link to [[09-System-Design/02-Load-Balancing-and-Edge-Entry/Algorithms Round Robin Least Conn Consistent Hash|Algorithms Round Robin Least Conn Consistent Hash]]

### Problem 3 — `intermediate`

**Prompt:** Distinguish API gateway, reverse proxy, and service mesh by *concern ownership*, not vendor names.

**Acceptance criteria:**

- [ ] Auth, routing, mTLS, retries placement table
- [ ] Anti-pattern: all concerns at every hop
- [ ] Handoff to Backend middleware noted

## Model

### Problem 1 — `beginner`

**Prompt:** Model connection churn for 50k concurrent WebSockets behind an LB. Estimate connection table and drain time constraints.

**Acceptance criteria:**

- [ ] Concurrent connection estimate
- [ ] Drain timeout vs client reconnect storm
- [ ] Health check interval vs false unhealthy

### Problem 2 — `intermediate`

**Prompt:** Model sticky sessions vs consistent hashing for a stateful game lobby. Quantify remapping impact when one node dies.

**Acceptance criteria:**

- [ ] Remap fraction estimated (virtual nodes intuition)
- [ ] User-visible disruption named
- [ ] Preference justified

### Problem 3 — `advanced`

**Prompt:** Model global traffic steering: two regions, latency map, and capacity caps. Define policy when one region is at 90% utilization.

**Hint:** [[09-System-Design/02-Load-Balancing-and-Edge-Entry/Edge Admission Control and Global Traffic Steering|Edge Admission Control and Global Traffic Steering]].

**Acceptance criteria:**

- [ ] Steering rules with capacity override
- [ ] Admission reject behavior defined
- [ ] Split-brain risk if DNS TTL long

## Design

### Problem 1 — `intermediate`

**Prompt:** Design health check and drain for a rolling deploy of 20 API pods. Include readiness vs liveness and in-flight request handling.

**Hint:** [[09-System-Design/02-Load-Balancing-and-Edge-Entry/Health Checks Drain and Connection Management|Health Checks Drain and Connection Management]].

**Acceptance criteria:**

- [ ] Sequence diagram: drain → no new → complete → terminate
- [ ] Failure if liveness used as readiness
- [ ] Timeout numbers justified

### Problem 2 — `intermediate`

**Prompt:** Place rate limiting, auth, and request routing across edge CDN, gateway, and service. Justify each placement.

**Acceptance criteria:**

- [ ] Placement table with blast-radius rationale
- [ ] Duplicate enforcement called out where intentional
- [ ] Link to Backend for in-process limits

### Problem 3 — `advanced`

**Prompt:** Design an edge admission controller for flash-sale traffic: queue, reject, or shed features. Tie to error budget.

**Acceptance criteria:**

- [ ] Policy for fair vs VIP traffic
- [ ] User messaging and retry-after
- [ ] Metrics for queue depth and reject rate

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Half the backends fail health checks due to a bad deploy. Describe LB behavior and how to prevent thundering herd on remaining nodes.

**Acceptance criteria:**

- [ ] Cascade risk described
- [ ] Circuit / capacity floor / max remove %
- [ ] Rollback + drain coordination

### Problem 2 — `advanced`

**Prompt:** Global Anycast steers Europe traffic to US during a regional outage. What breaks for latency and data locality? Design a safer failover policy.

**Acceptance criteria:**

- [ ] Latency and consistency impacts
- [ ] Staged failover vs hard flip
- [ ] Cross-link to multi-region module

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Write a runbook: "LB 5xx spike during deploy." Include dashboards, drain checks, and abort criteria.

**Acceptance criteria:**

- [ ] Ordered triage steps
- [ ] Abort/rollback criteria numeric
- [ ] Post-incident capacity note

### Problem 2 — `advanced`

**Prompt:** Platform proposes mesh everywhere. Assess when mesh helps vs when a simpler gateway suffices for 15 services.

**Acceptance criteria:**

- [ ] Decision criteria (mTLS, retries, observability)
- [ ] Cost and failure complexity
- [ ] Phased adoption recommendation

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| LB choice | Vendor default | Algorithm and layer matched to workload |
| Health/drain | Ping only | Readiness, drain, connection lifecycle |
| Edge | Single choke point | Admission + steering with capacity overrides |

## Related Notes

- [[09-System-Design/_interview/02-Load-Balancing-and-Edge-Entry|Edge LB Interview]]
- [[09-System-Design/projects/Load Balancer From Scratch/README|Load Balancer From Scratch]]
- [[09-System-Design/README|System Design]]
- [[Career/README|Career]]

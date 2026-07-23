---
title: Failure Modes at Product Scale Exercises
aliases: [09 Failure Modes Exercises]
track: 09-System-Design
topic: failure-modes-at-product-scale-exercises
difficulty: advanced
status: active
prerequisites: ["[[09-System-Design/_exercises/08-Coordination-Consensus-and-Locks|Coordination Consensus and Locks Exercises]]"]
tags: [exercises, system-design, failure, cascade, bulkheads, chaos]
created: 2026-07-23
updated: 2026-07-23
---

# Failure Modes at Product Scale Exercises

Analyze cascading multi-service failure, design zone/fleet bulkheads, plan graceful degradation and feature shedding, scope chaos blast radius, and write multi-service incident playbooks.

## Linked Topic

- [[09-System-Design/09-Failure-Modes-at-Product-Scale/Cascading Multi-Service Failure|Cascading Multi-Service Failure]]
- [[09-System-Design/09-Failure-Modes-at-Product-Scale/Zone and Fleet Bulkheads|Zone and Fleet Bulkheads]]
- [[09-System-Design/09-Failure-Modes-at-Product-Scale/Graceful Degradation and Feature Shedding|Graceful Degradation and Feature Shedding]]
- [[09-System-Design/09-Failure-Modes-at-Product-Scale/Chaos Blast Radius and Dependency Failure|Chaos Blast Radius and Dependency Failure]]
- [[09-System-Design/09-Failure-Modes-at-Product-Scale/Multi-Service Incident Playbooks|Multi-Service Incident Playbooks]]

## Progression

**Understand → Model → Design → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Describe a cascade: dependency latency → thread pool exhaustion → upstream timeouts → retry storm. Mark each amplification step.

**Hint:** [[09-System-Design/09-Failure-Modes-at-Product-Scale/Cascading Multi-Service Failure|Cascading Multi-Service Failure]].

**Acceptance criteria:**

- [ ] Amplification diagram
- [ ] Where Backend circuit breakers help
- [ ] Where topology bulkheads are required

### Problem 2 — `intermediate`

**Prompt:** Define bulkheads at process, zone, and fleet levels. Give one failure each level contains.

**Hint:** [[09-System-Design/09-Failure-Modes-at-Product-Scale/Zone and Fleet Bulkheads|Zone and Fleet Bulkheads]].

**Acceptance criteria:**

- [ ] Three levels with examples
- [ ] Shared fate anti-patterns
- [ ] Cost of isolation noted

### Problem 3 — `intermediate`

**Prompt:** Contrast graceful degradation vs hard fail for search, checkout, and auth. Which must fail closed?

**Acceptance criteria:**

- [ ] Per-feature policy
- [ ] Security-sensitive fail-closed justified
- [ ] Link to [[09-System-Design/09-Failure-Modes-at-Product-Scale/Graceful Degradation and Feature Shedding|Graceful Degradation and Feature Shedding]]

## Model

### Problem 1 — `beginner`

**Prompt:** Model retry amplification: 3 services, each retries 3× on timeout. Estimate worst-case multiplier to the leaf.

**Acceptance criteria:**

- [ ] Multiplier computed
- [ ] Jitter/budgeting mitigations
- [ ] Idempotency requirement

### Problem 2 — `intermediate`

**Prompt:** Model blast radius for killing one AZ with and without zone-aware routing. Express % of capacity lost.

**Hint:** [[09-System-Design/09-Failure-Modes-at-Product-Scale/Chaos Blast Radius and Dependency Failure|Chaos Blast Radius and Dependency Failure]].

**Acceptance criteria:**

- [ ] Capacity math
- [ ] Imbalance risk after AZ loss
- [ ] Headroom requirement

### Problem 3 — `advanced`

**Prompt:** Model feature shedding ladder under CPU pressure: which features drop first, and what SLIs still hold?

**Acceptance criteria:**

- [ ] Ordered shed list
- [ ] Protected critical path
- [ ] User messaging plan

## Design

### Problem 1 — `intermediate`

**Prompt:** Design dependency isolation for a homepage that calls 8 backends. Include timeouts, bulkheads, and stale fallbacks.

**Acceptance criteria:**

- [ ] Per-dependency budget
- [ ] Partial page render strategy
- [ ] Critical vs optional calls labeled

### Problem 2 — `intermediate`

**Prompt:** Design a multi-service incident playbook template: roles, severity, comms, and rollback ownership.

**Hint:** [[09-System-Design/09-Failure-Modes-at-Product-Scale/Multi-Service Incident Playbooks|Multi-Service Incident Playbooks]].

**Acceptance criteria:**

- [ ] RACI-style roles
- [ ] Severity matrix
- [ ] Cross-team escalation path

### Problem 3 — `advanced`

**Prompt:** Design chaos experiments that prove bulkheads without endangering revenue week. Include abort criteria.

**Acceptance criteria:**

- [ ] Experiment catalog
- [ ] Blast-radius caps
- [ ] Abort metrics

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Auth service is slow (not down). Show how "retry harder" destroys the fleet. Design the correct response.

**Acceptance criteria:**

- [ ] Cascade path
- [ ] Shed non-auth features vs fail closed login
- [ ] Load shedding at edge

### Problem 2 — `advanced`

**Prompt:** A shared library deadlock ships to 40 services. Design containment when you cannot roll all back instantly.

**Acceptance criteria:**

- [ ] Blast radius containment
- [ ] Feature flags / config kill switches
- [ ] Staged rollback plan

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Facilitate a game day: dependency failure of payments. Capture what degraded, what incorrectly failed hard, and backlog items.

**Acceptance criteria:**

- [ ] Scenario + timeline
- [ ] Findings list
- [ ] Owners assigned

### Problem 2 — `advanced`

**Prompt:** Define org error-budget policy for multi-service products: when to freeze features vs page only one service.

**Acceptance criteria:**

- [ ] Budget ownership model
- [ ] Freeze criteria
- [ ] Link to observability SLOs module

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Cascades | Blame one service | Amplification and retries modeled |
| Bulkheads | Single cluster HA | Zone/fleet isolation |
| Incidents | Heroics | Playbooks, roles, shed ladders |

## Related Notes

- [[09-System-Design/_interview/09-Failure-Modes-at-Product-Scale|Failure Modes Interview]]
- [[09-System-Design/README|System Design]]
- [[07-Backend/06-Reliability-and-Abuse-Resistance/Circuit Breakers and Bulkheads|Circuit Breakers and Bulkheads]]
- [[Career/README|Career]]

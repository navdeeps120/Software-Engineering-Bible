---
title: Orientation and Boundaries Exercises
aliases: [00 Orientation Exercises]
track: 09-System-Design
topic: orientation-and-boundaries-exercises
difficulty: beginner
status: active
prerequisites: ["[[09-System-Design/README|System Design]]"]
tags: [exercises, system-design, orientation, adr, nfr]
created: 2026-07-23
updated: 2026-07-23
---

# Orientation and Boundaries Exercises

Separate System Design from Backend and Databases, model NFRs and blast-radius budgets, and practice ADR discipline before drawing distributed topologies.

## Linked Topic

- [[09-System-Design/00-Orientation-and-Boundaries/Why System Design Exists|Why System Design Exists]]
- [[09-System-Design/00-Orientation-and-Boundaries/Backend Databases and System Design Boundaries|Backend Databases and System Design Boundaries]]
- [[09-System-Design/00-Orientation-and-Boundaries/Requirements Non-Functional and Workload Modeling|Requirements Non-Functional and Workload Modeling]]
- [[09-System-Design/00-Orientation-and-Boundaries/Failure Domains and Blast Radius Budgets|Failure Domains and Blast Radius Budgets]]
- [[09-System-Design/00-Orientation-and-Boundaries/ADR Discipline for Distributed Decisions|ADR Discipline for Distributed Decisions]]

## Progression

**Understand → Model → Design → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Draw a Mermaid diagram showing Backend, Databases, and System Design ownership for a social feed. Label which track owns Express timeouts, WAL recovery, and fan-out topology.

**Hint:** Start from [[09-System-Design/00-Orientation-and-Boundaries/Backend Databases and System Design Boundaries|Backend Databases and System Design Boundaries]].

**Acceptance criteria:**

- [ ] Three ownership regions with handoff arrows
- [ ] Explicit links to [[07-Backend/README|Backend]] and [[08-Databases/README|Databases]]
- [ ] One anti-pattern called out (e.g., designing B+ trees in System Design)

### Problem 2 — `intermediate`

**Prompt:** List five product failures that look like "bad code" but are topology failures. For each, name the symptom, owning layer, and first diagnostic question.

**Hint:** See [[09-System-Design/00-Orientation-and-Boundaries/Why System Design Exists|Why System Design Exists]].

**Acceptance criteria:**

- [ ] At least one hotspot, one consistency, one multi-region failure
- [ ] Table: symptom → topology cause → first metric
- [ ] No answers that only say "scale the DB"

### Problem 3 — `intermediate`

**Prompt:** Explain why "draw boxes and arrows" without NFRs is not System Design. Give three NFR questions you must ask before proposing Kafka.

**Acceptance criteria:**

- [ ] Distinguishes architecture sketch from design with contracts
- [ ] NFR questions cover latency, durability, and failure
- [ ] Cross-link to [[09-System-Design/00-Orientation-and-Boundaries/Requirements Non-Functional and Workload Modeling|Requirements Non-Functional and Workload Modeling]]

## Model

### Problem 1 — `beginner`

**Prompt:** For a URL shortener MVP, write a workload model: DAU, peak QPS, read/write ratio, object size, retention. State assumptions explicitly.

**Acceptance criteria:**

- [ ] Peak = average × peak factor with justification
- [ ] Storage growth over 1 year estimated
- [ ] Units consistent (bytes, req/s, GB)

### Problem 2 — `intermediate`

**Prompt:** Partition a payments product into failure domains. Assign a blast-radius budget (users/% of traffic) each domain may take down.

**Hint:** Use [[09-System-Design/00-Orientation-and-Boundaries/Failure Domains and Blast Radius Budgets|Failure Domains and Blast Radius Budgets]].

**Acceptance criteria:**

- [ ] Mermaid of domains (auth, ledger, notify, risk)
- [ ] Numeric blast-radius budgets per domain
- [ ] Shared dependency called out as budget risk

### Problem 3 — `advanced`

**Prompt:** Model tenant-skewed SaaS: 1% of tenants produce 60% of writes. Express skew as a workload constraint that must drive partitioning later.

**Acceptance criteria:**

- [ ] Skew quantified (percentile of load)
- [ ] Implication for hot keys / hot shards named
- [ ] Link forward to [[09-System-Design/04-Partitioning-Sharding-and-Placement/Partition Keys Hotspots and Skew|Partition Keys Hotspots and Skew]]

## Design

### Problem 1 — `intermediate`

**Prompt:** Draft an ADR for "synchronous vs asynchronous notification delivery" for order confirmation. Include context, decision, consequences, and rejected alternatives.

**Hint:** Follow [[09-System-Design/00-Orientation-and-Boundaries/ADR Discipline for Distributed Decisions|ADR Discipline for Distributed Decisions]].

**Acceptance criteria:**

- [ ] Context cites latency SLO and durability need
- [ ] At least two rejected alternatives with why
- [ ] Consequences include failure modes and ops cost

### Problem 2 — `intermediate`

**Prompt:** Design a boundary checklist a team must complete before adding a new microservice. Include data ownership, consistency, and blast radius.

**Acceptance criteria:**

- [ ] Checklist has ≥8 items
- [ ] Explicit "when not to split" criteria
- [ ] Handoffs to Backend auth and Databases engines noted

### Problem 3 — `advanced`

**Prompt:** Propose a design review rubric for System Design PRs: what diagrams, capacity numbers, and failure contracts are mandatory.

**Acceptance criteria:**

- [ ] Rubric covers NFR, topology, consistency, failure, rollout
- [ ] Pass/fail examples for a vague "use Redis" design
- [ ] Aligns with track [[09-System-Design/README|System Design]] teaching contract

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** A shared Redis cluster is a dependency of auth, feed, and checkout. Simulate its loss: what is the blast radius, and which products should degrade vs fail closed?

**Acceptance criteria:**

- [ ] Per-product degradation policy
- [ ] Fail-open vs fail-closed justified
- [ ] Budget vs actual blast radius compared

### Problem 2 — `advanced`

**Prompt:** Leadership wants one global "platform DB." Write a failure brief arguing why that collapses blast-radius budgets.

**Acceptance criteria:**

- [ ] Coupling and blast-radius argument with diagram
- [ ] Counterproposal with domain-owned stores
- [ ] Migration risk named without requiring engine internals

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Onboard a new team to System Design standards: write a one-page "how we design" guide covering NFR templates, ADR location, and when to escalate to Architecture track.

**Acceptance criteria:**

- [ ] Template pointers and example links
- [ ] Escalation criteria to [[17-Architecture/README|Architecture]]
- [ ] Interview/exercise practice loop referenced

### Problem 2 — `advanced`

**Prompt:** Two orgs merge stacks. One designs from boxes; the other from SLOs. Design a 90-day alignment plan that does not freeze shipping.

**Acceptance criteria:**

- [ ] Phased adoption of ADR + NFR gates
- [ ] Pilot services and success metrics
- [ ] Explicit non-goals (no rewrite, no engine swap)

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Boundaries | Lists tech | Separates Backend / Databases / System Design with handoffs |
| Modeling | Vague scale | Workload numbers, skew, blast-radius budgets |
| Production | Pretty diagrams | ADRs, failure domains, org adoption plan |

## Related Notes

- [[09-System-Design/_interview/00-Orientation-and-Boundaries|Orientation Interview]]
- [[09-System-Design/code/README|System Design code labs]]
- [[09-System-Design/README|System Design]]
- [[Career/README|Career]]

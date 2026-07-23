---
title: Clone Case Studies and Portfolio Exercises
aliases: [12 Clone Portfolio Exercises]
track: 09-System-Design
topic: clone-case-studies-and-portfolio-exercises
difficulty: advanced
status: active
prerequisites: ["[[09-System-Design/_exercises/11-Reference-Architectures|Reference Architectures Exercises]]"]
tags: [exercises, system-design, portfolio, clones, case-studies]
created: 2026-07-23
updated: 2026-07-23
---

# Clone Case Studies and Portfolio Exercises

Build interview- and portfolio-grade clone designs for Instagram, Discord, Netflix, Jira, and GitHub—each with capacity, media/realtime planes, consistency, and scale-limit honesty.

## Linked Topic

- [[09-System-Design/12-Clone-Case-Studies-and-Portfolio/Instagram Clone Capacity and Media Plane|Instagram Clone Capacity and Media Plane]]
- [[09-System-Design/12-Clone-Case-Studies-and-Portfolio/Discord Clone Realtime Fan-out and Presence|Discord Clone Realtime Fan-out and Presence]]
- [[09-System-Design/12-Clone-Case-Studies-and-Portfolio/Netflix Clone Catalog Playback and CDN|Netflix Clone Catalog Playback and CDN]]
- [[09-System-Design/12-Clone-Case-Studies-and-Portfolio/Jira Clone Search Consistency and Workflow Topology|Jira Clone Search Consistency and Workflow Topology]]
- [[09-System-Design/12-Clone-Case-Studies-and-Portfolio/GitHub Clone Storage Notifications and Scale Limits|GitHub Clone Storage Notifications and Scale Limits]]

## Progression

**Understand → Model → Design → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** For Instagram-like product, separate media plane from social graph/feed plane. What SLOs differ?

**Hint:** [[09-System-Design/12-Clone-Case-Studies-and-Portfolio/Instagram Clone Capacity and Media Plane|Instagram Clone Capacity and Media Plane]].

**Acceptance criteria:**

- [ ] Plane split diagram
- [ ] Distinct SLOs
- [ ] Shared dependencies named

### Problem 2 — `intermediate`

**Prompt:** For Discord-like chat, list realtime requirements: fan-out, presence, ordering. Which are AP-tolerant?

**Hint:** [[09-System-Design/12-Clone-Case-Studies-and-Portfolio/Discord Clone Realtime Fan-out and Presence|Discord Clone Realtime Fan-out and Presence]].

**Acceptance criteria:**

- [ ] Requirement list
- [ ] AP vs CP choices
- [ ] Gateway role sketched

### Problem 3 — `intermediate`

**Prompt:** For Netflix-like streaming, explain catalog vs playback/CDN responsibilities and where DRM/auth sits.

**Hint:** [[09-System-Design/12-Clone-Case-Studies-and-Portfolio/Netflix Clone Catalog Playback and CDN|Netflix Clone Catalog Playback and CDN]].

**Acceptance criteria:**

- [ ] Control vs data plane
- [ ] CDN edge role
- [ ] Auth token path

## Model

### Problem 1 — `beginner`

**Prompt:** Capacity-model Instagram clone: uploads/day, average object size, CDN egress, feed reads. State assumptions.

**Acceptance criteria:**

- [ ] Storage and bandwidth estimates
- [ ] Peak factors
- [ ] Cost-order note

### Problem 2 — `intermediate`

**Prompt:** Model Discord presence: heartbeat interval, online users, update QPS, and acceptable staleness.

**Acceptance criteria:**

- [ ] QPS from heartbeats
- [ ] Staleness budget
- [ ] Fan-out cost to subscribers

### Problem 3 — `advanced`

**Prompt:** Model Jira search consistency: issue update → index visibility lag. Express as workflow SLA.

**Hint:** [[09-System-Design/12-Clone-Case-Studies-and-Portfolio/Jira Clone Search Consistency and Workflow Topology|Jira Clone Search Consistency and Workflow Topology]].

**Acceptance criteria:**

- [ ] Lag SLO
- [ ] Strong-read path for issue view
- [ ] Conflict with analytics indexing

### Problem 4 — `advanced`

**Prompt:** Model GitHub-like git storage + notifications scale limits: when monorepo or notification storms break naive designs.

**Hint:** [[09-System-Design/12-Clone-Case-Studies-and-Portfolio/GitHub Clone Storage Notifications and Scale Limits|GitHub Clone Storage Notifications and Scale Limits]].

**Acceptance criteria:**

- [ ] Storage/scale limit named
- [ ] Notification amplification
- [ ] Honest "won't scale" boundary

## Design

### Problem 1 — `intermediate`

**Prompt:** Design Instagram clone media upload pipeline: client → API → object store → processing → CDN, with virus scan and retry.

**Acceptance criteria:**

- [ ] Sequence diagram
- [ ] Idempotent processing
- [ ] Failure and dead-letter

### Problem 2 — `intermediate`

**Prompt:** Design Discord-like gateway + channel fan-out with per-channel ordering and horizontal gateway scaling.

**Acceptance criteria:**

- [ ] Session stickiness/routing
- [ ] Fan-out topology
- [ ] Presence store choice justified

### Problem 3 — `advanced`

**Prompt:** Design Netflix-like playback URL minting, CDN cache keys, and catalog personalization separation.

**Acceptance criteria:**

- [ ] Tokenized playback URLs
- [ ] Cache key hygiene
- [ ] Personalization not on CDN critical path

### Problem 4 — `advanced`

**Prompt:** Design Jira-like workflow engine + search index dual-write/outbox. Include permission-aware search.

**Acceptance criteria:**

- [ ] Workflow state machine ownership
- [ ] Index update contract
- [ ] AuthZ filter strategy

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** CDN origin shield fails during a Netflix-like premiere. Design shed and regional failover for playback.

**Acceptance criteria:**

- [ ] Playback continuity plan
- [ ] Catalog read degradation OK?
- [ ] Comms/runbook bullets

### Problem 2 — `advanced`

**Prompt:** GitHub-like notification storm from a busy monorepo. Design rate limits, aggregation, and user controls.

**Acceptance criteria:**

- [ ] Aggregation rules
- [ ] Per-user budgets
- [ ] Backoffice kill switch

### Problem 3 — `advanced`

**Prompt:** Discord-like region outage. Which features stay up (message history vs live fan-out)? Design partial availability.

**Acceptance criteria:**

- [ ] Feature matrix
- [ ] Data residency constraints
- [ ] Reconnect storm controls

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Produce a portfolio case study (pick one clone): problem, constraints, topology, capacity, failure modes, and what you would not claim at FAANG scale.

**Acceptance criteria:**

- [ ] 3–6 page design doc
- [ ] Honest scale limits
- [ ] Diagrams + ADR links

### Problem 2 — `advanced`

**Prompt:** Build a comparison matrix across all five clones: consistency class, realtime need, media plane, hardest failure mode.

**Acceptance criteria:**

- [ ] Matrix complete
- [ ] Cross-links to topic notes
- [ ] Interview talking points per row

### Problem 3 — `advanced`

**Prompt:** Tie portfolio work to [[09-System-Design/projects/Distributed Systems Workbench/README|Distributed Systems Workbench]] (or labs): which simulations evidence which clone claims?

**Acceptance criteria:**

- [ ] Evidence map
- [ ] Gaps named
- [ ] Next lab prioritized

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Clones | Feature list | Planes, budgets, failure contracts |
| Scale | Infinite scale claims | Explicit limits and bottlenecks |
| Portfolio | Pretty diagrams | ADRs, evidence, interview narrative |

## Related Notes

- [[09-System-Design/_interview/12-Clone-Case-Studies-and-Portfolio|Clone Portfolio Interview]]
- [[09-System-Design/projects/Distributed Systems Workbench/README|Distributed Systems Workbench]]
- [[09-System-Design/README|System Design]]
- [[Career/README|Career]]

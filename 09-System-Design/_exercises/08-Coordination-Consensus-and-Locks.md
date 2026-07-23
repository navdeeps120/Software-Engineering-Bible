---
title: Coordination Consensus and Locks Exercises
aliases: [08 Coordination Exercises]
track: 09-System-Design
topic: coordination-consensus-and-locks-exercises
difficulty: advanced
status: active
prerequisites: ["[[09-System-Design/_exercises/07-Multi-Region-and-Geo|Multi-Region and Geo Exercises]]"]
tags: [exercises, system-design, consensus, locks, fencing, leader-election]
created: 2026-07-23
updated: 2026-07-23
---

# Coordination Consensus and Locks Exercises

Use leader election and consensus only when needed, apply leases with fencing tokens, reason about clocks and happens-before, and prefer designs that avoid shared mutable coordination.

## Linked Topic

- [[09-System-Design/08-Coordination-Consensus-and-Locks/Leader Election Use Cases and Failure Modes|Leader Election Use Cases and Failure Modes]]
- [[09-System-Design/08-Coordination-Consensus-and-Locks/Consensus Intuition Raft and Paxos for Designers|Consensus Intuition Raft and Paxos for Designers]]
- [[09-System-Design/08-Coordination-Consensus-and-Locks/Distributed Locks Leases and Fencing Tokens|Distributed Locks Leases and Fencing Tokens]]
- [[09-System-Design/08-Coordination-Consensus-and-Locks/Clocks Skew Ordering and Happens-Before|Clocks Skew Ordering and Happens-Before]]
- [[09-System-Design/08-Coordination-Consensus-and-Locks/When Not to Coordinate Avoid Shared Mutable State|When Not to Coordinate Avoid Shared Mutable State]]

## Progression

**Understand → Model → Design → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** List three valid uses of leader election and three anti-uses that should be redesigned.

**Hint:** [[09-System-Design/08-Coordination-Consensus-and-Locks/Leader Election Use Cases and Failure Modes|Leader Election Use Cases and Failure Modes]].

**Acceptance criteria:**

- [ ] Valid vs anti-use table
- [ ] Failure mode for each anti-use
- [ ] Alternative topology suggested

### Problem 2 — `intermediate`

**Prompt:** Explain Raft/Paxos at designer depth: what is agreed, what latency you pay, what fails during partition.

**Hint:** [[09-System-Design/08-Coordination-Consensus-and-Locks/Consensus Intuition Raft and Paxos for Designers|Consensus Intuition Raft and Paxos for Designers]].

**Acceptance criteria:**

- [ ] Consensus purpose (log/value agreement)
- [ ] Majority and availability
- [ ] Not a protocol implementation dump

### Problem 3 — `intermediate`

**Prompt:** Why is a Redis `SETNX` lock unsafe without fencing? What goes wrong under GC pauses?

**Hint:** [[09-System-Design/08-Coordination-Consensus-and-Locks/Distributed Locks Leases and Fencing Tokens|Distributed Locks Leases and Fencing Tokens]].

**Acceptance criteria:**

- [ ] Lease expiry race explained
- [ ] Fencing token requirement
- [ ] Resource-side enforcement

## Model

### Problem 1 — `beginner`

**Prompt:** Model leader failover time vs lease TTL. How does TTL choice affect false failover vs long unavailability?

**Acceptance criteria:**

- [ ] Trade-off curve described
- [ ] Numeric example
- [ ] Product impact

### Problem 2 — `intermediate`

**Prompt:** Model clock skew of ±200 ms across nodes using wall clocks for ordering. Show an incorrect "last write" outcome.

**Hint:** [[09-System-Design/08-Coordination-Consensus-and-Locks/Clocks Skew Ordering and Happens-Before|Clocks Skew Ordering and Happens-Before]].

**Acceptance criteria:**

- [ ] Scenario with inverted order
- [ ] Happens-before alternative
- [ ] When hybrid clocks help / still fail

### Problem 3 — `advanced`

**Prompt:** Model coordination cost: every write takes a lock via etcd. Estimate throughput ceiling vs partition-local writes.

**Acceptance criteria:**

- [ ] Rough throughput comparison
- [ ] Latency tax
- [ ] Redesign that removes global lock

## Design

### Problem 1 — `intermediate`

**Prompt:** Design a singleton scheduler with leader election, lease renewal, and fencing on job claims.

**Acceptance criteria:**

- [ ] Election + lease flow
- [ ] Fencing on job execution store
- [ ] Dual-leader prevention story

### Problem 2 — `intermediate`

**Prompt:** Design idempotent side effects without distributed locks using compare-and-set / unique constraints.

**Hint:** [[09-System-Design/08-Coordination-Consensus-and-Locks/When Not to Coordinate Avoid Shared Mutable State|When Not to Coordinate Avoid Shared Mutable State]].

**Acceptance criteria:**

- [ ] Lock-free approach
- [ ] Failure retries safe
- [ ] When lock still required admitted

### Problem 3 — `advanced`

**Prompt:** Design metadata consensus for a small control plane while keeping the data plane coordination-free.

**Acceptance criteria:**

- [ ] Control vs data plane split
- [ ] Blast radius of consensus outage
- [ ] ADR justifying the split

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Network partition elects two leaders briefly. Trace how fencing prevents double processing.

**Acceptance criteria:**

- [ ] Sequence of tokens
- [ ] Resource rejects stale leader
- [ ] User-visible impact minimized

### Problem 2 — `advanced`

**Prompt:** Consensus cluster loses quorum. What product features must degrade vs hard-fail? Design the matrix.

**Acceptance criteria:**

- [ ] Feature matrix
- [ ] Read-only modes
- [ ] Operator promote/unsafe options named with risk

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Write an on-call guide: "lock timeouts spiking." Separate client bugs, lease misconfig, and store overload.

**Acceptance criteria:**

- [ ] Hypothesis tree
- [ ] Safe mitigations
- [ ] Metrics required

### Problem 2 — `advanced`

**Prompt:** Org overuses distributed locks. Propose a 60-day reduction program with redesign templates.

**Acceptance criteria:**

- [ ] Inventory of lock uses
- [ ] Redesign patterns library
- [ ] Success metric (lock QPS down, incidents down)

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Consensus | Protocol trivia | Designer-level cost and use cases |
| Locks | SETNX pride | Leases + fencing + resource checks |
| Restraint | Coordinate everything | Avoid shared mutable state when possible |

## Related Notes

- [[09-System-Design/_interview/08-Coordination-Consensus-and-Locks|Coordination Interview]]
- [[09-System-Design/README|System Design]]
- [[Career/README|Career]]

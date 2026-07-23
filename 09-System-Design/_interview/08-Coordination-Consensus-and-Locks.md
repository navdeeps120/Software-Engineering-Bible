---
title: Coordination Consensus and Locks Interview
aliases: [08 Coordination Interview]
track: 09-System-Design
topic: coordination-consensus-and-locks-interview
difficulty: advanced
status: active
prerequisites: ["[[09-System-Design/08-Coordination-Consensus-and-Locks/When Not to Coordinate Avoid Shared Mutable State|When Not to Coordinate Avoid Shared Mutable State]]"]
tags: [interviews, system-design, consensus, locks, fencing]
created: 2026-07-23
updated: 2026-07-23
---

# Coordination Consensus and Locks Interview

## Linked Topic

- [[09-System-Design/08-Coordination-Consensus-and-Locks/Leader Election Use Cases and Failure Modes|Leader Election Use Cases and Failure Modes]]
- [[09-System-Design/08-Coordination-Consensus-and-Locks/Consensus Intuition Raft and Paxos for Designers|Consensus Intuition Raft and Paxos for Designers]]
- [[09-System-Design/08-Coordination-Consensus-and-Locks/Distributed Locks Leases and Fencing Tokens|Distributed Locks Leases and Fencing Tokens]]
- [[09-System-Design/08-Coordination-Consensus-and-Locks/Clocks Skew Ordering and Happens-Before|Clocks Skew Ordering and Happens-Before]]
- [[09-System-Design/08-Coordination-Consensus-and-Locks/When Not to Coordinate Avoid Shared Mutable State|When Not to Coordinate Avoid Shared Mutable State]]

## How to Practice

1. Prefer designs that avoid global coordination.
2. If locking, require leases + fencing on the resource.
3. Keep Raft/Paxos at designer depth—costs and failure, not code.
4. Distrust wall-clock ordering.

## Junior

1. Name a good use of leader election and a bad one.

   - **Strong:** Singleton scheduler vs per-request mutex via election
   - **Weak:** Election for everything

2. What is a lease vs a lock held forever?

   - **Strong:** Expiry, renewal, failure detection trade-off
   - **Weak:** Same as mutex

3. Why are wall clocks dangerous for ordering?

   - **Strong:** Skew → wrong LWW; happens-before / versions
   - **Weak:** NTP fixes all

## Mid

4. Explain fencing tokens for distributed locks.

   - **Strong:** Monotonic token; resource rejects stale; GC pause story
   - **Weak:** SETNX is enough

5. Raft for designers: what do you pay for consensus?

   - **Strong:** Majority, latency, availability on partition
   - **Weak:** Protocol step dump

6. How do you implement idempotent side effects without locks?

   - **Strong:** CAS/unique constraints/outbox; when lock still needed
   - **Weak:** Cannot without locks

7. Leader failover vs lease TTL trade-off?

   - **Strong:** False failover vs long unavailability; numbers
   - **Weak:** Default TTL

## Senior

8. Design a singleton job runner safely.

   - **Strong:** Election, lease, fencing on claim store, dual-leader story
   - **Weak:** Cron on one VM

9. Consensus quorum lost—what stays up?

   - **Strong:** Feature matrix; read-only; unsafe promote risks
   - **Weak:** Entire product down always

## Staff

10. Org overuses etcd locks—reduction program?

    - **Strong:** Inventory, redesign patterns, metrics (lock QPS, incidents)
    - **Weak:** Ban overnight

11. Control plane consensus vs coordination-free data plane.

    - **Strong:** Split, blast radius, ADR
    - **Weak:** Consensus on every write

12. How do you review a PR that adds a distributed lock?

    - **Strong:** Checklist: lease, fencing, TTL, alternative, failure test
    - **Weak:** LGTM if compiles

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Consensus | Trivia | Cost/use cases |
| Locks | SETNX pride | Fencing + resource checks |
| Restraint | Coordinate all | Avoid shared mutable state |

## Related Notes

- [[09-System-Design/_exercises/08-Coordination-Consensus-and-Locks|Coordination Exercises]]
- [[Career/README|Career]]
- [[09-System-Design/README|System Design]]

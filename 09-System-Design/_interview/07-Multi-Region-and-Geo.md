---
title: Multi-Region and Geo Interview
aliases: [07 Multi-Region Interview]
track: 09-System-Design
topic: multi-region-and-geo-interview
difficulty: advanced
status: active
prerequisites: ["[[09-System-Design/07-Multi-Region-and-Geo/Multi-Region Active-Passive Active-Active Patterns|Multi-Region Active-Passive Active-Active Patterns]]"]
tags: [interviews, system-design, multi-region, rpo, rto]
created: 2026-07-23
updated: 2026-07-23
---

# Multi-Region and Geo Interview

## Linked Topic

- [[09-System-Design/07-Multi-Region-and-Geo/Single-Primary Multi-Primary and Leaderless Product Views|Single-Primary Multi-Primary and Leaderless Product Views]]
- [[09-System-Design/07-Multi-Region-and-Geo/Sync Async and Semi-Sync as Latency SLOs|Sync Async and Semi-Sync as Latency SLOs]]
- [[09-System-Design/07-Multi-Region-and-Geo/Multi-Region Active-Passive Active-Active Patterns|Multi-Region Active-Passive Active-Active Patterns]]
- [[09-System-Design/07-Multi-Region-and-Geo/Failover RPO RTO and Split-Brain Product Policy|Failover RPO RTO and Split-Brain Product Policy]]
- [[09-System-Design/07-Multi-Region-and-Geo/Replica Lag as User-Facing Consistency Budget|Replica Lag as User-Facing Consistency Budget]]

## How to Practice

1. State write ownership before drawing regions.
2. Give numeric RPO/RTO and lag budgets.
3. Define split-brain product policy explicitly.
4. Separate AP-friendly domains from single-primary domains.

## Junior

1. What is the difference between RPO and RTO?

   - **Strong:** Data loss window vs downtime window; examples
   - **Weak:** Same thing / HA buzzwords

2. Why is sync cross-region replication often incompatible with tight latency SLOs?

   - **Strong:** RTT in write path; p99 math
   - **Weak:** "Networks are fast"

3. Active-passive vs active-active in one sentence each.

   - **Strong:** Single write region vs multi-write with conflicts
   - **Weak:** Both mean multi-region HA

## Mid

4. Choose topology for a SaaS control plane needing RPO ≤ 30s, RTO ≤ 15m.

   - **Strong:** Active-passive with lag monitoring, promote runbook
   - **Weak:** Active-active without conflict plan

5. How do you express replica lag as a user-facing budget?

   - **Strong:** Stale-read scenarios; sticky/primary for critical reads
   - **Weak:** "Replication is async"

6. Semi-sync—what product promise does it make?

   - **Strong:** Durability to ack subset; latency trade-off
   - **Weak:** Protocol trivia only

7. When is multi-primary justified?

   - **Strong:** Regional write latency need + conflict-tolerant data
   - **Weak:** Always for "global scale"

## Senior

8. Primary fails; lag is 45s vs RPO 30s—do you promote?

   - **Strong:** Trade data loss vs downtime; disclose; partial freeze option
   - **Weak:** Always promote immediately

9. Design sticky regional affinity with failover for RY W.

   - **Strong:** Affinity mechanism; exception path; consistency exceptions
   - **Weak:** GeoDNS only

## Staff

10. Split-brain for 3 minutes at 500 w/s—product policy?

    - **Strong:** Conflict volume estimate; accept/merge/reject; fencing
    - **Weak:** "Prevent split-brain" only

11. Domain-split: presence AP active-active, billing single-primary.

    - **Strong:** Matrix, cross-domain risks, ADR
    - **Weak:** One mode for all data

12. Multi-region game day: what do you measure and fix?

    - **Strong:** RTO/RPO actuals, steering, lag, customer comms gaps
    - **Weak:** Tabletop only forever

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Topology | Multi-region = HA | Write ownership + conflicts |
| Budgets | Vague | Numeric RPO/RTO/lag |
| Policy | Hope | Split-brain + disclosure |

## Related Notes

- [[09-System-Design/_exercises/07-Multi-Region-and-Geo|Multi-Region Exercises]]
- [[09-System-Design/projects/Multi-Region Failover Playbook Lab/README|Multi-Region Failover Playbook Lab]]
- [[Career/README|Career]]
